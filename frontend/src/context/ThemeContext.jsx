import { createContext, useCallback, useLayoutEffect, useState } from 'react';

// Next rules should be disabled no-unused-vars, react-refresh/only-export-components
// eslint-disable-next-line
export const ThemeContext = createContext(undefined);

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply before paint to avoid a frame of the wrong theme.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem('theme', newTheme);
      } catch {
        // ignore write failures (e.g. private mode)
      }
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
