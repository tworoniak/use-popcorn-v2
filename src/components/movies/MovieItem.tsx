import type { Movie } from '../../data/movies';
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

  return (
    <li
      className={`${isSelected ? 'selected' : ''} ${isWatched ? 'watched' : ''}`}
      onClick={() => onSelectMovie(movie.imdbID)}
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
