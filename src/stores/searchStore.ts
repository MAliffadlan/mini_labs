/**
 * searchStore.ts — Shared search state between Navbar and SearchableTools
 * Uses nanostores for Astro cross-island reactivity.
 */
import { atom } from 'nanostores';

export const $searchQuery = atom('');
export const $isCommandPaletteOpen = atom(false);
