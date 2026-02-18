import { useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

export type Theme = 'dark' | 'light';

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme(defaultTheme: Theme = 'dark') {
  const [theme, setTheme] = useLocalStorageState<Theme>(defaultTheme, 'theme');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return { theme, setTheme, toggleTheme };
}
