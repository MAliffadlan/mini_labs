/**
 * MarkdownEditor.tsx — Live Markdown Editor & Previewer
 */
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useDragDrop } from '../../hooks/useDragDrop';

const defaultMarkdown = `# Welcome to Markdown Live Preview!

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

## Why use it?
1. It's **fast** to write
2. It's *easy* to read
3. It converts directly to HTML

### Code Example
\`\`\`javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
\`\`\`

> "Simplicity is the soul of efficiency." - Austin Freeman

### You can also add...
- [Links to websites](https://github.com)
- Tables
- Images
- Blockquotes
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useAutoSave('markdown-editor', defaultMarkdown);
  const [html, setHtml] = useState('');

  const { isDragging, dragProps } = useDragDrop({
    onDrop: (text) => setMarkdown(text),
    accept: 'text/markdown'
  });

  useEffect(() => {
    // Parse markdown and sanitize HTML to prevent XSS
    const parsed = marked.parse(markdown) as string;
    setHtml(DOMPurify.sanitize(parsed));
  }, [markdown]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div 
        {...dragProps}
        className="split-view-container" 
        style={{ display: 'flex', gap: '1rem', minHeight: '600px', border: `2px dashed ${isDragging ? 'var(--accent-blue)' : 'transparent'}`, borderRadius: '16px', transition: 'all 0.2s', position: 'relative' }}
      >
        {isDragging && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(4px)', color: 'var(--accent-blue)', fontSize: '1.5rem', fontWeight: 600, borderRadius: '14px' }}>
            📥 Drop markdown file to load
          </div>
        )}

        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Markdown</span>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <button onClick={() => setMarkdown('')} style={{ fontSize: '0.75rem', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
               <CopyButton text={markdown} label="Copy MD" />
            </div>
          </div>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            spellCheck={false}
            style={{ flex: 1, width: '100%', padding: '1.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
          />
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</span>
            <CopyButton text={html} label="Copy HTML" />
          </div>
          {/* Prose container for standard styling */}
          <div 
            className="markdown-preview-prose"
            style={{ flex: 1, padding: '1.25rem', overflow: 'auto', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      
      {/* Dynamic CSS for the preview to look decent without external tailwind typography plugin */}
      <style dangerouslySetInnerHTML={{__html: `
        .markdown-preview-prose h1, .markdown-preview-prose h2, .markdown-preview-prose h3 {
          font-family: 'Outfit', sans-serif; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: var(--text-primary);
        }
        .markdown-preview-prose h1 { font-size: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
        .markdown-preview-prose h2 { font-size: 1.5rem; }
        .markdown-preview-prose p { margin-bottom: 1em; }
        .markdown-preview-prose a { color: var(--accent-blue); text-decoration: none; }
        .markdown-preview-prose a:hover { text-decoration: underline; }
        .markdown-preview-prose pre { background: var(--bg-card); padding: 1rem; border-radius: 8px; overflow-x: auto; border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; margin-bottom: 1em; }
        .markdown-preview-prose code { background: var(--bg-elevated); padding: 0.2em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; }
        .markdown-preview-prose pre code { background: none; padding: 0; }
        .markdown-preview-prose blockquote { border-left: 4px solid var(--accent-purple); padding-left: 1rem; color: var(--text-secondary); margin-left: 0; font-style: italic; }
        .markdown-preview-prose ul, .markdown-preview-prose ol { padding-left: 1.5rem; margin-bottom: 1em; }
        .markdown-preview-prose li { margin-bottom: 0.25em; }
      `}} />
    </div>
  );
}
