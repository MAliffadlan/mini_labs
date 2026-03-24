/**
 * useTranslation.ts — Hook to fetch translated strings
 */
import { useStore } from '@nanostores/react';
import { $lang } from '../stores/langStore';
import { translations } from '../i18n/translations';

export function useTranslation() {
  const lang = useStore($lang);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
  };

  return { t, lang };
}
