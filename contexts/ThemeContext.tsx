import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Creăm contextul cu o valoare default.
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => console.warn('ThemeProvider not used'),
});

/**
 * Provider-ul de temă.
 * Acest component înfășoară aplicația și oferă acces la starea temei.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // La încărcarea componentei, verificăm preferința utilizatorului din localStorage sau sistem.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (storedTheme) {
        setTheme(storedTheme);
    } else if (userMedia.matches) {
        setTheme('dark');
    }
  }, []);

  // Ori de câte ori tema se schimbă, actualizăm clasa pe elementul <html> și în localStorage.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Funcție pentru a comuta între teme.
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Memorăm valoarea contextului pentru a evita re-randări inutile ale consumatorilor.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook custom pentru a accesa cu ușurință contextul temei.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
