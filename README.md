# React + TypeScript + Vite + Sass

# usePopcorn v2.0 🍿

**usePopcorn v2.0** is a React + TypeScript movie tracking application built with Vite.  
It allows users to search movies via the OMDb API, view movie details, rate films, and manage a persistent watched list stored in `localStorage`.

---

## ✨ Features

- 🔍 Search movies using the **OMDb API**
- 🎬 View detailed movie information (plot, cast, runtime, genre, etc.)
- ⭐ Rate movies with a custom **StarRating** component
- ➕ Add movies to a watched list
- ❌ Remove movies from the watched list
- 💾 Watched list persists using `localStorage`
- ⌨️ Keyboard support (`Escape` closes movie details)
- 🎨 Styled with **Sass (SCSS)** using a modular architecture

---

## 🛠 Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Sass (SCSS)**
- **OMDb API**
- Custom Hooks:
  - `useMovies`
  - `useKey`
  - `useLocalStorageState`
  - `useDebounce`

---

## 🚀 Possible Improvements / Next Steps

- Sorting watched list by rating, runtime, year, etc.
- Better accessibility (focus management, aria attributes)
- Add unit tests (Vitest + React Testing Library)
- Add deployment workflow (Netlify/Vercel)

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd use-popcorn-v2
npm install

```

```txt

src/
  components/
    layout/
      Box.tsx
      Footer.tsx
      Header.tsx
      Logo.tsx
      Main.tsx
      NavBar.tsx
    movies/
      MovieDetails.tsx
      MovieItem.tsx
      MovieList.tsx
      NumResults.tsx
      Search.tsx
      WatchedControls.tsx
      WatchedList.tsx
      WatchedMovieItem.tsx
      WatchedSummary.tsx
    ui/
      EmptyState.tsx
      ErrorMessage.tsx
      Loader.tsx
      MovieListSkeleton.tsx
      Pagination.tsx
      Poster.tsx
      StarRating.tsx
      ThemeToggle.tsx

  data/
    movies.ts

  hooks/
    useDebounce.ts
    useKey.ts
    useLocalStorageState.ts
    useMovies.ts
    useTheme.ts

  styles/
    abstracts/
      _index.scss
      _mixins.scss
      _variables.scss
    base/
      _base.scss
      _index.scss
      _reset.scss
      _typography.scss
    components/
      _box.scss
      _buttons.scss
      _details.scss
      _index.scss
      _lists.scss
      _pagination.scss
      _skeleton.scss
      _states.scss
      _summary.scss
      _watched-controls.scss
    layout/
      _footer.scss
      _header.scss
      _index.scss
      _main.scss
      _nav.scss
    theme/
      _dark.scss
      _index.scss
      _light.scss
      _theme.scss
    main.scss

  utils/
    average.ts

  App.tsx
  main.tsx

```
