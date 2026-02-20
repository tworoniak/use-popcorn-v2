import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { WatchedFilter, WatchedSort } from '../../types/watched';

const DEFAULT_SORT: WatchedSort = 'date-desc';
const DEFAULT_FILTER: WatchedFilter = 'all';

const SORT_VALUES: readonly WatchedSort[] = [
  'date-desc',
  'date-asc',
  'userRating-desc',
  'userRating-asc',
  'imdbRating-desc',
  'imdbRating-asc',
  'runtime-desc',
  'runtime-asc',
  'title-asc',
  'title-desc',
] as const;

const FILTER_VALUES: readonly WatchedFilter[] = [
  'all',
  'rated',
  'unrated',
] as const;

function isSort(x: string | null): x is WatchedSort {
  return !!x && (SORT_VALUES as readonly string[]).includes(x);
}
function isFilter(x: string | null): x is WatchedFilter {
  return !!x && (FILTER_VALUES as readonly string[]).includes(x);
}

export function useWatchedUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = useMemo<WatchedSort>(() => {
    const v = searchParams.get('ws');
    return isSort(v) ? v : DEFAULT_SORT;
  }, [searchParams]);

  const filter = useMemo<WatchedFilter>(() => {
    const v = searchParams.get('wf');
    return isFilter(v) ? v : DEFAULT_FILTER;
  }, [searchParams]);

  const query = searchParams.get('wq') ?? '';

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: false });
  }

  return {
    sort,
    setSort: (next: WatchedSort) =>
      setParam('ws', next === DEFAULT_SORT ? null : next),

    filter,
    setFilter: (next: WatchedFilter) =>
      setParam('wf', next === DEFAULT_FILTER ? null : next),

    query,
    setQuery: (next: string) => setParam('wq', next.trim() ? next : null),
  };
}
