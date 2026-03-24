/**
 * toastStore.ts — Global toast state
 */
import { atom } from 'nanostores';

interface Toast {
  id: string;
  message: string;
  icon?: string;
}

export const $toasts = atom<Toast[]>([]);

let counter = 0;

export function showToast(message: string, icon = '✅') {
  const id = `toast-${++counter}`;
  $toasts.set([...$toasts.get(), { id, message, icon }]);
  setTimeout(() => dismissToast(id), 2500);
}

export function dismissToast(id: string) {
  $toasts.set($toasts.get().filter(t => t.id !== id));
}
