import { useMemo } from 'react';

import type { WatchedMovie } from '../../types/movies';
import type { WatchedFilter, WatchedSort } from '../../types/watched';
import { getVisibleWatched } from '../../utils/watched';

import WatchedSummary from '../../components/movies/WatchedSummary';
import WatchedList from '../../components/movies/WatchedList';
import WatchedControls from '../../components/movies/WatchedControls';

type WatchedPanelProps = {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;

  sort: WatchedSort;
  onSortChange: (next: WatchedSort) => void;

  filter: WatchedFilter;
  onFilterChange: (next: WatchedFilter) => void;

  query: string;
  onQueryChange: (next: string) => void;
};

export default function WatchedPanel({
  watched,
  onDeleteWatched,
  sort,
  onSortChange,
  filter,
  onFilterChange,
  query,
  onQueryChange,
}: WatchedPanelProps) {
  const watchedVisible = useMemo(
    () => getVisibleWatched(watched, filter, query, sort),
    [watched, filter, query, sort],
  );

  function handleFilterChange(next: WatchedFilter) {
    onFilterChange(next);
    onQueryChange(''); // keep your current UX: reset title filter when filter changes
  }

  return (
    <>
      <WatchedSummary watched={watchedVisible} totalWatched={watched.length} />

      {watched.length > 0 && (
        <WatchedControls
          sort={sort}
          onSortChange={onSortChange}
          filter={filter}
          onFilterChange={handleFilterChange}
          watchedQuery={query}
          onWatchedQueryChange={onQueryChange}
        />
      )}

      <WatchedList watched={watchedVisible} onDeleteWatched={onDeleteWatched} />
    </>
  );
}
