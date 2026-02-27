# React + TypeScript + Vite + Sass

# usePopcorn v2.0 🍿

**usePopcorn v2.0** is a production-style React + TypeScript movie tracking application built with Vite.
Search for movies via the OMDb API, explore detailed information, rate films, and manage a persistent watched list — all with polished UX behaviors including animated panels, swipe gestures, caching, toasts, and responsive design.

---

## 🚀 Live Demo

[usePopcorn v2.0](https://use-popcorn-v2-ruby.vercel.app)

![usePopcorn screen 1.](/src/assets/screen-01.png 'usePopcorn screen 1.')
![usePopcorn screen 2.](/src/assets/screen-02.png 'usePopcorn screen 2.')

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

## 🔍 Search & Results

- Debounced movie search (400ms)
- Stale results indicator while fetching
- Pagination with proper disabled states
- Empty states for no results
- Retry handling for network/API errors
- Network status banner (offline detection)

## 🎬 Movie Details

- Animated slide-in detail panel
- Mobile overlay modal behavior
- Swipe-to-close with live drag animation (mobile)
- Escape key closes details
- Prefetch movie details on hover / tap-hold
- Client-side caching of movie details
- Poster fallback handling for missing images

## ⭐ Rating & Watched List

- Custom interactive **StarRating** component
- Add & update rating support
- Undo delete with toast action
- Watched list persists in `localStorage`
- Sorting (date, rating, runtime, title, IMDb)
- Filtering (rated / unrated)
- Title search within watched list
- Watched controls persisted in URL params
- Feature-isolated WatchedPanel module

## 🎨 UI & UX

- Dark / Light theme toggle (persisted)
- Toast notification system
- Skeleton loading states
- Responsive mobile-first layout
- Scroll locking for modal state
- Smooth animations for panel transitions

## 🌐 URL-Driven State & Routing

- Separate routes for search and movie details (`/search`, `/movie/:imdbID`)
- Query & pagination state persisted in URL params
- Watched list sort / filter / search persisted in URL params
- Shareable deep links
- Back / forward navigation fully supported
- Refresh-safe state restoration

---

## 🛠 Tech Stack

- **React**
- **React Router (URL-driven state architecture)**
- **TypeScript**
- **Vite**
- **Sass (SCSS)**
- **OMDb API**
- Custom Hooks:
  - `useMovies`
  - `useKey`
  - `useLocalStorageState`
  - `useDebounce`
  - `useOnlineStatus`
  - `useSwipeToCloseDrag`
  - `useTheme`
  - `useToast`

---

## 🧠 Architecture Highlights

- Clean separation of layout / UI / domain components
- URL as the source of truth for view state (search, pagination, watched controls)
- Feature-based module structure (`features/watched`)
- Pure domain logic extracted to `utils/`
- Cached movie detail requests
- Prefetch strategy for perceived performance
- Optimistic updates with undo support
- Mobile interaction patterns (gesture-driven UX)

---

## 🚀 Possible Improvements / Next Steps

- ⚡ Add keyboard navigation for search results (arrow keys)
- 📌 Add “Recently viewed” quick-access strip
- 🔥 Add trending movies on empty search
- 🧠 Add intelligent ranking boost for watched genres
- 🌟 Better accessibility (focus management, aria attributes)
- 🚀 Add unit tests (Vitest + React Testing Library)
- 🧩 Add deployment workflow (Netlify/Vercel)

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd use-popcorn-v2
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a .env file:

- Get your API key at: https://www.omdbapi.com

```env
VITE_OMDB_KEY=your_api_key_here

```

---

```txt
src/
  api/
    omdbDetailsCache.ts

  assets/
    no-poster.png

  components/
    layout/
      Box.tsx
      Footer.tsx
      Header.tsx
      Logo.tsx
      Main.tsx
      NavBar.tsx
    movies/
      DetailsSwitcher.tsx
      MovieDetails.tsx
      MovieItem.tsx
      MovieList.tsx
      NumResults.tsx
      RecentlyViewed.tsx
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
      NetworkBanner.tsx
      Pagination.tsx
      Poster.tsx
      StarRating.tsx
      ThemeToggle.tsx
      Toast.tsx

  data/
    movies.ts // legacy types (movie data fetched from OMDb API; types now live in /types)

  features/
    watched/
      useWatchedUrlState.ts
      WatchedPanel.tsx

  hooks/
    useDebounce.ts
    useKey.ts
    useLocalStorageState.ts
    useMovies.ts
    useOnlineStatus.ts
    useRecentlyViewed.ts
    useSwipeToCloseDrag.ts
    useTheme.ts
    useToast.ts

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
      _recent.scss
      _skeleton.scss
      _star-rating.scss
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

  types/
    movies.ts
    recent.ts
    watched.ts

  utils/
    average.ts
    watched.ts

  App.tsx
  main.tsx
```
