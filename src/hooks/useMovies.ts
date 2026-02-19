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

export function useMovies(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false); // initial load (no data yet)
  const [isFetching, setIsFetching] = useState(false); // background fetch (keep old data)
  const [error, setError] = useState('');

  const [retryKey, setRetryKey] = useState(0);
  function retry() {
    setRetryKey((k) => k + 1);
  }

  useEffect(() => {
    const q = query.trim();

    // guard: too short => reset
    if (q.length < 3) {
      setMovies([]);
      setTotalResults(0);
      setError('');
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();

    async function fetchMovies() {
      const hasData = movies.length > 0;

      try {
        setError('');

        // If we already have results, treat new request as background fetching
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

        setMovies(data.Search ?? []);
        setTotalResults(Number(data.totalResults) || 0);
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
    // IMPORTANT: include page/query/retryKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, retryKey]);

  return { movies, totalResults, isLoading, isFetching, error, retry };
}
