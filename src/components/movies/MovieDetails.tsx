// src/components/movies/MovieDetails.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import Poster from '../ui/Poster';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';
import StarRating from '../ui/StarRating';

import { useKey } from '../../hooks/useKey';
import { useSwipeToCloseDrag } from '../../hooks/useSwipeToCloseDrag';

import type { WatchedMovie } from '../../types/movies';

import {
  getCachedMovieDetails,
  prefetchMovieDetails,
  type OmdbMovieSuccess,
} from '../../api/omdbDetailsCache';

type MovieDetailsProps = {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
  onTitleChange?: (title: string | null) => void;
  onViewed?: (movie: {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
  }) => void;
};

function parseRuntime(runtime: string): number {
  const n = Number(runtime.split(' ')[0]);
  return Number.isFinite(n) ? n : 0;
}

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  onTitleChange,
  onViewed,
  watched,
}: MovieDetailsProps) {
  // attach swipe handlers to the *outermost* root of the details panel
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);

  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    setRootEl(node);
  }, []);

  const [movie, setMovie] = useState<OmdbMovieSuccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const [userRating, setUserRating] = useState<number>(0);
  const countRef = useRef(0);

  const [retryKey, setRetryKey] = useState(0);
  const retry = () => setRetryKey((k) => k + 1);

  const watchedEntry = watched.find((m) => m.imdbID === selectedId);
  const isWatched = !!watchedEntry;
  const watchedUserRating = watchedEntry?.userRating ?? 0;

  // inside MovieDetails component
  const lastViewedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!onViewed) return;
    if (!movie?.Title) return;

    if (lastViewedIdRef.current === selectedId) return;
    lastViewedIdRef.current = selectedId;

    onViewed({
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
    });
  }, [selectedId, movie?.Title, movie?.Year, movie?.Poster, onViewed]);

  const handleClose = useCallback(() => {
    onCloseMovie();
  }, [onCloseMovie]);

  useSwipeToCloseDrag(rootEl, handleClose, {
    enabled: true,
    thresholdPx: 110,
    velocityPxPerMs: 0.6,
    slopPx: 10,
    durationMs: 180,
  });

  useKey('Escape', handleClose);

  useEffect(() => {
    onTitleChange?.(movie?.Title ? `Movie | ${movie.Title}` : null);
    return () => onTitleChange?.(null);
  }, [movie?.Title, onTitleChange]);

  // Prefill rating when switching movies / opening details
  useEffect(() => {
    setUserRating(watchedUserRating);
    countRef.current = 0;
  }, [selectedId, watchedUserRating]);

  useEffect(() => {
    if (userRating > 0) countRef.current++;
  }, [userRating]);

  // Load details (cache-first, then refresh)
  useEffect(() => {
    const controller = new AbortController();
    const cached = getCachedMovieDetails(selectedId);
    const forceFetch = retryKey > 0;

    if (cached && !forceFetch) {
      setMovie(cached);
      setError('');
      setIsLoading(false);
    }

    async function load() {
      try {
        setError('');

        const hadData = !!cached || !!movie;
        if (!hadData) setIsLoading(true);
        else setIsFetching(true);

        await prefetchMovieDetails(selectedId, controller.signal);

        const fresh = getCachedMovieDetails(selectedId);
        if (fresh) setMovie(fresh);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);

        if (!cached) setMovie(null);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
        if (retryKey > 0) setRetryKey(0);
      }
    }

    load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, retryKey]);

  // Recently viewed callback (upgrade entry with the “best” data)
  useEffect(() => {
    if (!movie) return;

    onViewed?.({
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
    });
  }, [movie, onViewed, selectedId]);

  function handleAdd() {
    if (!movie) return;

    if (isWatched && userRating === watchedUserRating) {
      handleClose();
      return;
    }

    const now = Date.now();

    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating) || 0,
      runtime: parseRuntime(movie.Runtime),
      userRating,
      countRatingDecisions: countRef.current,
      createdAt: watchedEntry?.createdAt ?? now,
      updatedAt: now,
    };

    onAddWatched(newWatchedMovie);
    handleClose();
  }

  if (isLoading && !movie) {
    return (
      <div className='details' ref={setRootRef}>
        <Loader />
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className='details' ref={setRootRef}>
        <ErrorMessage message={error} onRetry={retry} />
      </div>
    );
  }

  if (!movie) return <div className='details' ref={setRootRef} />;

  return (
    <div className='details' ref={setRootRef}>
      <header>
        <button className='btn-back' onClick={handleClose}>
          <ArrowLeft size={24} />
        </button>

        <Poster src={movie.Poster} alt={`Poster of ${movie.Title}`} />

        <div className='details-overview'>
          <h2>
            {movie.Title}{' '}
            {isFetching && (
              <span className='details-updating' aria-live='polite'>
                Updating…
              </span>
            )}
          </h2>

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
          <StarRating
            maxRating={10}
            size={24}
            rating={userRating}
            onSetRating={setUserRating}
            label='Your rating'
          />

          {!isWatched ? (
            userRating > 0 && (
              <button className='btn-add' onClick={handleAdd}>
                + Add to list
              </button>
            )
          ) : userRating !== watchedUserRating ? (
            <button className='btn-add' onClick={handleAdd}>
              Update rating
            </button>
          ) : (
            <p>
              Your rating: {watchedUserRating} <span>⭐️</span>
            </p>
          )}

          {error && (
            <p className='details-error' role='status' aria-live='polite'>
              <span>⛔️</span> {error}{' '}
              <button
                type='button'
                className='btn-retry-inline'
                onClick={retry}
              >
                Retry
              </button>
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
