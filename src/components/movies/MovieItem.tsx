import type { Movie } from '../../data/movies';
import Poster from '../ui/Poster';

type MovieItemProps = {
  movie: Movie;
  selectedId: string | null;
  onSelectMovie: (id: string) => void;
};

export default function MovieItem({
  movie,
  selectedId,
  onSelectMovie,
}: MovieItemProps) {
  const isSelected = selectedId === movie.imdbID;

  return (
    <li
      className={isSelected ? 'selected' : ''}
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <Poster src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
