// src/utils/watched.ts
import type { WatchedMovie } from '../types/movies';
import type { WatchedFilter, WatchedSort } from '../types/watched';

function compareString(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

export function filterWatched(list: WatchedMovie[], filter: WatchedFilter) {
  switch (filter) {
    case 'rated':
      return list.filter((m) => (m.userRating ?? 0) > 0);
    case 'unrated':
      return list.filter((m) => (m.userRating ?? 0) === 0);
    default:
      return list;
  }
}

export function filterWatchedByTitle(list: WatchedMovie[], q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return list;
  return list.filter((m) => m.Title.toLowerCase().includes(query));
}

export function sortWatched(list: WatchedMovie[], sort: WatchedSort) {
  const copy = [...list];
  const getCreatedAt = (m: WatchedMovie) => m.createdAt ?? 0;

  switch (sort) {
    case 'date-desc':
      return copy.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
    case 'date-asc':
      return copy.sort((a, b) => getCreatedAt(a) - getCreatedAt(b));

    case 'userRating-desc':
      return copy.sort((a, b) => (b.userRating ?? 0) - (a.userRating ?? 0));
    case 'userRating-asc':
      return copy.sort((a, b) => (a.userRating ?? 0) - (b.userRating ?? 0));

    case 'imdbRating-desc':
      return copy.sort((a, b) => (b.imdbRating ?? 0) - (a.imdbRating ?? 0));
    case 'imdbRating-asc':
      return copy.sort((a, b) => (a.imdbRating ?? 0) - (b.imdbRating ?? 0));

    case 'runtime-desc':
      return copy.sort((a, b) => (b.runtime ?? 0) - (a.runtime ?? 0));
    case 'runtime-asc':
      return copy.sort((a, b) => (a.runtime ?? 0) - (b.runtime ?? 0));

    case 'title-asc':
      return copy.sort((a, b) => compareString(a.Title, b.Title));
    case 'title-desc':
      return copy.sort((a, b) => compareString(b.Title, a.Title));

    default:
      return copy;
  }
}

export function getVisibleWatched(
  watched: WatchedMovie[],
  filter: WatchedFilter,
  query: string,
  sort: WatchedSort,
) {
  const filtered = filterWatched(watched, filter);
  const byTitle = filterWatchedByTitle(filtered, query);
  return sortWatched(byTitle, sort);
}
