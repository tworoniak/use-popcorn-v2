import { useCallback } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { RecentMovie } from '../types/recent';

const KEY = 'recentlyViewed';
const MAX = 8;

type AddRecentInput = Omit<RecentMovie, 'viewedAt'> & { viewedAt?: number };

export function useRecentlyViewed(max = MAX) {
  const [recent, setRecent] = useLocalStorageState<RecentMovie[]>([], KEY);

  const addRecent = useCallback(
    (movie: AddRecentInput) => {
      const viewedAt = movie.viewedAt ?? Date.now();

      setRecent((prev) => {
        // remove any existing copy
        const without = prev.filter((m) => m.imdbID !== movie.imdbID);

        // add to top
        const next: RecentMovie[] = [{ ...movie, viewedAt }, ...without].slice(
          0,
          max,
        );

        return next;
      });
    },
    [max, setRecent],
  );

  const clearRecent = useCallback(() => setRecent([]), [setRecent]);

  return { recent, addRecent, clearRecent };
}
