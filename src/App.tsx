import { useState } from 'react';
import StarRating from './components/StarRating';
import {
  tempMovieData,
  tempWatchedData,
  type Movie,
  type WatchedMovie,
} from './data/movies';

import NavBar from './components/layout/NavBar';
import Main from './components/layout/Main';
import Box from './components/layout/Box';
import Search from './components/movies/Search';
import NumResults from './components/movies/NumResults';
import MovieList from './components/movies/MovieList';
import WatchedSummary from './components/movies/WatchedSummary';
import WatchedList from './components/movies/WatchedList';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(tempMovieData);
  const [watched, setWatched] = useState<WatchedMovie[]>(tempWatchedData);

  return (
    <>
      <NavBar>
        <Search />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>

        <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>

      <div>
        <h2>Star Rating</h2>
        <StarRating maxRating={10} color='var(--color-yellow)' />
      </div>
    </>
  );
}
