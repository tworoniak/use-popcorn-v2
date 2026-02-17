// import { useState, type ChangeEvent } from 'react';

// export default function Search() {
//   const [query, setQuery] = useState('');

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
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
import type { ChangeEvent } from 'react';

type SearchProps = {
  query: string;
  onSetQuery: (value: string) => void;
};

export default function Search({ query, onSetQuery }: SearchProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSetQuery(e.target.value);
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
