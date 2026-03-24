/**
 * tools.ts — Global catalog of all Mini Labs tools
 */

export interface ToolDef {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  category: string;
  popular?: boolean;
  glowColor?: string;
}

export const allTools: ToolDef[] = [
  // Popular
  { title: 'JSON Formatter', description: 'Format, minify, and validate your JSON data with highlighted syntax errors.', icon: '{}', href: '/json', category: 'Dev', popular: true, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { title: 'Word Counter', description: 'Instantly count words, characters, sentences, and estimate reading time.', icon: '📝', href: '/word-counter', category: 'Text', popular: true, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  { title: 'Color Picker', description: 'Pick colors visually and convert them instantly to HEX, RGB, and HSL.', icon: '🎨', href: '/color-picker', category: 'Utility', popular: true, color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.4)' },
  // Dev
  { title: 'Regex Tester', description: 'Test and debug your Regular Expressions against custom text strings.', icon: '.*', href: '/regex', category: 'Dev', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  { title: 'Base64 Encoder/Decoder', description: 'Encode text to Base64 or decode Base64 strings back to plain text.', icon: '⇋', href: '/base64', category: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' },
  { title: 'Timestamp Converter', description: 'Convert UNIX timestamps to human-readable dates and vice versa.', icon: '⌚', href: '/timestamp', category: 'Dev', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' },
  { title: 'URL Encoder/Decoder', description: 'Encode or decode URL components with percent-encoding instantly.', icon: '🔗', href: '/url-encoder', category: 'Dev', popular: false, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' },
  { title: 'Image ↔ Base64', description: 'Convert images to Base64 strings or decode Base64 back to images.', icon: '🖼️', href: '/image-base64', category: 'Dev', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { title: 'JSON → CSV', description: 'Convert JSON arrays to downloadable CSV spreadsheets.', icon: '📊', href: '/json-csv', category: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' },
  { title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens — header, payload, and expiration.', icon: '🔑', href: '/jwt-decoder', category: 'Dev', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { title: 'Cron Job Generator', description: 'Build cron expressions visually with quick presets and descriptions.', icon: '⏰', href: '/cron-generator', category: 'Dev', popular: false, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.4)' },
  { title: 'Text Diff Checker', description: 'Compare two texts side-by-side and spot differences instantly.', icon: '📄', href: '/text-diff', category: 'Dev', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  { title: 'CSS Formatter & Minifier', description: 'Format ugly CSS into readable code, or compress it to save bandwidth.', icon: '💅', href: '/css-formatter', category: 'Dev', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { title: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes.', icon: '🔒', href: '/hash', category: 'Dev', popular: false, color: '#14b8a6', glowColor: 'rgba(20, 184, 166, 0.4)' },
  { title: 'REST API Tester', description: 'Send HTTP requests to test REST APIs. Inspect responses, status codes, and latencies.', icon: '🚀', href: '/api-tester', category: 'Dev', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' },
  { title: 'Code Playground', description: 'Write HTML, CSS, and JS with a VS Code-style editor and live preview.', icon: '👨‍💻', href: '/code-playground', category: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' },
  { title: 'UUID Generator', description: 'Generate up to 10,000 v4 UUIDs instantly with bulk formatting.', icon: '🆔', href: '/uuid', category: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' },
  // Text
  { title: 'Markdown Editor', description: 'Write markdown with real-time HTML preview. Supports drag-and-drop.', icon: 'Ⓜ️', href: '/markdown', category: 'Text', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { title: 'Lorem Ipsum Generator', description: 'Generate placeholder dummy text for your UI mockups.', icon: '📰', href: '/lorem', category: 'Text', popular: false, color: '#14b8a6', glowColor: 'rgba(20, 184, 166, 0.4)' },
  { title: 'Case Converter', description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.', icon: 'Aa', href: '/case-converter', category: 'Text', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { title: 'Zen Scratchpad', description: 'Distraction-free notepad that auto-saves your keystrokes globally.', icon: '📓', href: '/scratchpad', category: 'Text', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  // Utility
  { title: 'Password Generator', description: 'Generate cryptographically secure passwords with custom rules.', icon: '🔐', href: '/password-generator', category: 'Utility', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' },
  { title: 'QR Code Generator', description: 'Generate downloadable QR codes from any URL or text.', icon: '📱', href: '/qr-generator', category: 'Utility', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { title: 'Countdown Timer', description: 'Create an aesthetic countdown tracker for any upcoming event.', icon: '⏳', href: '/countdown', category: 'Utility', popular: false, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.4)' },
  { title: 'Timezone Converter', description: 'Convert dates and times across different global timezones.', icon: '🌍', href: '/timezone', category: 'Utility', popular: false, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' },
  { title: 'Palette Generator', description: 'Generate aesthetically pleasing color palettes with a single click.', icon: '✨', href: '/palette-generator', category: 'Utility', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' },
  { title: 'HEX ↔ RGB Converter', description: 'Convert Hexadecimal colors to RGB values, or vice versa.', icon: '#', href: '/hex-rgb', category: 'Utility', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
];
