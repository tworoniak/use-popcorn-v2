import type { ReactNode } from 'react';
import Logo from './Logo';

type NavBarProps = {
  children: ReactNode;
};

export default function NavBar({ children }: NavBarProps) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}
