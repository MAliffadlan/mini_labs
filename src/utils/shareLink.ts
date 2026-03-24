/**
 * shareLink.ts — Encode/decode tool data into shareable URL params
 * Uses base64 + URI encoding to compress data into URLs.
 */

export function encodeShareData(data: string): string {
  try {
    // TextEncoder → base64 (supports Unicode)
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const binaryStr = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
    return btoa(binaryStr);
  } catch {
    return '';
  }
}

export function decodeShareData(encoded: string): string {
  try {
    const binaryStr = atob(encoded);
    const bytes = Uint8Array.from(binaryStr, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

export function createShareUrl(toolPath: string, data: string): string {
  const encoded = encodeShareData(data);
  if (!encoded) return '';
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}${toolPath}?d=${encodeURIComponent(encoded)}`;
}

export function getShareDataFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const d = params.get('d');
  if (!d) return null;
  return decodeShareData(d);
}
