/**
 * CopyButton.tsx — Copies text to clipboard with visual confirmation
 */
import React, { useState, useCallback } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '0.375rem 0.75rem',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        backgroundColor: copied ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-elevated)',
        color: copied ? 'var(--success)' : 'var(--text-secondary)',
        fontSize: '0.75rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {copied ? '✓ Copied' : `⎘ ${label}`}
    </button>
  );
}
