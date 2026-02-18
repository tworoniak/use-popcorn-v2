import { useState } from 'react';

import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useMovies } from './hooks/useMovies';
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

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { movies, isLoading, error, totalResults } = useMovies(query, page);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched',
  );

  function handleSetQuery(nextQuery: string) {
    setQuery((prev) => {
      const normalizedPrev = prev.trim();
      const normalizedNext = nextQuery.trim();

      if (normalizedPrev !== normalizedNext) setPage(1);
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
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <>
              <MovieList
                movies={movies}
                onSelectMovie={handleSelectMovie}
                selectedId={selectedId}
              />

              <Pagination
                page={page}
                totalResults={totalResults}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            </>
          )}

          {error && <ErrorMessage message={error} />}
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
