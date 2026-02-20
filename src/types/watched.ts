// src/types/watched.ts
export type WatchedSort =
  | 'date-desc'
  | 'date-asc'
  | 'userRating-desc'
  | 'userRating-asc'
  | 'imdbRating-desc'
  | 'imdbRating-asc'
  | 'runtime-desc'
  | 'runtime-asc'
  | 'title-asc'
  | 'title-desc';

export type WatchedFilter = 'all' | 'rated' | 'unrated';
