/**
 * ExportImageButton.tsx — Render an element to a downloadable PNG image
 * Creates a beautiful "code card" look similar to carbon.now.sh
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { showToast } from '../stores/toastStore';
import { playPop } from '../utils/sounds';

interface ExportImageButtonProps {
  /** A ref to the DOM element to capture, OR a function returning the text to render */
  getText: () => string;
  filename?: string;
  language?: string;
}

export default function ExportImageButton({ getText, filename = 'mini-labs-export', language = 'text' }: ExportImageButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const text = getText();
      if (!text.trim()) {
        showToast('Nothing to export', '⚠️');
        setExporting(false);
        return;
      }

      // Dynamically import html-to-image
      const { toPng } = await import('html-to-image');

      // Create a hidden wrapper so the element is in DOM but invisible to user
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: hidden; z-index: -1; pointer-events: none;';

      // Create a "code card" element
      const card = document.createElement('div');
      card.style.cssText = `
        width: 720px; padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
      `;
      
      // macOS window bar
      const titleBar = document.createElement('div');
      titleBar.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        padding: 16px 20px; border-radius: 16px 16px 0 0;
        background: rgba(0,0,0,0.15);
      `;
      const dots = ['#ff5f57', '#ffbd2e', '#28c840'];
      dots.forEach(color => {
        const dot = document.createElement('div');
        dot.style.cssText = `width: 12px; height: 12px; border-radius: 50%; background: ${color};`;
        titleBar.appendChild(dot);
      });
      const titleText = document.createElement('span');
      titleText.textContent = `${filename}.${language}`;
      titleText.style.cssText = 'margin-left: 12px; font-size: 13px; color: rgba(255,255,255,0.6); font-family: Inter, sans-serif;';
      titleBar.appendChild(titleText);
      card.appendChild(titleBar);

      // Code block
      const codeBlock = document.createElement('pre');
      codeBlock.textContent = text;
      codeBlock.style.cssText = `
        margin: 0; padding: 24px 28px 28px;
        color: #e0def4; font-size: 14px; line-height: 1.65;
        white-space: pre-wrap; word-break: break-all;
        background: rgba(0,0,0,0.35); border-radius: 0 0 16px 16px;
      `;
      card.appendChild(codeBlock);

      // Watermark
      const watermark = document.createElement('div');
      watermark.textContent = 'mini-labs.dev';
      watermark.style.cssText = `
        text-align: right; padding: 6px 20px 12px;
        font-size: 11px; color: rgba(255,255,255,0.25);
        font-family: Inter, sans-serif; letter-spacing: 0.05em;
        margin-top: -38px; position: relative; z-index: 2;
      `;
      card.appendChild(watermark);

      wrapper.appendChild(card);
      document.body.appendChild(wrapper);

      // Wait for browser to lay out the element and load any pending CSS/fonts
      await new Promise(r => setTimeout(r, 150));

      // html-to-image often returns a blank/buggy canvas on the first pass for dynamic nodes
      // due to how SVGs encode CSS. Running it twice is a reliable workaround.
      await toPng(card, { pixelRatio: 2, cacheBust: true });
      await new Promise(r => setTimeout(r, 50));
      const dataUrl = await toPng(card, { pixelRatio: 2, cacheBust: true });
      
      document.body.removeChild(wrapper);

      // Download
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      playPop();
      showToast('Image exported!', '📸');
    } catch (err) {
      console.error(err);
      showToast('Export failed', '❌');
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={exporting}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.5rem 0.875rem', borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: exporting ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
        color: exporting ? 'var(--accent-purple)' : 'var(--text-secondary)',
        fontSize: '0.75rem', fontWeight: 600, fontFamily: "'Inter', sans-serif",
        cursor: exporting ? 'wait' : 'pointer', transition: 'all 0.2s',
        opacity: exporting ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!exporting) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; } }}
      onMouseLeave={e => { if (!exporting) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; } }}
    >
      {exporting ? '⏳' : '📸'} {exporting ? 'Exporting...' : 'Export PNG'}
    </motion.button>
  );
}
