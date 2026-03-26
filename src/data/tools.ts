/**
 * tools.ts — Global catalog of all Mini Labs tools (with i18n support)
 */

export interface ToolDef {
  title: string;
  titleId?: string;
  description: string;
  descriptionId?: string;
  icon: string;
  href: string;
  category: string;
  categoryId?: string;
  popular?: boolean;
  color: string;
  glowColor?: string;
}

export const allTools: ToolDef[] = [
  // Popular
  { 
    title: 'WebRTC P2P Transfer', titleId: 'Transfer P2P WebRTC',
    description: 'P2P chat, file transfer, video call, and screen sharing — all serverless, directly in your browser.', descriptionId: 'Chat, kirim file, video call, dan screen sharing P2P — langsung antar browser tanpa server.',
    icon: '📡', href: '/webrtc', category: 'Dev', categoryId: 'Dev', popular: true, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  { 
    title: 'JSON Formatter', titleId: 'Format JSON',
    description: 'Format, minify, and validate your JSON data with highlighted syntax errors.', descriptionId: 'Format, perkecil, dan validasi data JSON dengan penunjuk otomatis jika ada error.',
    icon: '{}', href: '/json', category: 'Dev', categoryId: 'Dev', popular: true, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' 
  },
  { 
    title: 'Word Counter', titleId: 'Penghitung Kata',
    description: 'Instantly count words, characters, sentences, and estimate reading time.', descriptionId: 'Hitung kata, karakter, dan kalimat tanpa batas, plus estimasi waktu baca.',
    icon: '📝', href: '/word-counter', category: 'Text', categoryId: 'Teks', popular: true, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  { 
    title: 'Color Picker', titleId: 'Pemilih Warna',
    description: 'Pick colors visually and convert them instantly to HEX, RGB, and HSL.', descriptionId: 'Pilih palet warna secara visual dan otomatis dikonversi ke format HEX, RGB, atau HSL.',
    icon: '🎨', href: '/color-picker', category: 'Utility', categoryId: 'Utilitas', popular: true, color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.4)' 
  },
  // Dev
  { 
    title: 'Fake JSON Generator', titleId: 'Penghasil JSON Palsu',
    description: 'Generate massive arrays of mock JSON data with custom schemas instantly.', descriptionId: 'Buat ribuan data JSON tiruan (mock data) dengan skema kustom secepat kilat.',
    icon: '💾', href: '/fake-json-generator', category: 'Dev', categoryId: 'Dev', popular: true, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  { 
    title: 'Regex Tester', titleId: 'Penguji Regex',
    description: 'Test and debug your Regular Expressions against custom text strings.', descriptionId: 'Uji dan cari kutu (debug) kode Regular Expression bos ke teks apa saja.',
    icon: '.*', href: '/regex', category: 'Dev', categoryId: 'Dev', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  { 
    title: 'Base64 Encoder/Decoder', titleId: 'Enkripsi Base64',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text.', descriptionId: 'Ubah teks jadi kode Base64 atau kembalikan kode Base64 jadi teks normal.',
    icon: '⇋', href: '/base64', category: 'Dev', categoryId: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'Timestamp Converter', titleId: 'Konverter Waktu',
    description: 'Convert UNIX timestamps to human-readable dates and vice versa.', descriptionId: 'Ubah angka UNIX timestamp super panjang jadi tanggal yang gampang dibaca.',
    icon: '⌚', href: '/timestamp', category: 'Dev', categoryId: 'Dev', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' 
  },
  { 
    title: 'URL Encoder/Decoder', titleId: 'Koder URL',
    description: 'Encode or decode URL components with percent-encoding instantly.', descriptionId: 'Benerin link URL yang berantakan atau hapus persentase (%20) dari link.',
    icon: '🔗', href: '/url-encoder', category: 'Dev', categoryId: 'Dev', popular: false, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' 
  },
  { 
    title: 'Image ↔ Base64', titleId: 'Gambar ↔ Base64',
    description: 'Convert images to Base64 strings or decode Base64 back to images.', descriptionId: 'Ubah file gambar jadi deretan kode string Base64 buat diselipin di CSS/HTML.',
    icon: '🖼️', href: '/image-base64', category: 'Dev', categoryId: 'Dev', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' 
  },
  { 
    title: 'JSON → CSV', titleId: 'JSON → CSV',
    description: 'Convert JSON arrays to downloadable CSV spreadsheets.', descriptionId: 'Sulap data array JSON jadi file tabel CSV yang bisa di-download & dibuka di Excel.',
    icon: '📊', href: '/json-csv', category: 'Dev', categoryId: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'JWT Decoder', titleId: 'Dekoder JWT',
    description: 'Decode and inspect JSON Web Tokens — header, payload, and expiration.', descriptionId: 'Bongkar isi JSON Web Token rahasia buat ngeliat kapan kadaluwarsanya.',
    icon: '🔑', href: '/jwt-decoder', category: 'Dev', categoryId: 'Dev', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' 
  },
  { 
    title: 'Cron Job Generator', titleId: 'Pencipta Jadwal Cron',
    description: 'Build cron expressions visually with quick presets and descriptions.', descriptionId: 'Bikin jadwal waktu Cron Job otomatis cuma tinggal pilih-pilih tombol visual.',
    icon: '⏰', href: '/cron-generator', category: 'Dev', categoryId: 'Dev', popular: false, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.4)' 
  },
  { 
    title: 'Text Diff Checker', titleId: 'Pengecek Beda Teks',
    description: 'Compare two texts side-by-side and spot differences instantly.', descriptionId: 'Bandingin dua kode/teks sebelah-sebelahan dan liat bedanya ada di mana secara live.',
    icon: '📄', href: '/text-diff', category: 'Dev', categoryId: 'Dev', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  { 
    title: 'CSS Formatter & Minifier', titleId: 'Perapih CSS',
    description: 'Format ugly CSS into readable code, or compress it to save bandwidth.', descriptionId: 'Rapihin kode CSS yang berantakan, atau press ukurannya biar web jadi kenceng.',
    icon: '💅', href: '/css-formatter', category: 'Dev', categoryId: 'Dev', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' 
  },
  { 
    title: 'Hash Generator', titleId: 'Generator Hash',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes.', descriptionId: 'Ubah teks apa aja jadi kode enkripsi searah (MD5, SHA-1, SHA-256).',
    icon: '🔒', href: '/hash', category: 'Dev', categoryId: 'Dev', popular: false, color: '#14b8a6', glowColor: 'rgba(20, 184, 166, 0.4)' 
  },
  { 
    title: 'REST API Tester', titleId: 'Penguji API',
    description: 'Send HTTP requests to test REST APIs. Inspect responses, status codes, and latencies.', descriptionId: 'Tembak endpoint API pake GET/POST buat ngecek output respon JSON tanpa perlu Postman.',
    icon: '🚀', href: '/api-tester', category: 'Dev', categoryId: 'Dev', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' 
  },
  { 
    title: 'Code Playground', titleId: 'Taman Kode',
    description: 'Write HTML, CSS, and JS with a VS Code-style editor and live preview.', descriptionId: 'Ngoding HTML/CSS/JS ngga perlu repot-repot buka VS Code, langsung cek hasilnya di sini.',
    icon: '👨‍💻', href: '/code-playground', category: 'Dev', categoryId: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'UUID Generator', titleId: 'Penghasil UUID',
    description: 'Generate up to 10,000 v4 UUIDs instantly with bulk formatting.', descriptionId: 'Langsung bikin UUID/GUID versi 4 berapapun banyaknya secepat kilat.',
    icon: '🆔', href: '/uuid', category: 'Dev', categoryId: 'Dev', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  // Text
  { 
    title: 'Markdown Editor', titleId: 'Editor Markdown',
    description: 'Write markdown with real-time HTML preview. Supports drag-and-drop.', descriptionId: 'Nulis artikel atau Readme pake Markdown dengan preview HTML interaktif real-time.',
    icon: 'Ⓜ️', href: '/markdown', category: 'Text', categoryId: 'Teks', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' 
  },
  { 
    title: 'Lorem Ipsum Generator', titleId: 'Pembuat Lorem Ipsum',
    description: 'Generate placeholder dummy text for your UI mockups.', descriptionId: 'Generate teks palsu Lorem Ipsum sepanjang apapun untuk mengisi mock-up desain bos.',
    icon: '📰', href: '/lorem', category: 'Text', categoryId: 'Teks', popular: false, color: '#14b8a6', glowColor: 'rgba(20, 184, 166, 0.4)' 
  },
  { 
    title: 'Case Converter', titleId: 'Pengubah Huruf',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.', descriptionId: 'Ubah tulisan jadi HURUF BESAR, huruf kecil, camelCase atau Gaya Judul dengan 1 klik.',
    icon: 'Aa', href: '/case-converter', category: 'Text', categoryId: 'Teks', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' 
  },
  { 
    title: 'Notepad', titleId: 'Buku Catatan',
    description: 'Distraction-free notepad that auto-saves your keystrokes locally.', descriptionId: 'Tempat coret-coret sepi dari gangguan. Semuanya otomatis tersimpan permanen di HP/Laptop bos.',
    icon: '📓', href: '/scratchpad', category: 'Text', categoryId: 'Teks', popular: false, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' 
  },
  // Utility
  { 
    title: 'Password Generator', titleId: 'Penghasil Password',
    description: 'Generate cryptographically secure passwords with custom rules.', descriptionId: 'Bikin sandi anti-hacker yang kuat menggunakan acak huruf, angka, dan simbol gila-gilaan.',
    icon: '🔐', href: '/password-generator', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' 
  },
  { 
    title: 'QR Code Generator', titleId: 'Pembuat Barcode QR',
    description: 'Generate downloadable QR codes from any URL or text.', descriptionId: 'Ubah teks atau URL link jadi gambar kotak-kotak QR Code ciamik buat langsung didownload.',
    icon: '📱', href: '/qr-generator', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' 
  },
  { 
    title: 'Countdown Timer', titleId: 'Waktu Mundur',
    description: 'Create an aesthetic countdown tracker for any upcoming event.', descriptionId: 'Layar berhitung waktu mundur yang cantik paripurna buat pantau event terdekat.',
    icon: '⏳', href: '/countdown', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#eab308', glowColor: 'rgba(234, 179, 8, 0.4)' 
  },
  { 
    title: 'Timezone Converter', titleId: 'Konverter Zona Waktu',
    description: 'Convert dates and times across different global timezones.', descriptionId: 'Selarasin waktu server, waktu meeting London ke Jakarta dengan gampang banget.',
    icon: '🌍', href: '/timezone', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' 
  },
  { 
    title: 'Palette Generator', titleId: 'Penghasil Palet Warna',
    description: 'Generate aesthetically pleasing color palettes with a single click.', descriptionId: 'Hasilkan 5 kombinasi palet warna estetik buat desain grafis/web dengan satu cetekan.',
    icon: '✨', href: '/palette-generator', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.4)' 
  },
  { 
    title: 'HEX ↔ RGB Converter', titleId: 'Konverter HEX ↔ RGB',
    description: 'Convert Hexadecimal colors to RGB values, or vice versa.', descriptionId: 'Tukar-menukar nilai warna Hexa ke Desimal ke RGB secara otomatis biar programmer gak pusing.',
    icon: '#', href: '/hex-rgb', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' 
  },
  { 
    title: 'EXIF / GPS Reader', titleId: 'Pembongkar EXIF/GPS',
    description: 'Reveal hidden photo metadata, GPS location, and strip EXIF for privacy.', descriptionId: 'Bongkar lokasi GPS rahasia dari sebuah foto dan hapus datanya biar bos ngga diamati.',
    icon: '🕵️', href: '/exif-reader', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.4)' 
  },
  { 
    title: 'Spin the Wheel', titleId: 'Roda Keberuntungan',
    description: 'Add names and spin a colorful wheel to pick a random winner!', descriptionId: 'Masukin nama-nama dan putar roda berhadiah buat nge-gacha acak pilihan yang adil.',
    icon: '🎡', href: '/spin-wheel', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'Typing Speed Test', titleId: 'Lomba Mengetik Cepat',
    description: 'Test your typing speed and accuracy with a Monkeytype-style test.', descriptionId: 'Uji kecepatan dan akurasi ngetik keyboard bos (WPM/CPM) pake test 30 detik yang bikin tegang.',
    icon: '⌨️', href: '/typing-test', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'Scientific Calculator', titleId: 'Kalkulator Saintifik',
    description: 'Premium calculator with sin, cos, tan, log, sqrt, factorial, and history.', descriptionId: 'Kalkulator level dewa pake sin, cos, log, akar kuadrat, logaritma plus history yang kesimpan rapi.',
    icon: '🧮', href: '/calculator', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
  { 
    title: 'IP & Network Info', titleId: 'Info IP & Jaringan',
    description: 'Instantly detect your public IP address, location, ISP, and device info.', descriptionId: 'Selidiki alamat IP asli, ISP, titik koordinat peta, & nama OS/Browser bos detik ini juga.',
    icon: '🌐', href: '/ip-info', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' 
  },
  { 
    title: 'URL Scanner', titleId: 'Scanner Keamanan URL',
    description: 'Scan suspicious URLs for phishing, malware, brand impersonation, and red flags.', descriptionId: 'Jagoan pendeteksi phising! Periksa link penipuan dari semua celah keamanan yang ada (VirusTotal-style).',
    icon: '🛡️', href: '/url-scanner', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.4)' 
  },
  { 
    title: 'Steganography', titleId: 'Steganografi (Rahasia)',
    description: 'Hide secret messages inside images or reveal hidden messages. 100% client-side.', descriptionId: 'Kemampuan spy/militer! Kubur chat rahasia di dalam foto tanpa ngerusak fotonya secuilpun.',
    icon: '🔒', href: '/steganography', category: 'Utility', categoryId: 'Utilitas', popular: false, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.4)' 
  },
];
