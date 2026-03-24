import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $lang } from '../stores/langStore';
import { allTools } from '../data/tools';

export default function HomepageFooter() {
  const lang = useStore($lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tTools = lang === 'id' ? 'Tool Tersedia' : 'Tools Available';
  const tFree = lang === 'id' ? '100% Gratis & Open Source' : '100% Free & Open Source';
  const tBuilt = lang === 'id' ? 'Dibuat dengan Astro + React · Dirakit oleh' : 'Built with Astro + React · Crafted by';

  if (!mounted) return <footer style={{ marginTop: '8rem', padding: '3rem 0', borderTop: '1px solid var(--border)' }} />;

  return (
    <footer style={{ textAlign: 'center', marginTop: '8rem', padding: '3rem 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <a href="https://github.com/MAliffadlan/mini_labs" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>GitHub ↗</a>
        <span style={{ color: 'var(--border)' }}>•</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{allTools.length} {tTools}</span>
        <span style={{ color: 'var(--border)' }}>•</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{tFree}</span>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        {tBuilt} <a href="https://github.com/MAliffadlan" target="_blank" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>Alif Fadlan</a>
      </p>
    </footer>
  );
}
