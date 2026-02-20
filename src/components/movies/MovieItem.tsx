import { useRef } from 'react';
import type { Movie } from '../../types/movies';
import { prefetchMovieDetails } from '../../api/omdbDetailsCache';
import Poster from '../ui/Poster';

type MovieItemProps = {
  movie: Movie;
  selectedId: string | null;
  onSelectMovie: (id: string) => void;
  isWatched: boolean;
};

export default function MovieItem({
  movie,
  selectedId,
  onSelectMovie,
  isWatched,
}: MovieItemProps) {
  const isSelected = selectedId === movie.imdbID;

  const holdTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function startHoldPrefetch() {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    holdTimerRef.current = window.setTimeout(() => {
      prefetchMovieDetails(movie.imdbID, abortRef.current?.signal).catch(
        () => {},
      );
    }, 250);
  }

  function cancelHoldPrefetch() {
    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;

    abortRef.current?.abort();
    abortRef.current = null;
  }

  return (
    <li
      className={`${isSelected ? 'selected' : ''} ${isWatched ? 'watched' : ''}`}
      onClick={() => onSelectMovie(movie.imdbID)}
      onPointerEnter={() => prefetchMovieDetails(movie.imdbID).catch(() => {})}
      onTouchStart={startHoldPrefetch}
      onTouchMove={cancelHoldPrefetch}
      onTouchEnd={cancelHoldPrefetch}
      onTouchCancel={cancelHoldPrefetch}
    >
      <Poster src={movie.Poster} alt={`${movie.Title} poster`} />

      <div className='movie-meta'>
        <div>
          <h3>{movie.Title}</h3>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>

        <div>
          {isWatched && <span className='badge badge--watched'>✓ Watched</span>}
        </div>
      </div>
    </li>
  );
}
