/**
 * ToolPageShell.tsx — Shared wrapper for tool pages
 * Provides: Breadcrumb, "You might also like" suggestions, toast container, and recent tracking
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import ToastContainer from './Toast';
import ShareButton from './ShareButton';
import { trackTool } from '../stores/recentStore';
import { $favorites, toggleFavorite, isFavorite } from '../stores/favoriteStore';
import { showToast } from '../stores/toastStore';
import { playPop } from '../utils/sounds';

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
  supportShare?: boolean;
}

function FavoriteButton({ toolHref, toolTitle }: { toolHref: string, toolTitle: string }) {
  const favorites = useStore($favorites);
  const starred = favorites.includes(toolHref);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        const isNowStarred = toggleFavorite(toolHref);
        playPop();
        showToast(isNowStarred ? `Added to Favorites ⭐` : `Removed from Favorites`, isNowStarred ? '⭐' : '🗑️');
      }}
      style={{
        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
        backgroundColor: starred ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.03)',
        color: starred ? '#eab308' : 'var(--text-muted)',
        fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!starred) e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = starred ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.08)'; }}
      onMouseLeave={e => { if (!starred) e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = starred ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255,255,255,0.03)'; }}
    >
      {starred ? '⭐' : '☆'}
    </motion.button>
  );
}

export default function ToolPageShell({ toolTitle, toolIcon, toolHref, toolColor, suggestions = [], children, supportShare }: ToolPageShellProps) {
  // Track this tool on mount
  useEffect(() => {
    trackTool({ title: toolTitle, href: toolHref, icon: toolIcon, color: toolColor });
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            Home
          </a>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{toolTitle}</span>
        </nav>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {supportShare && <ShareButton toolPath={toolHref} getData={() => { const { $shareData } = require('../stores/shareStore'); return $shareData.get(); }} />}
          <FavoriteButton toolHref={toolHref} toolTitle={toolTitle} />
        </div>
      </div>

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
