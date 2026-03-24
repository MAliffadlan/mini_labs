/**
 * langStore.ts — Language preference store
 */
import { atom } from 'nanostores';
import type { Lang } from '../i18n/translations';

const STORAGE_KEY = 'mini-labs-lang';

function getInitial(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored && (stored === 'en' || stored === 'id')) return stored;
  // Auto-detect from browser
  const browserLang = navigator.language?.toLowerCase() || 'en';
  return browserLang.startsWith('id') ? 'id' : 'en';
}

export const $lang = atom<Lang>(getInitial());

export function setLang(lang: Lang) {
  $lang.set(lang);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
}
