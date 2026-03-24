import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LS_KEY = 'mini-labs-zen-scratchpad';

export default function ZenScratchpad() {
  const [text, setText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved !== null) {
        setText(saved);
      }
    } catch {
      // Ignore quota errors on read
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever text changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LS_KEY, text);
    } catch {
      // Ignore quote errors on write
    }
  }, [text, isLoaded]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(400, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMsg('Copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratchpad-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setToastMsg('File downloaded!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all your notes? This cannot be undone.')) {
      setText('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Only render once loaded to avoid hydration mismatch
  if (!isLoaded) return <div style={{ minHeight: '60vh' }} />;

  return (
    <div 
      style={{ 
        position: 'relative',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        background: isFocused ? 'var(--bg-card)' : 'transparent',
        border: '1px solid',
        borderColor: isFocused ? 'var(--border)' : 'transparent',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '2rem',
      }}
    >
      {/* Top Toolbar (Fades out when typing/focused for Zen mode constraint) */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: isFocused && text.length > 0 ? 0.2 : 1 }}
        whileHover={{ opacity: 1 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          transition: 'opacity 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace" }}>
          <div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{wordCount}</span> words
          </div>
          <div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{charCount}</span> chars
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {text.length > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid transparent',
                  background: 'transparent', color: 'var(--text-muted)',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Clear
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text-secondary)',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                💾 Save .txt
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '12px', border: 'none',
                  background: 'var(--text-primary)', color: 'var(--bg-primary)',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
                }}
              >
                📋 Copy
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Main Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Start typing your thoughts here... Everything is auto-saved locally."
        spellCheck="false"
        style={{
          width: '100%',
          flex: 1,
          minHeight: '400px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.6,
          resize: 'none',
          overflow: 'hidden',
          paddingBottom: '4rem',
        }}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(16, 185, 129, 0.9)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ✓ {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
