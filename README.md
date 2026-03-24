<div align="center">

# 🧪 Mini Labs

**The Ultimate, All-in-One Online Developer Toolkit.**

<p align="center">
  <img src="https://img.shields.io/badge/Astro-0C111A?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

An ultra-fast, premium suite of **26 distinct developer utilities** built with modern web technologies. Designed for speed, utility, and aesthetics — no sign-ups, no tracking, just instant productivity.

</div>

---

## ✨ Features

- ⚡ **Zero Loading Time**: Built with **Astro** for sub-1-second static routing and maximum performance.
- ⌘ **Command Palette**: A Spotlight-style global search (`Cmd/Ctrl + K`) to jump between 26+ tools instantly.
- 👨‍💻 **In-Browser IDE**: *Code Playground* powered by **StackBlitz WebContainers**, offering a full VS Code experience with React, Vue, Next.js, Angular, and Node.js environments right in your browser.
- 🚀 **REST API Tester**: A mini-Postman built directly into your browser to test endpoints, inspect headers, and measure latency.
- 🌍 **Localization**: Full support for English and Bahasa Indonesia.
- 🎨 **God-Tier Aesthetics**: Tailored color palettes, sleek dark themes, glassmorphism, and hardware-accelerated micro-animations powered by **Framer Motion**.

---

## 🛠️ The 26 Developer Tools

### 👨‍💻 Developer & Programming
- **Code Playground**: Full WebContainer IDE for React, Vue, Next, Node, etc.
- **REST API Tester**: Full HTTP request client.
- **JSON Formatter**: Format, minify, and validate JSON data.
- **Regex Tester**: Real-time evaluation of regular expressions.
- **JWT Decoder**: Inspect headers and payloads of JSON Web Tokens.
- **Base64 Encoder**: Immediate text-to-Base64 conversion.
- **Image ↔ Base64**: Drag-and-drop Image stringifier.
- **JSON → CSV**: Array data converter.
- **CSS Formatter**: Format and minify cascading stylesheets.
- **Text Diff Checker**: Side-by-side textual difference visualization.
- **Cron Job Generator**: Visual builder for standard cron expressions.
- **Hash Generator**: MD5, SHA-1, SHA-256 cryptographic hashes.
- **Timestamp Converter**: UNIX Epoch translators.
- **URL Encoder/Decoder**: Clean up URL safe strings.
- **UUID Generator**: Bulk unique-identifier generation.

### 📝 Text & Content
- **Markdown Editor**: Real-time rendering with GitHub-flavored markdown.
- **Lorem Ipsum Generator**: Quick dummy text generation.
- **Word Counter**: Detailed character, word, and reading-time metrics.
- **Case Converter**: Toggle UPPER, lower, Title, kebab, and snake_case.

### 🛠️ Utilities
- **Color Picker**: Visual hexadecimal/RGB/HSL selection.
- **HEX ↔ RGB Converter**: Number translation.
- **Palette Generator**: Instantly generate aesthetic color swatches.
- **Password Generator**: High-entropy secure cryptographic keys.
- **QR Code Generator**: Transform URLs into downloadable QR codes.
- **Timezone Converter**: Visualize UTC and global offsets instantly.
- **Countdown Timer**: Aesthetic event tracking.

---

## 🚀 Getting Started

If you want to run **Mini Labs** locally:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/MAliffadlan/mini_labs.git
cd mini_labs
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start the development server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:4321\` to see the app running.

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`
*(The build is verified to pass strict \`npx astro check\` without warnings, ensuring flawless Vercel deployments.)*

---

## 🏗️ Architecture

- **Astro Shell**: The core layout and routing mechanism (`src/pages/*.astro`) is statically generated for maximum SEO and raw load speed.
- **React Islands**: Tools and components are fully client-side React (`client:load` and `client:only="react"`).
- **Nanostores**: Used for global atomic state management (Theme, Language, Search Query).
- **Framer Motion**: Powers all UI transitions, popovers, and layout animations.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/MAliffadlan">Alif Fadlan</a></p>
</div>
