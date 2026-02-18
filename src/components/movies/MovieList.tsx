import type { Movie } from '../../data/movies';
import MovieItem from './MovieItem';

type MovieListProps = {
  movies: Movie[];
  selectedId: string | null;
  onSelectMovie: (id: string) => void;
};

export default function MovieList({
  movies,
  selectedId,
  onSelectMovie,
}: MovieListProps) {
  return (
    <ul className='list list-movies'>
      {movies.map((movie) => (
        <MovieItem
          key={movie.imdbID}
          movie={movie}
          selectedId={selectedId}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
