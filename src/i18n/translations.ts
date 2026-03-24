/**
 * translations.ts — All UI strings in English & Indonesian
 */

export type Lang = 'en' | 'id';

export const translations: Record<string, Record<Lang, string>> = {
  // Homepage
  'home.title': { en: 'Your All-in-One', id: 'Semua Tools' },
  'home.title2': { en: 'Online Toolbox', id: 'Dalam Satu Genggaman' },
  'home.subtitle': { en: 'Fast, free, and offline-ready developer utilities — crafted for speed.', id: 'Utilitas developer yang cepat, gratis, dan bisa offline — dibuat untuk kecepatan.' },
  'home.search': { en: 'to search', id: 'untuk cari' },
  'home.footer.tools': { en: 'Tools Available', id: 'Tool Tersedia' },
  'home.footer.free': { en: '100% Free & Open Source', id: '100% Gratis & Open Source' },

  // Sections
  'section.favorites': { en: 'Favorites', id: 'Favorit' },
  'section.recent': { en: 'Recently Used', id: 'Terakhir Digunakan' },
  'section.popular': { en: '🔥 Popular', id: '🔥 Populer' },
  'section.all': { en: 'All Tools', id: 'Semua Tool' },
  'section.also': { en: '💡 You might also like', id: '💡 Mungkin kamu juga suka' },

  // Categories
  'cat.all': { en: 'All', id: 'Semua' },
  'cat.dev': { en: 'Dev', id: 'Dev' },
  'cat.text': { en: 'Text', id: 'Teks' },
  'cat.utility': { en: 'Utility', id: 'Utilitas' },

  // Common actions
  'action.copy': { en: 'Copied to clipboard!', id: 'Tersalin ke clipboard!' },
  'action.clear': { en: 'Clear', id: 'Hapus' },
  'action.share': { en: 'Share', id: 'Bagikan' },
  'action.export': { en: 'Export PNG', id: 'Ekspor PNG' },

  // Settings
  'settings.title': { en: 'Settings', id: 'Pengaturan' },
  'settings.appearance': { en: 'Appearance', id: 'Tampilan' },
  'settings.language': { en: 'Language', id: 'Bahasa' },
  'settings.clearData': { en: 'Clear All Local Data', id: 'Hapus Semua Data Lokal' },
  'settings.clearConfirm': { en: 'All cleared! Reloading...', id: 'Semua dihapus! Memuat ulang...' },

  // Breadcrumb
  'nav.home': { en: 'Home', id: 'Beranda' },
};
