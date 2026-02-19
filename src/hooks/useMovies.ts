import { useEffect, useState } from 'react';
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

// ✅ module-level cache (persists while the page is open)
const searchCache = new Map<string, CacheEntry>();

function makeKey(query: string, page: number) {
  return `${query.toLowerCase()}::${page}`;
}

export function useMovies(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const [retryKey, setRetryKey] = useState(0);
  function retry() {
    // retry bypasses cache by changing retryKey
    setRetryKey((k) => k + 1);
  }

  useEffect(() => {
    const q = query.trim();

    if (q.length < 3) {
      setMovies([]);
      setTotalResults(0);
      setError('');
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    const key = makeKey(q, page);

    // ✅ 1) Serve from cache immediately (instant UI)
    // Only do this for normal runs, not explicit retry
    if (retryKey === 0) {
      const cached = searchCache.get(key);
      if (cached) {
        setMovies(cached.movies);
        setTotalResults(cached.totalResults);
        setError('');
        setIsLoading(false);
        setIsFetching(false);
        return;
      }
    }

    const MAX_CACHE_ENTRIES = 50;

    function pruneCache() {
      if (searchCache.size <= MAX_CACHE_ENTRIES) return;

      // remove oldest entries
      const entries = Array.from(searchCache.entries()).sort(
        (a, b) => a[1].ts - b[1].ts,
      );
      const removeCount = searchCache.size - MAX_CACHE_ENTRIES;

      for (let i = 0; i < removeCount; i++) {
        searchCache.delete(entries[i][0]);
      }
    }

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setError('');

        // Keep old results visible while fetching new ones
        const hasData = movies.length > 0;
        if (!hasData) setIsLoading(true);
        else setIsFetching(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
            q,
          )}&page=${page}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error('Something went wrong fetching movies');

        const data: OmdbSearchResponse = await res.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found');
        }

        const nextMovies = data.Search ?? [];
        const nextTotal = Number(data.totalResults) || 0;

        setMovies(nextMovies);
        setTotalResults(nextTotal);

        // ✅ 2) Write to cache
        searchCache.set(key, {
          movies: nextMovies,
          totalResults: nextTotal,
          ts: Date.now(),
        });
        pruneCache();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    }

    fetchMovies();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, retryKey]);

  return { movies, totalResults, isLoading, isFetching, error, retry };
}
