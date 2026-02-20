import type { WatchedFilter, WatchedSort } from '../../types/watched';

type WatchedControlsProps = {
  sort: WatchedSort;
  onSortChange: (value: WatchedSort) => void;
  filter: WatchedFilter;
  onFilterChange: (value: WatchedFilter) => void;

  watchedQuery: string;
  onWatchedQueryChange: (value: string) => void;
};

export default function WatchedControls({
  sort,
  onSortChange,
  filter,
  onFilterChange,
  watchedQuery,
  onWatchedQueryChange,
}: WatchedControlsProps) {
  return (
    <div className='watched-controls'>
      <div className='watched-controls__group'>
        <label className='watched-controls__label' htmlFor='watched-search'>
          Search watched
        </label>
        <input
          id='watched-search'
          className='watched-controls__input'
          type='text'
          placeholder='Filter by title...'
          value={watchedQuery}
          onChange={(e) => onWatchedQueryChange(e.target.value)}
        />
      </div>

      <div className='watched-controls__group'>
        <label className='watched-controls__label' htmlFor='watched-sort'>
          Sort
        </label>
        <select
          id='watched-sort'
          className='watched-controls__select'
          value={sort}
          onChange={(e) => onSortChange(e.target.value as WatchedSort)}
        >
          <option value='date-desc'>Date added (newest)</option>
          <option value='date-asc'>Date added (oldest)</option>

          <option value='userRating-desc'>Your rating (high → low)</option>
          <option value='userRating-asc'>Your rating (low → high)</option>

          <option value='imdbRating-desc'>IMDb rating (high → low)</option>
          <option value='imdbRating-asc'>IMDb rating (low → high)</option>

          <option value='runtime-desc'>Runtime (long → short)</option>
          <option value='runtime-asc'>Runtime (short → long)</option>

          <option value='title-asc'>Title (A → Z)</option>
          <option value='title-desc'>Title (Z → A)</option>
        </select>
      </div>

      <div className='watched-controls__group'>
        <label className='watched-controls__label' htmlFor='watched-filter'>
          Filter
        </label>
        <select
          id='watched-filter'
          className='watched-controls__select'
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as WatchedFilter)}
        >
          <option value='all'>All</option>
          <option value='rated'>Rated only</option>
          <option value='unrated'>Unrated only</option>
        </select>
      </div>
    </div>
  );
}
