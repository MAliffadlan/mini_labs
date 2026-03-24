/**
 * ShareButton.tsx — Generate a shareable link for the current tool state
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createShareUrl } from '../utils/shareLink';
import { showToast } from '../stores/toastStore';
import { playPop } from '../utils/sounds';

interface ShareButtonProps {
  toolPath: string;
  getData: () => string;
}

export default function ShareButton({ toolPath, getData }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const data = getData();
    if (!data.trim()) {
      showToast('Nothing to share', '⚠️');
      return;
    }

    const url = createShareUrl(toolPath, data);
    if (!url) {
      showToast('Failed to generate link', '❌');
      return;
    }

    // Check URL length (browsers cap at ~2000 chars, but modern ones handle more)
    if (url.length > 8000) {
      showToast('Data too large to share via URL', '⚠️');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    playPop();
    setCopied(true);
    showToast('Share link copied!', '🔗');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.5rem 0.875rem', borderRadius: '10px',
        border: '1px solid var(--border)',
        backgroundColor: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
        color: copied ? '#10b981' : 'var(--text-secondary)',
        fontSize: '0.75rem', fontWeight: 600, fontFamily: "'Inter', sans-serif",
        cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; } }}
    >
      {copied ? '✅' : '🔗'} {copied ? 'Copied!' : 'Share'}
    </motion.button>
  );
}
