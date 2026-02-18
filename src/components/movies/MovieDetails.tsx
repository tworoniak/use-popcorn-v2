import { useEffect, useRef, useState } from 'react';
import StarRating from '../ui/StarRating';
import { useKey } from '../../hooks/useKey';
import type { WatchedMovie } from '../../data/movies';
import Loader from '../ui/Loader';
import Poster from '../ui/Poster';
import { ArrowLeft } from 'lucide-react';

// Prefer env var, fallback is ok for local dev.
const OMDB_KEY = import.meta.env.VITE_OMDB_KEY ?? 'f84fc31d';

type OmdbMovieSuccess = {
  Response: 'True';
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string; // "148 min"
  imdbRating: string; // "8.8"
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
};

type OmdbMovieError = {
  Response: 'False';
  Error: string;
};

type OmdbMovieResponse = OmdbMovieSuccess | OmdbMovieError;

type MovieDetailsProps = {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
};

function parseRuntime(runtime: string): number {
  // runtime like "148 min" or "N/A"
  const n = Number(runtime.split(' ')[0]);
  return Number.isFinite(n) ? n : 0;
}

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<OmdbMovieSuccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating > 0) countRef.current++;
  }, [userRating]);

  const isWatched = watched.some((m) => m.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (m) => m.imdbID === selectedId,
  )?.userRating;

  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const controller = new AbortController();

    async function getMovieDetails() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${selectedId}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error('Failed to fetch movie details');

        const data: OmdbMovieResponse = await res.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found');
        }

        setMovie(data);
      } finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();

    return () => controller.abort();
  }, [selectedId]);

  useEffect(() => {
    if (!movie?.Title) return;
    document.title = `Movie | ${movie.Title}`;
    return () => {
      document.title = 'usePopcorn v2.0';
    };
  }, [movie?.Title]);

  function handleAdd() {
    if (!movie) return;

    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating) || 0,
      runtime: parseRuntime(movie.Runtime),
      userRating,
      countRatingDecisions: countRef.current,
      createdAt: Date.now(),
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  if (isLoading)
    return (
      <div className='details'>
        <Loader />
      </div>
    );
  if (!movie) return <div className='details' />;

  return (
    <div className='details'>
      <header>
        <button className='btn-back' onClick={onCloseMovie}>
          <ArrowLeft size={24} />
        </button>

        <Poster src={movie.Poster} alt={`Poster of ${movie.Title}`} />

        <div className='details-overview'>
          <h2>{movie.Title}</h2>
          <p>
            {movie.Released} &bull; {movie.Runtime}
          </p>
          <p>{movie.Genre}</p>
          <p>
            <span>⭐️</span>
            {movie.imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className='rating'>
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className='btn-add' onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              You rated this movie {watchedUserRating} <span>⭐️</span>
            </p>
          )}
        </div>

        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring {movie.Actors}</p>
        <p>Directed by {movie.Director}</p>
      </section>
    </div>
  );
}
