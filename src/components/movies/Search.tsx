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
