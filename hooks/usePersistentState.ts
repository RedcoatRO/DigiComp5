import { useState, useEffect } from 'react';

/**
 * Un hook custom care funcționează ca `useState`, dar persistă starea
 * în `localStorage` pentru a o reține între reîncărcările paginii.
 * @param key - Cheia unică pentru a salva valoarea în localStorage.
 * @param initialValue - Valoarea inițială de folosit dacă nu există nimic în storage.
 * @returns - O pereche [stare, funcțieDeSetare], la fel ca la `useState`.
 */
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Obține valoarea din localStorage sau folosește valoarea inițială
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // Salvează starea în localStorage de fiecare dată când se schimbă
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
