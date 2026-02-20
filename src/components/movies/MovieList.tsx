import type { Movie } from '../../types/movies';
import MovieItem from './MovieItem';

type MovieListProps = {
  movies: Movie[];
  selectedId: string | null;
  onSelectMovie: (id: string) => void;
  watchedIds: Set<string>;
};

export default function MovieList({
  movies,
  selectedId,
  watchedIds,
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
          isWatched={watchedIds.has(movie.imdbID)}
        />
      ))}
    </ul>
  );
}
