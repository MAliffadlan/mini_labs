/**
 * SettingsModal.tsx — Theme toggle (Light/Dark/System) + data management
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $theme, setTheme, type Theme } from '../stores/themeStore';
import { showToast } from '../stores/toastStore';

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useStore($theme);

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'dark', label: 'Dark', icon: '🌑' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  const clearData = () => {
    localStorage.clear();
    showToast('All local data cleared!', '🗑️');
  };

  return (
    <>
      {/* Gear icon button in top-right */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 90,
          width: '44px', height: '44px', borderRadius: '50%',
          backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', fontSize: '1.125rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >⚙️</motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '420px', borderRadius: '24px',
                backgroundColor: 'rgba(24, 24, 27, 0.95)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>⚙️ Settings</h2>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem' }}>✕</button>
              </div>

              {/* Theme selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appearance</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {themes.map(t => (
                    <button key={t.value} onClick={() => { import('../utils/sounds').then(m => m.playTick()); setTheme(t.value); }}
                      style={{
                        flex: 1, padding: '0.875rem', borderRadius: '14px',
                        border: '1px solid', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                        backgroundColor: theme === t.value ? 'rgba(139,92,246,0.12)' : 'var(--bg-card)',
                        borderColor: theme === t.value ? 'rgba(139,92,246,0.35)' : 'var(--border)',
                        color: theme === t.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data management */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</label>
                <button onClick={clearData}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(244,63,94,0.2)', backgroundColor: 'rgba(244,63,94,0.05)', color: '#f43f5e', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.05)'}
                >🗑️ Clear All Local Data</button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Removes recent tools history, saved inputs, and preferences.</p>
              </div>

              {/* Version */}
              <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mini Labs v2.0 · 19 Tools</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
