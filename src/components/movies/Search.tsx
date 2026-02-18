// import type { ChangeEvent } from 'react';

// type SearchProps = {
//   query: string;
//   onSetQuery: (value: string) => void;
// };

// export default function Search({ query, onSetQuery }: SearchProps) {
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     onSetQuery(e.target.value);
//   };

//   return (
//     <input
//       id='search'
//       className='search'
//       type='text'
//       placeholder='Search movies...'
//       value={query}
//       onChange={handleChange}
//     />
//   );
// }

import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';

type SearchProps = {
  query: string;
  onSetQuery: (value: string) => void;
  placeholder?: string;
};

export default function Search({
  query,
  onSetQuery,
  placeholder = 'Search movies...',
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSetQuery(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onSetQuery('');
      inputRef.current?.blur();
    }

    // "Enter to commit" — for your current setup, query is already controlled,
    // but Enter is still useful to close mobile keyboard / blur.
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    onSetQuery('');
    inputRef.current?.focus();
  };

  const showClear = query.trim().length > 0;

  return (
    <div className='search-wrap'>
      <input
        ref={inputRef}
        id='search'
        className='search'
        type='text'
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete='off'
        spellCheck={false}
      />

      {showClear && (
        <button
          type='button'
          className='search-clear'
          onClick={handleClear}
          aria-label='Clear search'
        >
          ×
        </button>
      )}
    </div>
  );
}
