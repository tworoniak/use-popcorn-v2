import { useEffect, useRef, useState } from 'react';
import StarRating from '../ui/StarRating';
import { useKey } from '../../hooks/useKey';
import type { WatchedMovie } from '../../data/movies';
import Loader from '../ui/Loader';
import Poster from '../ui/Poster';
import ErrorMessage from '../ui/ErrorMessage';
import { ArrowLeft } from 'lucide-react';

// Prefer env var, fallback is ok for local dev.
const OMDB_KEY = import.meta.env.VITE_OMDB_KEY ?? 'f84fc31d';

type OmdbMovieSuccess = {
  Response: 'True';
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string; // "148 min" or "N/A"
  imdbRating: string; // "8.8" or "N/A"
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
  const n = Number(runtime.split(' ')[0]);
  return Number.isFinite(n) ? n : 0;
}

/* ---------------------------
   In-memory cache (module-level)
---------------------------- */
type DetailsCacheEntry = { movie: OmdbMovieSuccess; ts: number };
const detailsCache = new Map<string, DetailsCacheEntry>();
const MAX_DETAILS_CACHE = 80;

function pruneDetailsCache() {
  if (detailsCache.size <= MAX_DETAILS_CACHE) return;

  const entries = Array.from(detailsCache.entries()).sort(
    (a, b) => a[1].ts - b[1].ts,
  );
  const removeCount = detailsCache.size - MAX_DETAILS_CACHE;

  for (let i = 0; i < removeCount; i++) {
    detailsCache.delete(entries[i][0]);
  }
}

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<OmdbMovieSuccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // background refresh
  const [error, setError] = useState<string>('');

  const [userRating, setUserRating] = useState<number>(0);
  const countRef = useRef(0);

  const [retryKey, setRetryKey] = useState(0);
  const retry = () => setRetryKey((k) => k + 1);

  // used to avoid races when quickly switching movies
  const lastFetchIdRef = useRef<string | null>(null);

  const isWatched = watched.some((m) => m.imdbID === selectedId);
  const watchedUserRating =
    watched.find((m) => m.imdbID === selectedId)?.userRating ?? 0;

  // Prefill draft rating when opening / switching movies
  useEffect(() => {
    setUserRating(watchedUserRating);
    countRef.current = 0;
  }, [selectedId, watchedUserRating]);

  useEffect(() => {
    if (userRating > 0) countRef.current++;
  }, [userRating]);

  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const controller = new AbortController();
    const cached = detailsCache.get(selectedId);
    const forceFetch = retryKey > 0;

    lastFetchIdRef.current = selectedId;

    // Serve cached immediately (instant open)
    if (cached && !forceFetch) {
      setMovie(cached.movie);
      setError('');
      setIsLoading(false);
      // we'll still revalidate in background below
    }

    async function getMovieDetails() {
      try {
        setError('');

        const hadData = !!(cached && !forceFetch) || !!movie;

        if (!hadData) setIsLoading(true);
        else setIsFetching(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${selectedId}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error('Failed to fetch movie details');

        const data: OmdbMovieResponse = await res.json();

        if (data.Response === 'False') {
          throw new Error(data.Error || 'Movie not found');
        }

        // Update state only if this is still the selected movie (avoid race)
        if (lastFetchIdRef.current === selectedId) {
          setMovie(data);
        }

        // cache it
        detailsCache.set(selectedId, { movie: data, ts: Date.now() });
        pruneDetailsCache();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message =
          err instanceof Error ? err.message : 'Unknown error occurred';

        setError(message);

        // Keep cached movie visible if present; otherwise clear
        if (!cached) setMovie(null);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
        if (retryKey > 0) setRetryKey(0);
      }
    }

    // stale-while-revalidate: always fetch (unless we want TTL logic)
    getMovieDetails();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, retryKey]);

  useEffect(() => {
    if (!movie?.Title) return;
    document.title = `Movie | ${movie.Title}`;
    return () => {
      document.title = 'usePopcorn v2.0';
    };
  }, [movie?.Title]);

  function handleAdd() {
    if (!movie) return;

    // if watched and unchanged rating, just close
    if (isWatched && userRating === watchedUserRating) {
      onCloseMovie();
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
      createdAt: watched.find((m) => m.imdbID === selectedId)?.createdAt ?? now,
      updatedAt: now,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // Loading: show loader only when we have nothing to display
  if (isLoading && !movie)
    return (
      <div className='details'>
        <Loader />
      </div>
    );

  if (error && !movie)
    return (
      <div className='details'>
        <ErrorMessage message={error} onRetry={retry} />
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

          {/* If fetch failed but we have cached content, show non-blocking error */}
          {error && movie && (
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
