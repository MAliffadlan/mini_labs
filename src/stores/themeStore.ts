/**
 * themeStore.ts — Light/Dark/System theme management
 */
import { atom } from 'nanostores';

export type Theme = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'mini-labs-theme';

function getStored(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
}

export const $theme = atom<Theme>(getStored());

export function setTheme(theme: Theme) {
  $theme.set(theme);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  let resolved = theme;
  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', resolved);
}

// Apply on load
if (typeof window !== 'undefined') {
  applyTheme(getStored());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ($theme.get() === 'system') applyTheme('system');
  });
}
