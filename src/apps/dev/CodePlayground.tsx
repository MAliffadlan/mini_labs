/**
 * CodePlayground.tsx — VS Code-style Web Code Editor with Live Preview
 * Uses Monaco Editor for HTML, CSS, JS editing with real-time iframe preview
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';

type TabType = 'html' | 'css' | 'js';

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, World! 🚀</h1>
  <p>Start coding below and see the magic happen live!</p>
  <button id="btn">Click me</button>
  <div id="output"></div>
</div>`;

const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  text-align: center;
  padding: 3rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

#output {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  color: #34d399;
  min-height: 1.5rem;
}`;

const DEFAULT_JS = `const btn = document.getElementById('btn');
const output = document.getElementById('output');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  output.textContent = \`Button clicked \${count} time\${count > 1 ? 's' : ''}! 🎉\`;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);
});`;

const LS_KEY_HTML = 'code-playground-html';
const LS_KEY_CSS = 'code-playground-css';
const LS_KEY_JS = 'code-playground-js';

function getStored(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function CodePlayground() {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [html, setHtml] = useState(() => getStored(LS_KEY_HTML, DEFAULT_HTML));
  const [css, setCss] = useState(() => getStored(LS_KEY_CSS, DEFAULT_CSS));
  const [js, setJs] = useState(() => getStored(LS_KEY_JS, DEFAULT_JS));
  const [isAutoRun, setIsAutoRun] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY_HTML, html);
      localStorage.setItem(LS_KEY_CSS, css);
      localStorage.setItem(LS_KEY_JS, js);
    } catch { /* quota exceeded */ }
  }, [html, css, js]);

  const buildPreview = useCallback(() => {
    setConsoleOutput([]);
    const doc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
// Override console.log to send messages to parent
(function() {
  const origLog = console.log;
  const origError = console.error;
  const origWarn = console.warn;
  console.log = function(...args) {
    origLog.apply(console, args);
    window.parent.postMessage({ type: 'console', level: 'log', data: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*');
  };
  console.error = function(...args) {
    origError.apply(console, args);
    window.parent.postMessage({ type: 'console', level: 'error', data: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*');
  };
  console.warn = function(...args) {
    origWarn.apply(console, args);
    window.parent.postMessage({ type: 'console', level: 'warn', data: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*');
  };
  window.onerror = function(msg) {
    window.parent.postMessage({ type: 'console', level: 'error', data: String(msg) }, '*');
  };
})();
try {
${js}
} catch(e) {
  console.error(e.message);
}
<\/script>
</body>
</html>`;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = doc;
    }
  }, [html, css, js]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'console') {
        const prefix = e.data.level === 'error' ? '❌ ' : e.data.level === 'warn' ? '⚠️ ' : '› ';
        setConsoleOutput(prev => [...prev.slice(-49), prefix + e.data.data]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto-run with debounce
  useEffect(() => {
    if (!isAutoRun) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(buildPreview, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [html, css, js, isAutoRun, buildPreview]);

  // Initial run
  useEffect(() => { buildPreview(); }, []);

  const handleChange = (value: string | undefined) => {
    const v = value ?? '';
    if (activeTab === 'html') setHtml(v);
    else if (activeTab === 'css') setCss(v);
    else setJs(v);
  };

  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
  const langMap: Record<TabType, string> = { html: 'html', css: 'css', js: 'javascript' };

  const tabs: { id: TabType; label: string; icon: string; color: string }[] = [
    { id: 'html', label: 'HTML', icon: '🏗️', color: '#ef4444' },
    { id: 'css', label: 'CSS', icon: '🎨', color: '#3b82f6' },
    { id: 'js', label: 'JS', icon: '⚡', color: '#eab308' },
  ];

  const resetCode = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setTimeout(buildPreview, 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: 'calc(100vh - 200px)', minHeight: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>

      {/* Top Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
        {/* File Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem', borderRadius: '8px 8px 0 0',
                border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Auto-run toggle */}
          <button
            onClick={() => setIsAutoRun(!isAutoRun)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
              background: isAutoRun ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: isAutoRun ? '#10b981' : 'var(--text-muted)', fontSize: '0.75rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAutoRun ? '#10b981' : 'var(--text-muted)' }} />
            Auto
          </button>

          {/* Run Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={buildPreview}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.875rem', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Run
          </motion.button>

          {/* Console Toggle */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
              background: showConsole ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              color: showConsole ? '#a78bfa' : 'var(--text-muted)', fontSize: '0.75rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {consoleOutput.length > 0 && (
              <span style={{ background: '#8b5cf6', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>
                {consoleOutput.length}
              </span>
            )}
            Console
          </button>

          {/* Reset */}
          <button
            onClick={resetCode}
            style={{
              padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Main Content: Editor + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Left: Monaco Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
          <Editor
            height="100%"
            language={langMap[activeTab]}
            value={currentCode}
            onChange={handleChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              bracketPairColorization: { enabled: true },
              autoClosingBrackets: 'always',
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              formatOnPaste: true,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
            }}
          />
        </div>

        {/* Right: Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f172a' }}>
          {/* Preview Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginLeft: '0.5rem' }}>Preview</span>
          </div>

          <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-modals"
            style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
          />
        </div>
      </div>

      {/* Console Panel */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '140px', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ background: '#0c0c0c', borderTop: '1px solid var(--border)', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a78bfa', fontFamily: "'JetBrains Mono', monospace" }}>CONSOLE</span>
              <button
                onClick={() => setConsoleOutput([])}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.6875rem', fontFamily: "'Inter', sans-serif" }}
              >
                Clear
              </button>
            </div>
            <div style={{ padding: '0.5rem 1rem', overflowY: 'auto', height: 'calc(100% - 32px)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', color: '#94a3b8' }}>
              {consoleOutput.length === 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Console output will appear here...</span>
              ) : (
                consoleOutput.map((line, i) => (
                  <div key={i} style={{ padding: '0.125rem 0', color: line.startsWith('❌') ? '#ef4444' : line.startsWith('⚠️') ? '#eab308' : '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
