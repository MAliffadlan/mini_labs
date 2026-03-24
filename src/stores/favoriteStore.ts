/**
 * favoriteStore.ts — Track user's favorite tools
 */
import { atom } from 'nanostores';

const STORAGE_KEY = 'mini-labs-favorites';

function load(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export const $favorites = atom<string[]>(load());

export function toggleFavorite(href: string) {
  const current = $favorites.get();
  const next = current.includes(href) ? current.filter(h => h !== href) : [...current, href];
  $favorites.set(next);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.includes(href);
}

export function isFavorite(href: string) {
  return $favorites.get().includes(href);
}
