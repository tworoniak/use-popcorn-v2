// import type { Movie } from '../../data/movies';
// import MovieItem from './MovieItem';

// type MovieListProps = {
//   movies: Movie[];
// };

// export default function MovieList({ movies }: MovieListProps) {
//   return (
//     <ul className='list list-none py-1 px-0'>
//       {movies.map((movie) => (
//         <MovieItem key={movie.imdbID} movie={movie} />
//       ))}
//     </ul>
//   );
// }

import type { Movie } from '../../data/movies';
import MovieItem from './MovieItem';

type MovieListProps = {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
};

export default function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <ul className='list list-none py-1 px-0'>
      {movies.map((movie) => (
        <MovieItem
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
