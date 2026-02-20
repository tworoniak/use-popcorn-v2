import type { WatchedMovie } from '../../types/movies';
import { average } from '../../utils/average';

type WatchedSummaryProps = {
  watched: WatchedMovie[];
  totalWatched: number;
};

export default function WatchedSummary({
  watched,
  totalWatched,
}: WatchedSummaryProps) {
  const avgImdbRating = average(watched.map((m) => m.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((m) => m.runtime));

  const isFiltered = watched.length !== totalWatched;

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>

      <div>
        <p>
          <span>#️⃣</span>
          <span>
            {isFiltered ? `${watched.length} of ${totalWatched}` : totalWatched}{' '}
            movies
          </span>
        </p>

        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>

        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>

        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
