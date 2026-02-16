import type { ReactNode } from 'react';

type MainProps = {
  children: ReactNode;
};

export default function Main({ children }: MainProps) {
  return <main className='main'>{children}</main>;
}
