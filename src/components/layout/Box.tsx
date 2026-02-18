// Box.tsx
import { useState, type ReactNode } from 'react';

type BoxProps = {
  children: ReactNode;
};

export default function Box({ children }: BoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button
        type='button'
        className='btn-toggle'
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && (
        <div className='box__scroll scroll-area' tabIndex={0}>
          {children}
        </div>
      )}
    </div>
  );
}
