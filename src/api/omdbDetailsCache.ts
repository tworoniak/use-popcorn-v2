const OMDB_KEY = import.meta.env.VITE_OMDB_KEY ?? 'f84fc31d';

export type OmdbMovieSuccess = {
  Response: 'True';
  Title: string;
  Year: string;
  Poster: string;
  Runtime: string;
  imdbRating: string;
  Plot: string;
  Released: string;
  Actors: string;
  Director: string;
  Genre: string;
};

type OmdbMovieError = {
  Response: 'False';
  Error: string;
};

type OmdbMovieResponse = OmdbMovieSuccess | OmdbMovieError;

type CacheEntry = { movie: OmdbMovieSuccess; ts: number };
const detailsCache = new Map<string, CacheEntry>();
const MAX_DETAILS_CACHE = 80;

function prune() {
  if (detailsCache.size <= MAX_DETAILS_CACHE) return;
  const entries = Array.from(detailsCache.entries()).sort(
    (a, b) => a[1].ts - b[1].ts,
  );
  const removeCount = detailsCache.size - MAX_DETAILS_CACHE;
  for (let i = 0; i < removeCount; i++) detailsCache.delete(entries[i][0]);
}

export function getCachedMovieDetails(imdbID: string) {
  return detailsCache.get(imdbID)?.movie ?? null;
}

export async function prefetchMovieDetails(
  imdbID: string,
  signal?: AbortSignal,
) {
  // already cached
  if (detailsCache.has(imdbID)) return;

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${imdbID}`,
    { signal },
  );

  if (!res.ok) throw new Error('Failed to fetch movie details');

  const data: OmdbMovieResponse = await res.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found');
  }

  detailsCache.set(imdbID, { movie: data, ts: Date.now() });
  prune();
}
