import { useState, type ChangeEvent } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');

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
