/**
 * FavoriteTools.tsx — Shows user's starred tools on the homepage
 */
import React from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $favorites } from '../stores/favoriteStore';

interface ToolDef {
  title: string;
  icon: string;
  href: string;
  color: string;
  category: string;
}

export default function FavoriteTools({ allTools }: { allTools: ToolDef[] }) {
  const favorites = useStore($favorites);
  
  if (favorites.length === 0) return null;

  const favoriteTools = favorites
    .map(href => allTools.find(t => t.href === href))
    .filter((t): t is ToolDef => t !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ marginBottom: '2rem' }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#eab308', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>⭐</span> Favorites
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        <AnimatePresence>
          {favoriteTools.map((tool, i) => (
            <motion.a
              key={tool.href}
              href={tool.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
                borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `color-mix(in srgb, ${tool.color} 50%, transparent)`;
                e.currentTarget.style.boxShadow = `0 8px 24px color-mix(in srgb, ${tool.color} 15%, transparent)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Subtle background glow */}
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${tool.color} 5%, transparent))`, pointerEvents: 'none' }} />
              
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: `color-mix(in srgb, ${tool.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: tool.color, flexShrink: 0 }}>
                {tool.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tool.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tool.category}</span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
