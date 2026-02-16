import { useState, type ReactNode, type ChangeEvent } from 'react';
import StarRating from './components/StarRating';
import {
  tempMovieData,
  tempWatchedData,
  type Movie,
  type WatchedMovie,
} from './data/movies';

const average = (arr: number[]) =>
  arr.reduce((acc, cur) => acc + cur / arr.length, 0);

// Navigation Bar
function NavBar({ children }: { children: ReactNode }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

// Logo
function Logo() {
  return (
    <div className='logo'>
      <span role='img' aria-label='popcorn'>
        🍿
      </span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// Number of Results
function NumResults({ movies }: { movies: Movie[] }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// Search Input
function Search() {
  const [query, setQuery] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <input
      id='search'
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={handleChange}
    />
  );
}

// Main Content
const Main = ({ children }: { children: ReactNode }) => {
  return <main className='main'>{children}</main>;
};

// Collapsible Box
function Box({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

// Movie List
function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <ul className='list list-none py-1 px-0'>
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

// Movie Item
function MovieItem({ movie }: { movie: Movie }) {
  return (
    <li className=''>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// Watched Summary
function WatchedSummary({ watched }: { watched: WatchedMovie[] }) {
  const avgImdbRating = average(watched.map((m) => m.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((m) => m.runtime));

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}

// Watched List
function WatchedList({ watched }: { watched: WatchedMovie[] }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovieItem key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

// Watched Item
function WatchedMovieItem({ movie }: { movie: WatchedMovie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

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
          <WatchedSummary watched={tempWatchedData} />
          <WatchedList watched={tempWatchedData} />
        </Box>
      </Main>

      <StarRating maxRating={10} color='#fcc419' />
    </>
  );
}
