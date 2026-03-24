import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $lang, setLang } from '../stores/langStore';

// We inline the translations normally contained in i18n/translations.ts to limit file deps,
// or we can import them. Since they are small, let's keep logic localized.

export default function HomepageHero() {
  const lang = useStore($lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tBadge = lang === 'id' ? '34 Tool Gratis — Tanpa Daftar' : '34 Free Tools — Zero Sign-up';
  const tTitle1 = lang === 'id' ? 'Pertajam' : 'Supercharge your';
  const tTitle2 = lang === 'id' ? 'Workflow' : 'Workflow';
  const tDesc = lang === 'id' 
    ? 'Koleksi lengkap web tool instan yang jalan 100% offline. Tanpa iklan, tanpa login, dan privasi super aman.'
    : 'An all-in-one suite of instantly accessible tools. No sign-up, no tracking — just extreme speed.';
  const tShortcut1 = lang === 'id' ? 'Pencet' : 'Press';
  const tShortcut2 = lang === 'id' ? 'untuk cari' : 'to search';

  // Prevent hydration layout shift
  if (!mounted) return <div style={{ minHeight: '300px' }} />;

  return (
    <div style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '4rem' }}>
      <div className="hero-badge" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem',
        borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
        color: '#a78bfa', fontSize: '0.8125rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: '2rem'
      }}>
        <span>✨</span> {tBadge}
      </div>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem', lineHeight: 1.1 }}>
        {tTitle1} <br />
        <span className="text-gradient" style={{ animation: 'shimmer 6s ease-in-out infinite' }}>{tTitle2}</span>
      </h1>
      <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
        {tDesc}
      </p>
      
      {/* Kbd shortcut hint */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tShortcut1}</span>
        <kbd style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tShortcut2}</span>
      </div>
      
      <div style={{ marginTop: '2rem', animation: 'bounce 2s infinite' }}>
        <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>↓</span>
      </div>
    </div>
  );
}
