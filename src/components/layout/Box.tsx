// Box.tsx
import { type ReactNode } from 'react'; // useState
// import { Plus, Minus } from 'lucide-react';

type BoxProps = {
  children: ReactNode;
  scrollId?: string;
};

export default function Box({ children, scrollId }: BoxProps) {
  // const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      {/* <button
        type='button'
        className='btn-toggle'
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <Minus size={20} strokeWidth={1.5} />
        ) : (
          <Plus size={20} strokeWidth={1.5} />
        )}
      </button> */}

      {/* {isOpen && ( */}
      <div className='box__scroll scroll-area' tabIndex={0} id={scrollId}>
        {children}
      </div>
      {/* )} */}
    </div>
  );
}
