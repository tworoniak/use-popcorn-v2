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

// import StarRating from './components/StarRating';
import Loader from './components/ui/Loader';
import ErrorMessage from './components/ui/ErrorMessage';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
    [],
    'watched',
  );

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

  return (
    <>
      <NavBar>
        <Search query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              onSelectMovie={handleSelectMovie}
            />
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
    </>
  );
}
