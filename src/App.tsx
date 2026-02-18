import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useMovies } from './hooks/useMovies';
import { useKey } from './hooks/useKey';

import type { WatchedMovie } from './data/movies';

import NavBar from './components/layout/NavBar';
import Main from './components/layout/Main';
import Box from './components/layout/Box';
import Search from './components/movies/Search';
import NumResults from './components/movies/NumResults';
import MovieList from './components/movies/MovieList';
import WatchedSummary from './components/movies/WatchedSummary';
import WatchedList from './components/movies/WatchedList';
import MovieDetails from './components/movies/MovieDetails';
import Loader from './components/ui/Loader';
import ErrorMessage from './components/ui/ErrorMessage';
import Pagination from './components/ui/Pagination';
import Footer from './components/layout/Footer';
import EmptyState from './components/ui/EmptyState';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedQuery = useDebounce(query, 400);

  const { movies, isLoading, error, totalResults } = useMovies(
    debouncedQuery,
    page,
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched',
  );

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
    setWatched((prev) => [...prev, movie]);
  }

  function handleDeleteWatched(id: string) {
    setWatched((prev) => prev.filter((movie) => movie.imdbID !== id));
  }

  function handlePrevPage() {
    setPage((p) => Math.max(1, p - 1));
    setSelectedId(null); // optional UX: close details when paging
  }

  function handleNextPage() {
    setPage((p) => p + 1);
    setSelectedId(null); // optional UX: close details when paging
  }

  return (
    <>
      <NavBar>
        <Search query={query} onSetQuery={handleSetQuery} />
        <NumResults
          totalResults={totalResults}
          page={page}
          currentCount={movies.length}
        />
      </NavBar>

      <Main>
        <Box>
          {query.trim().length < 3 && (
            <EmptyState
              title='Search for a movie'
              description='Type at least 3 characters to start searching.'
            />
          )}

          {query.trim().length >= 3 && isLoading && (
            <Loader text='Searching...' />
          )}

          {query.trim().length >= 3 && !isLoading && error && (
            <ErrorMessage message={error} />
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
                <MovieList
                  movies={movies}
                  selectedId={selectedId}
                  onSelectMovie={handleSelectMovie}
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
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>

      <Footer />
    </>
  );
}
