import type { WatchedMovie } from '../../data/movies';
import Poster from '../ui/Poster';
import { Trash2 } from 'lucide-react';

type Props = {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
};

export default function WatchedMovieItem({ movie, onDeleteWatched }: Props) {
  return (
    <li>
      <Poster src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>

      <button
        className='btn-delete'
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
