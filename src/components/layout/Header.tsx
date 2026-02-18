import type { ReactNode } from 'react';

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return <header className='header'>{children}</header>;
}
