/**
 * CopyButton.tsx — Copies text to clipboard with toast notification
 */
import React, { useState, useCallback } from 'react';
import { showToast } from '../stores/toastStore';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    showToast('Copied to clipboard!', '📋');
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '0.375rem 0.875rem',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: copied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)',
        backgroundColor: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        color: copied ? 'var(--success)' : 'var(--text-primary)',
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
        boxShadow: copied ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {copied ? '✓ Copied!' : `⎘ ${label}`}
    </button>
  );
}
