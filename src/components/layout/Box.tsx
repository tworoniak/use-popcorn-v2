import { useState, type ReactNode } from 'react';

type BoxProps = {
  children: ReactNode;
};

export default function Box({ children }: BoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}
