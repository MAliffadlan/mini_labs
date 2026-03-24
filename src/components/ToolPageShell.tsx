/**
 * ToolPageShell.tsx — Shared wrapper for tool pages
 * Provides: Breadcrumb, Reactive Localized Header, "You might also like", toast container, etc.
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $lang } from '../stores/langStore';
import ToastContainer from './Toast';
import { trackTool } from '../stores/recentStore';
import { allTools } from '../data/tools';

interface SuggestedTool {
  title: string;
  icon: string;
  href: string;
  color: string;
}

interface ToolPageShellProps {
  toolTitle: string;
  toolIcon: string;
  toolHref: string;
  toolColor: string;
  suggestions?: SuggestedTool[];
  children: React.ReactNode;
}

export default function ToolPageShell({ toolTitle, toolIcon, toolHref, toolColor, suggestions = [], children }: ToolPageShellProps) {
  const lang = useStore($lang);

  // Track this tool on mount
  useEffect(() => {
    trackTool({ title: toolTitle, href: toolHref, icon: toolIcon, color: toolColor });
  }, []);

  // Fetch localized strings from the global registry using the href
  const toolDef = allTools.find(t => t.href === toolHref);
  const displayTitle = lang === 'id' && toolDef?.titleId ? toolDef.titleId : toolTitle;
  const displayDesc = lang === 'id' && toolDef?.descriptionId ? toolDef.descriptionId : toolDef?.description || '';

  const tHome = lang === 'id' ? 'Beranda' : 'Home';
  const tSearch = lang === 'id' ? 'Cari' : 'Search';
  const tSuggestions = lang === 'id' ? '💡 Bos mungkin juga suka' : '💡 You might also like';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            {tHome}
          </a>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{displayTitle}</span>
        </nav>
      </div>

      {/* Reactive Localized Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', letterSpacing: '-0.02em' }}>
          <span style={{ color: toolColor }}>{toolIcon}</span> {displayTitle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          {displayDesc}
        </p>
      </div>

      {/* Tool Content */}
      {children}

      {/* Keyboard Shortcut Hint */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <kbd style={{ padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>⌘K</kbd>
          <span>{tSearch}</span>
        </div>
      </div>

      {/* You Might Also Like */}
      {suggestions.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{tSuggestions}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {suggestions.map((s) => {
              const sDef = allTools.find(t => t.href === s.href);
              const sTitle = lang === 'id' && sDef?.titleId ? sDef.titleId : s.title;
              return (
                <motion.a key={s.href} href={s.href} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem',
                    borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    textDecoration: 'none', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `color-mix(in srgb, ${s.color} 40%, transparent)`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: s.color, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{sTitle}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
                </motion.a>
              );
            })}
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
