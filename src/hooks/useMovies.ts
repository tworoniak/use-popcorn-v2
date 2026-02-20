// src/hooks/useMovies.ts
import { useEffect, useState, useRef } from 'react';
import type { Movie } from '../data/movies';

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY ?? 'f84fc31d';

type OmdbSearchSuccess = {
  Response: 'True';
  Search: Movie[];
  totalResults: string;
};

type OmdbSearchError = {
  Response: 'False';
  Error: string;
};

type OmdbSearchResponse = OmdbSearchSuccess | OmdbSearchError;

type CacheEntry = {
  movies: Movie[];
  totalResults: number;
  ts: number;
};

// module-level in-memory cache (lives for the page lifecycle)
const searchCache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 80;

function makeKey(query: string, page: number) {
  return `${query.toLowerCase()}::${page}`;
}

function pruneCache() {
  if (searchCache.size <= MAX_CACHE_ENTRIES) return;
  const entries = Array.from(searchCache.entries()).sort(
    (a, b) => a[1].ts - b[1].ts,
  );
  const removeCount = searchCache.size - MAX_CACHE_ENTRIES;
  for (let i = 0; i < removeCount; i++) {
    searchCache.delete(entries[i][0]);
  }
}

/**
 * useMovies - stale-while-revalidate caching for OMDb search
 *
 * @param query - search query (string)
 * @param page  - page number (1-based)
 *
 * returns { movies, totalResults, isLoading, isFetching, error, retry }
 */
export function useMovies(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  // isLoading = initial load (no data yet)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // isFetching = background fetch (keep old data visible)
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // retryKey used to force re-fetch (bypasses short-circuit that returns early)
  const [retryKey, setRetryKey] = useState(0);
  const retry = () => setRetryKey((k) => k + 1);

  // keep a ref to the latest key so request callbacks can compare
  const lastFetchKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const q = query.trim();

    // guard: too short => clear state
    if (q.length < 3) {
      setMovies([]);
      setTotalResults(0);
      setError('');
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    const key = makeKey(q, page);
    const cached = searchCache.get(key);
    const forceFetch = retryKey > 0;

    // If cached and not forceFetch: show cached immediately.
    // (we do this *before* issuing the background fetch so UI is instant)
    if (cached && !forceFetch) {
      setMovies(cached.movies);
      setTotalResults(cached.totalResults);
      setError('');
      setIsLoading(false);
      // we'll still fetch in background and set isFetching below
    }

    const controller = new AbortController();
    lastFetchKeyRef.current = key;

    async function fetchMovies() {
      try {
        setError('');

        const hadData = !!(cached && !forceFetch) || movies.length > 0;

        // If we already had data (from cache or previous results), mark background fetching.
        // Otherwise we are doing the initial loading.
        if (!hadData) {
          setIsLoading(true);
        } else {
          setIsFetching(true);
        }

        const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(q)}&page=${page}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error('Something went wrong fetching movies');

        const data: OmdbSearchResponse = await res.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found');
        }

        const nextMovies = data.Search ?? [];
        const nextTotal = Number(data.totalResults) || 0;

        // Compare to cache (or to current state) and update if different
        const prev = searchCache.get(key);
        const prevMovies = prev?.movies ?? null;
        const prevTotal = prev?.totalResults ?? null;

        // quick shallow comparison: length and first/last imdbID plus totalResults
        const changed =
          prevMovies === null ||
          prevTotal === null ||
          prevTotal !== nextTotal ||
          prevMovies.length !== nextMovies.length ||
          (nextMovies.length > 0 &&
            (prevMovies[0]?.imdbID !== nextMovies[0]?.imdbID ||
              prevMovies[nextMovies.length - 1]?.imdbID !==
                nextMovies[nextMovies.length - 1]?.imdbID));

        if (changed) {
          // update state only if this fetch is still the latest for this key
          // (avoid race where a later fetch finished earlier)
          if (lastFetchKeyRef.current === key) {
            setMovies(nextMovies);
            setTotalResults(nextTotal);
          }

          // update cache with fresh data
          searchCache.set(key, {
            movies: nextMovies,
            totalResults: nextTotal,
            ts: Date.now(),
          });
          pruneCache();
        } else {
          // still update ts to bump recency
          searchCache.set(key, {
            movies: nextMovies,
            totalResults: nextTotal,
            ts: Date.now(),
          });
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
        // reset retryKey after a fetch (so subsequent renders go back to normal caching)
        if (retryKey > 0) {
          setRetryKey(0);
        }
      }
    }

    // always fetch (stale-while-revalidate): even when we had cache, we refresh in background
    fetchMovies();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, retryKey]);

  return { movies, totalResults, isLoading, isFetching, error, retry };
}
