import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useMovies } from './hooks/useMovies';
import { useKey } from './hooks/useKey';
import { useTheme } from './hooks/useTheme';

import type { WatchedMovie } from './data/movies';

import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Main from './components/layout/Main';
import Box from './components/layout/Box';
import Search from './components/movies/Search';
import NumResults from './components/movies/NumResults';
import MovieList from './components/movies/MovieList';
import WatchedSummary from './components/movies/WatchedSummary';
import WatchedList from './components/movies/WatchedList';
import MovieDetails from './components/movies/MovieDetails';
import ErrorMessage from './components/ui/ErrorMessage';
import Pagination from './components/ui/Pagination';
import Footer from './components/layout/Footer';
import EmptyState from './components/ui/EmptyState';
import MovieListSkeleton from './components/ui/MovieListSkeleton';
import WatchedControls, {
  type WatchedSort,
  type WatchedFilter,
} from './components/movies/WatchedControls';
import ThemeToggle from './components/ui/ThemeToggle';
import Toast from './components/ui/Toast';
import { useToast } from './hooks/useToast';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 400);

  const { movies, isLoading, isFetching, error, totalResults, retry } =
    useMovies(debouncedQuery, page);
  const isTyping = query.trim() !== debouncedQuery.trim();
  const showStale = movies.length > 0 && (isTyping || isFetching);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched',
  );

  const watchedIds = new Set(watched.map((m) => m.imdbID));
  const [watchedSort, setWatchedSort] = useState<WatchedSort>('date-desc');
  const [watchedFilter, setWatchedFilter] = useState<WatchedFilter>('all');
  const [watchedQuery, setWatchedQuery] = useState('');

  const { theme, toggleTheme } = useTheme('dark');

  const {
    toast,
    show: showToast,
    close: closeToast,
    isClosing: isToastClosing,
  } = useToast();

  useKey('Slash', () => {
    document.getElementById('search')?.focus();
  });

  // when user types a new query, reset page + close details (polish)
  function handleSetQuery(nextQuery: string) {
    setQuery((prev) => {
      const prevTrim = prev.trim();
      const nextTrim = nextQuery.trim();

      if (prevTrim !== nextTrim) {
        setPage(1);
        setSelectedId(null);

        // scroll list to top when new search begins
        const el = document.getElementById('movies-scroll');
        el?.scrollTo({ top: 0, behavior: 'auto' });
      }

      return nextQuery;
    });
  }

  function handleSelectMovie(id: string) {
    setSelectedId((current) => (id === current ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((prev) => {
      const idx = prev.findIndex((m) => m.imdbID === movie.imdbID);

      if (idx === -1) {
        showToast({
          message: 'Added to watched',
          kind: 'success',
        });

        return [...prev, movie];
      }

      showToast({
        message: 'Updated your rating',
        kind: 'info',
      });

      const existing = prev[idx];

      const updated: WatchedMovie = {
        ...existing,
        ...movie,
        createdAt: existing.createdAt ?? movie.createdAt,
        updatedAt: Date.now(),
      };

      const copy = [...prev];
      copy[idx] = updated;

      return copy;
    });
  }

  function handleDeleteWatched(id: string) {
    setWatched((prev) => {
      const index = prev.findIndex((m) => m.imdbID === id);
      if (index === -1) return prev;

      const movie = prev[index];
      const next = prev.filter((m) => m.imdbID !== id);
      // const canUndo = true;

      showToast({
        message: `Removed "${movie.Title}"`,
        kind: 'info',
        actionLabel: 'Undo',
        onAction: () => {
          setWatched((curr) => {
            // already restored?
            if (curr.some((m) => m.imdbID === movie.imdbID)) return curr;

            const copy = [...curr];
            copy.splice(Math.min(index, copy.length), 0, movie);
            return copy;
          });
          closeToast();
        },
      });

      return next;
    });
  }

  function scrollMoviesToTop() {
    const el = document.getElementById('movies-scroll');
    el?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePrevPage() {
    setPage((p) => Math.max(1, p - 1));
    setSelectedId(null); // optional UX: close details when paging
    scrollMoviesToTop();
  }

  function handleNextPage() {
    setPage((p) => p + 1);
    setSelectedId(null); // optional UX: close details when paging
    scrollMoviesToTop();
  }

  function compareString(a: string, b: string) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  }

  function sortWatched(list: WatchedMovie[], sort: WatchedSort) {
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

  function filterWatchedByTitle(list: WatchedMovie[], q: string) {
    const query = q.trim().toLowerCase();
    if (!query) return list;

    return list.filter((m) => m.Title.toLowerCase().includes(query));
  }

  function filterWatched(list: WatchedMovie[], filter: WatchedFilter) {
    switch (filter) {
      case 'rated':
        return list.filter((m) => (m.userRating ?? 0) > 0);
      case 'unrated':
        return list.filter((m) => (m.userRating ?? 0) === 0);
      default:
        return list;
    }
  }

  const watchedFiltered = filterWatched(watched, watchedFilter);
  const watchedTitleFiltered = filterWatchedByTitle(
    watchedFiltered,
    watchedQuery,
  );
  const watchedVisible = sortWatched(watchedTitleFiltered, watchedSort);

  function handleFilterChange(next: WatchedFilter) {
    setWatchedFilter(next);
    setWatchedQuery('');
  }

  return (
    <>
      <Header>
        <NavBar>
          <Search query={query} onSetQuery={handleSetQuery} />
          <NumResults
            totalResults={totalResults}
            page={page}
            currentCount={movies.length}
          />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </NavBar>
      </Header>

      <Main>
        <Box scrollId='movies-scroll'>
          {query.trim().length < 3 && (
            <EmptyState
              title='Search for a movie'
              description='Type at least 3 characters to start searching.'
            />
          )}

          {query.trim().length >= 3 && isLoading && movies.length === 0 && (
            <MovieListSkeleton />
          )}

          {!isLoading && error && (
            <ErrorMessage message={error} onRetry={retry} />
          )}

          {query.trim().length >= 3 &&
            !isLoading &&
            !error &&
            movies.length === 0 && (
              <EmptyState
                title='No results'
                description='Try a different title or check your spelling.'
              />
            )}

          {query.trim().length >= 3 &&
            !isLoading &&
            !error &&
            movies.length > 0 && (
              <>
                {showStale && (
                  <div className='stale-indicator' aria-live='polite'>
                    {isTyping ? 'Waiting…' : 'Updating…'}
                  </div>
                )}

                <MovieList
                  movies={movies}
                  selectedId={selectedId}
                  onSelectMovie={handleSelectMovie}
                  watchedIds={watchedIds}
                />

                <Pagination
                  page={page}
                  totalResults={totalResults}
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />
              </>
            )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watchedVisible}
                totalWatched={watched.length}
              />

              {watched.length > 0 && (
                <WatchedControls
                  sort={watchedSort}
                  onSortChange={setWatchedSort}
                  filter={watchedFilter}
                  onFilterChange={handleFilterChange}
                  watchedQuery={watchedQuery}
                  onWatchedQueryChange={setWatchedQuery}
                />
              )}

              <WatchedList
                watched={watchedVisible}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
      {toast && (
        <div className='toast-host'>
          <Toast
            message={toast.message}
            kind={toast.kind}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onClose={closeToast}
            className={isToastClosing ? 'is-closing' : ''}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
