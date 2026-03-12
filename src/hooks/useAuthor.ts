import { useState, useEffect, useCallback } from 'react';
import { AUTHOR_STORAGE_KEY } from '../constants';

export function useAuthor() {
  const [author, setAuthorState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTHOR_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (author === null) return;
    try {
      localStorage.setItem(AUTHOR_STORAGE_KEY, author);
    } catch {
      // ignore
    }
  }, [author]);

  const setAuthor = useCallback((value: string | null) => {
    setAuthorState(value ?? null);
  }, []);

  const persistAuthor = useCallback((value: string) => {
    setAuthorState(value);
  }, []);

  return { author, setAuthor, persistAuthor };
}
