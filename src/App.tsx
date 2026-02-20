import { useEffect, useMemo, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { useDebounce } from './hooks/useDebounce';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useMovies } from './hooks/useMovies';
import { useKey } from './hooks/useKey';
import { useTheme } from './hooks/useTheme';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useToast } from './hooks/useToast';

import type { WatchedMovie } from './types/movies';

import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import Main from './components/layout/Main';
import Box from './components/layout/Box';

import Search from './components/movies/Search';
import NumResults from './components/movies/NumResults';
import MovieList from './components/movies/MovieList';
import MovieDetails from './components/movies/MovieDetails';
import WatchedSummary from './components/movies/WatchedSummary';
import WatchedList from './components/movies/WatchedList';
import WatchedControls from './components/movies/WatchedControls';
import ErrorMessage from './components/ui/ErrorMessage';
import Pagination from './components/ui/Pagination';
import EmptyState from './components/ui/EmptyState';
import MovieListSkeleton from './components/ui/MovieListSkeleton';
import ThemeToggle from './components/ui/ThemeToggle';
import Toast from './components/ui/Toast';
import NetworkBanner from './components/ui/NetworkBanner';
import Footer from './components/layout/Footer';

import type { WatchedFilter, WatchedSort } from './types/watched';

import { getVisibleWatched } from './utils/watched';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/search' replace />} />
      <Route path='/search' element={<Shell mode='search' />} />
      <Route path='/movie/:imdbID' element={<Shell mode='details' />} />
      <Route path='*' element={<Navigate to='/search' replace />} />
    </Routes>
  );
}

type ShellProps = { mode: 'search' | 'details' };

function Shell({ mode }: ShellProps) {
  const navigate = useNavigate();
  const { imdbID } = useParams<{ imdbID: string }>();
  const selectedId = mode === 'details' ? (imdbID ?? null) : null;

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1') || 1;

  const debouncedQuery = useDebounce(query, 400);

  const { movies, isLoading, isFetching, error, totalResults, retry } =
    useMovies(debouncedQuery, page);

  const isTyping = query.trim() !== debouncedQuery.trim();
  const showStale = movies.length > 0 && (isTyping || isFetching);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched',
  );

  const watchedIds = useMemo(
    () => new Set(watched.map((m) => m.imdbID)),
    [watched],
  );

  const [watchedSort, setWatchedSort] = useState<WatchedSort>('date-desc');
  const [watchedFilter, setWatchedFilter] = useState<WatchedFilter>('all');
  const [watchedQuery, setWatchedQuery] = useState('');

  const { theme, toggleTheme } = useTheme('dark');
  const isOnline = useOnlineStatus();

  const {
    toast,
    show: showToast,
    close: closeToast,
    isClosing: isToastClosing,
  } = useToast();

  useKey('Slash', () => document.getElementById('search')?.focus());

  useEffect(() => {
    const root = document.documentElement;

    if (selectedId) root.classList.add('is-modal-open');
    else root.classList.remove('is-modal-open');

    return () => {
      root.classList.remove('is-modal-open');
    };
  }, [selectedId]);

  function setParam(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: false });
  }

  function handleSetQuery(nextQuery: string) {
    const prevTrim = query.trim();
    const nextTrim = nextQuery.trim();

    if (prevTrim !== nextTrim) {
      // reset page and close details by navigating to /search
      setParam({ q: nextQuery, page: '1' });

      if (selectedId) {
        navigate(`/search?${new URLSearchParams({ q: nextQuery, page: '1' })}`);
      }
      // scroll list to top
      document
        .getElementById('movies-scroll')
        ?.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    setParam({ q: nextQuery });
  }

  function handleSelectMovie(id: string) {
    // preserve q/page in URL
    const qs = new URLSearchParams(searchParams);
    navigate(`/movie/${id}?${qs.toString()}`);
  }

  function handleCloseMovie() {
    // setPageTitle(null);
    navigate(`/search?${searchParams.toString()}`);
    requestAnimationFrame(() => document.getElementById('search')?.focus());
  }

  function handlePrevPage() {
    const next = Math.max(1, page - 1);
    setParam({ page: String(next) });
    document
      .getElementById('movies-scroll')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNextPage() {
    setParam({ page: String(page + 1) });
    document
      .getElementById('movies-scroll')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAddWatched(movie: WatchedMovie) {
    setWatched((prev) => {
      const idx = prev.findIndex((m) => m.imdbID === movie.imdbID);

      if (idx === -1) {
        showToast({ message: 'Added to watched', kind: 'success' });
        return [...prev, movie];
      }

      showToast({ message: 'Updated your rating', kind: 'info' });

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

      showToast({
        message: `Removed "${movie.Title}"`,
        kind: 'info',
        actionLabel: 'Undo',
        onAction: () => {
          setWatched((curr) => {
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

  const watchedVisible = useMemo(() => {
    return getVisibleWatched(watched, watchedFilter, watchedQuery, watchedSort);
  }, [watched, watchedFilter, watchedQuery, watchedSort]);

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
          <NetworkBanner isOnline={isOnline} />

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
            <ErrorMessage
              message={error}
              onRetry={isOnline ? retry : undefined}
            />
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
              key={selectedId}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              // onTitleChange={setPageTitle}
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
