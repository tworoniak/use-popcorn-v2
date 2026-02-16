import type { Movie } from '../../data/movies';

type NumResultsProps = {
  movies: Movie[];
};

export default function NumResults({ movies }: NumResultsProps) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
