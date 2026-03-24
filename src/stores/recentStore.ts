/**
 * recentStore.ts — Track recently used tools in localStorage
 */
import { atom } from 'nanostores';

interface RecentTool {
  title: string;
  href: string;
  icon: string;
  color: string;
  timestamp: number;
}

const STORAGE_KEY = 'mini-labs-recent';
const MAX_RECENT = 5;

function load(): RecentTool[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export const $recentTools = atom<RecentTool[]>(load());

export function trackTool(tool: { title: string; href: string; icon: string; color: string }) {
  const existing = $recentTools.get().filter(t => t.href !== tool.href);
  const updated = [{ ...tool, timestamp: Date.now() }, ...existing].slice(0, MAX_RECENT);
  $recentTools.set(updated);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
