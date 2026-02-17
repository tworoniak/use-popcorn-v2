// import { useEffect, useRef, useState } from 'react';

// // import {
// //   tempMovieData,
// //   tempWatchedData,
// //   type Movie,
// //   type WatchedMovie,
// // } from './data/movies';
// import { useLocalStorageState } from './hooks/useLocalStorageState';
// import { useMovies } from './hooks/useMovies';
// import { useKey } from './hooks/useKey';

// import NavBar from './components/layout/NavBar';
// import Main from './components/layout/Main';
// import Box from './components/layout/Box';
// import Search from './components/movies/Search';
// import NumResults from './components/movies/NumResults';
// import MovieList from './components/movies/MovieList';
// import WatchedSummary from './components/movies/WatchedSummary';
// import WatchedList from './components/movies/WatchedList';
// import StarRating from './components/StarRating';

// export default function App() {
//   const [query, setQuery] = useState('');
//   const [selectedId, setSelectedId] = useState(null);
//   const { movies, isLoading, error } = useMovies(query);
//   // const [movies, setMovies] = useState<Movie[]>(tempMovieData);
//   const [watched, setWatched] = useLocalStorageState([], 'watched');

//   function handleSelectMovie(id: null) {
//     setSelectedId((selectedId) => (id === selectedId ? null : id));
//   }

//   function handleCloseMovie() {
//     setSelectedId(null);
//   }

//   function handleAddWatched(movie: any) {
//     setWatched((watched) => [...watched, movie]);
//   }

//   function handleDeleteWatched(id: any) {
//     setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
//   }

//   return (
//     <>
//       <NavBar>
//         <Search />
//         <NumResults movies={movies} />
//       </NavBar>

//       <Main>
//         <Box>
//           {/* <MovieList movies={movies} /> */}
//           {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
//           {isLoading && <Loader />}
//           {!isLoading && !error && (
//             <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
//           )}
//           {error && <ErrorMessage message={error} />}
//         </Box>

//         <Box>
//           {/* <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} /> */}

//           {selectedId ? (
//             <MovieDetails
//               selectedId={selectedId}
//               onCloseMovie={handleCloseMovie}
//               onAddWatched={handleAddWatched}
//               watched={watched}
//             />
//           ) : (
//             <>
//               <WatchedSummary watched={watched} />
//               <WatchedList
//                 watched={watched}
//                 onDeleteWatched={handleDeleteWatched}
//               />
//             </>
//           )}
//         </Box>
//       </Main>

//       <div>
//         <h2>Star Rating</h2>
//         <StarRating maxRating={10} color='var(--color-yellow)' />
//       </div>
//     </>
//   );
// }

// function Loader() {
//   return <p className='loader'>Loading...</p>;
// }

// function ErrorMessage({ message }) {
//   return (
//     <p className='error'>
//       <span>⛔️</span> {message}
//     </p>
//   );
// }

// function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
//   const [movie, setMovie] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [userRating, setUserRating] = useState('');

//   const countRef = useRef(0);

//   useEffect(
//     function () {
//       if (userRating) countRef.current++;
//     },
//     [userRating],
//   );

//   const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
//   const watchedUserRating = watched.find(
//     (movie) => movie.imdbID === selectedId,
//   )?.userRating;

//   const {
//     Title: title,
//     Year: year,
//     Poster: poster,
//     Runtime: runtime,
//     imdbRating,
//     Plot: plot,
//     Released: released,
//     Actors: actors,
//     Director: director,
//     Genre: genre,
//   } = movie;

//   // if (imdbRating > 8) return <p>Greatest ever!</p>;
//   // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

//   // const [isTop, setIsTop] = useState(imdbRating > 8);
//   // console.log(isTop);
//   // useEffect(
//   //   function () {
//   //     setIsTop(imdbRating > 8);
//   //   },
//   //   [imdbRating]
//   // );

//   const isTop = imdbRating > 8;
//   console.log(isTop);

//   // const [avgRating, setAvgRating] = useState(0);

//   function handleAdd() {
//     const newWatchedMovie = {
//       imdbID: selectedId,
//       title,
//       year,
//       poster,
//       imdbRating: Number(imdbRating),
//       runtime: Number(runtime.split(' ').at(0)),
//       userRating,
//       countRatingDecisions: countRef.current,
//     };

//     onAddWatched(newWatchedMovie);
//     onCloseMovie();

//     // setAvgRating(Number(imdbRating));
//     // setAvgRating((avgRating) => (avgRating + userRating) / 2);
//   }

//   useKey('Escape', onCloseMovie);

//   useEffect(
//     function () {
//       async function getMovieDetails() {
//         setIsLoading(true);
//         const res = await fetch(
//           `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
//         );
//         const data = await res.json();
//         setMovie(data);
//         setIsLoading(false);
//       }
//       getMovieDetails();
//     },
//     [selectedId],
//   );

//   useEffect(
//     function () {
//       if (!title) return;
//       document.title = `Movie | ${title}`;

//       return function () {
//         document.title = 'usePopcorn';
//         // console.log(`Clean up effect for movie ${title}`);
//       };
//     },
//     [title],
//   );

//   return (
//     <div className='details'>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <>
//           <header>
//             <button className='btn-back' onClick={onCloseMovie}>
//               &larr;
//             </button>
//             <img src={poster} alt={`Poster of ${movie} movie`} />
//             <div className='details-overview'>
//               <h2>{title}</h2>
//               <p>
//                 {released} &bull; {runtime}
//               </p>
//               <p>{genre}</p>
//               <p>
//                 <span>⭐️</span>
//                 {imdbRating} IMDb rating
//               </p>
//             </div>
//           </header>

//           {/* <p>{avgRating}</p> */}

//           <section>
//             <div className='rating'>
//               {!isWatched ? (
//                 <>
//                   <StarRating
//                     maxRating={10}
//                     size={24}
//                     onSetRating={setUserRating}
//                   />
//                   {userRating > 0 && (
//                     <button className='btn-add' onClick={handleAdd}>
//                       + Add to list
//                     </button>
//                   )}
//                 </>
//               ) : (
//                 <p>
//                   You rated with movie {watchedUserRating} <span>⭐️</span>
//                 </p>
//               )}
//             </div>
//             <p>
//               <em>{plot}</em>
//             </p>
//             <p>Starring {actors}</p>
//             <p>Directed by {director}</p>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

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
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
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
