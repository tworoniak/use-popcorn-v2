// import { useEffect, useState } from 'react';
// import type { Movie } from '../data/movies'; // adjust path if needed

// const KEY = 'f84fc31d';

// type OmdbSearchMovie = {
//   imdbID: string;
//   Title: string;
//   Year: string;
//   Poster: string;
//   Type?: string;
// };

// type OmdbSearchResponse =
//   | {
//       Response: 'True';
//       Search: OmdbSearchMovie[];
//       totalResults: string;
//     }
//   | {
//       Response: 'False';
//       Error: string;
//     };

// export function useMovies(query: string) {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     const controller = new AbortController();

//     async function fetchMovies() {
//       try {
//         setIsLoading(true);
//         setError('');

//         const res = await fetch(
//           `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(query)}`,
//           { signal: controller.signal },
//         );

//         if (!res.ok) {
//           throw new Error('Something went wrong with fetching movies');
//         }

//         const data: OmdbSearchResponse = await res.json();

//         if (data.Response === 'False') {
//           throw new Error(data.Error || 'Movie not found');
//         }

//         // OMDb Search items match your Movie type shape (imdbID/Title/Year/Poster)
//         setMovies(data.Search as Movie[]);
//       } catch (err: unknown) {
//         // Ignore aborts
//         if (err instanceof DOMException && err.name === 'AbortError') return;

//         const message =
//           err instanceof Error ? err.message : 'Unknown error occurred';

//         console.log(message);
//         setError(message);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     if (query.trim().length < 3) {
//       setMovies([]);
//       setError('');
//       return;
//     }

//     fetchMovies();

//     return () => {
//       controller.abort();
//     };
//   }, [query]);

//   return { movies, isLoading, error };
// }

import { useEffect, useState } from 'react';
import type { Movie } from '../data/movies';

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY ?? 'f84fc31d';

type OmdbSearchMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
};

type OmdbSearchSuccess = {
  Response: 'True';
  Search: OmdbSearchMovie[];
  totalResults: string; // OMDb returns a string
};

type OmdbSearchError = {
  Response: 'False';
  Error: string;
};

type OmdbSearchResponse = OmdbSearchSuccess | OmdbSearchError;

export function useMovies(query: string, page: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
            query,
          )}&page=${page}`,
          { signal: controller.signal },
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies');

        const data: OmdbSearchResponse = await res.json();

        if (data.Response === 'False') {
          setMovies([]);
          setTotalResults(0);
          throw new Error(data.Error || 'Movie not found');
        }

        setMovies(data.Search as Movie[]);
        setTotalResults(Number(data.totalResults) || 0);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.trim().length < 3) {
      setMovies([]);
      setError('');
      setTotalResults(0);
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query, page]);

  return { movies, isLoading, error, totalResults };
}
