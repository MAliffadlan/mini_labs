/**
 * ToolPageShell.tsx — Shared wrapper for tool pages
 * Provides: Breadcrumb, "You might also like" suggestions, toast container, and recent tracking
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ToastContainer from './Toast';
import { trackTool } from '../stores/recentStore';

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
  // Track this tool on mount
  useEffect(() => {
    trackTool({ title: toolTitle, href: toolHref, icon: toolIcon, color: toolColor });
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
           onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
           onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Home
        </a>
        <span style={{ color: 'var(--text-muted)' }}>›</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{toolTitle}</span>
      </nav>

      {/* Tool Content */}
      {children}

      {/* Keyboard Shortcut Hint */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <kbd style={{ padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>⌘K</kbd>
          <span>Search</span>
        </div>
      </div>

      {/* You Might Also Like */}
      {suggestions.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>💡 You might also like</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {suggestions.map(s => (
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
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{s.title}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
