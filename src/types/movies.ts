export type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

export type WatchedMovie = Movie & {
  runtime: number;
  imdbRating: number;
  userRating: number;
  countRatingDecisions?: number;
  createdAt?: number;
  updatedAt?: number;
};
