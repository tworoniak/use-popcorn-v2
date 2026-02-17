// import type { WatchedMovie } from '../../data/movies';

// type WatchedMovieItemProps = {
//   movie: WatchedMovie;
//   onDeleteWatched: (id: string) => void;
// };

// export default function WatchedMovieItem({
//   movie,
//   onDeleteWatched,
// }: WatchedMovieItemProps) {
//   return (
//     <li>
//       <img src={movie.Poster} alt={`${movie.Title} poster`} />
//       <h3>{movie.Title}</h3>
//       <div>
//         <p>
//           <span>⭐️</span>
//           <span>{movie.imdbRating}</span>
//         </p>
//         <p>
//           <span>🌟</span>
//           <span>{movie.userRating}</span>
//         </p>
//         <p>
//           <span>⏳</span>
//           <span>{movie.runtime} min</span>
//         </p>

//         <button
//           className='btn-delete'
//           onClick={() => onDeleteWatched(movie.imdbID)}
//         >
//           X
//         </button>
//       </div>
//     </li>
//   );
// }

import type { WatchedMovie } from '../../data/movies';

type Props = {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
};

export default function WatchedMovieItem({ movie, onDeleteWatched }: Props) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
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
        ✖
      </button>
    </li>
  );
}
