/**
 * useAutoSave.ts — Syncs React state with localStorage
 * Persists input data across page refreshes.
 */
import { useState, useEffect } from 'react';

export function useAutoSave<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Initialize state from localStorage if available
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(`mini-labs-${key}`);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(`mini-labs-${key}`, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, [key, value]);

  return [value, setValue];
}
