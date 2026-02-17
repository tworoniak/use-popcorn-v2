// import type { WatchedMovie } from '../../data/movies';
// import WatchedMovieItem from './WatchedMovieItem';

// type WatchedListProps = {
//   watched: WatchedMovie[];
// };

// export default function WatchedList({ watched }: WatchedListProps) {
//   return (
//     <ul className='list'>
//       {watched.map((movie) => (
//         <WatchedMovieItem key={movie.imdbID} movie={movie} />
//       ))}
//     </ul>
//   );
// }

import type { WatchedMovie } from '../../data/movies';
import WatchedMovieItem from './WatchedMovieItem';

type WatchedListProps = {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;
};

export default function WatchedList({
  watched,
  onDeleteWatched,
}: WatchedListProps) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovieItem
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
