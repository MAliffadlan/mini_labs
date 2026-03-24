/**
 * RecentTools.tsx — Shows recently used tools on homepage
 */
import React from 'react';
import { useStore } from '@nanostores/react';
import { motion, AnimatePresence } from 'framer-motion';
import { $recentTools } from '../stores/recentStore';

export default function RecentTools() {
  const recent = useStore($recentTools);

  if (recent.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ marginBottom: '3rem' }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🕐</span> Recently Used
      </h3>
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        <AnimatePresence>
          {recent.map((tool, i) => (
            <motion.a
              key={tool.href}
              href={tool.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `color-mix(in srgb, ${tool.color} 40%, transparent)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `color-mix(in srgb, ${tool.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: tool.color, flexShrink: 0 }}>
                {tool.icon}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tool.title}</span>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
