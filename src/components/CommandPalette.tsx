/**
 * CommandPalette.tsx — macOS Spotlight-style global search and navigation
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $isCommandPaletteOpen, $searchQuery } from '../stores/searchStore';
import { $lang } from '../stores/langStore';
import { allTools } from '../data/tools';
import { playPop } from '../utils/sounds';

export default function CommandPalette() {
  const isOpen = useStore($isCommandPaletteOpen);
  const query = useStore($searchQuery);
  const lang = useStore($lang);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Keyboard Shortcut Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        $isCommandPaletteOpen.set(!$isCommandPaletteOpen.get());
        if (!$isCommandPaletteOpen.get()) {
          $searchQuery.set('');
        }
      }
      
      if (e.key === 'Escape' && $isCommandPaletteOpen.get()) {
        $isCommandPaletteOpen.set(false);
        $searchQuery.set('');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    if (!query.trim()) return allTools;
    const q = query.toLowerCase();
    return allTools.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.titleId && t.titleId.toLowerCase().includes(q)) ||
      t.description.toLowerCase().includes(q) ||
      (t.descriptionId && t.descriptionId.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.categoryId && t.categoryId.toLowerCase().includes(q))
    );
  }, [query]);

  // Handle Navigation inside Palette
  useEffect(() => {
    const handleNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredTools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
      } else if (e.key === 'Enter' && filteredTools.length > 0) {
        e.preventDefault();
        playPop();
        window.location.href = filteredTools[selectedIndex].href;
      }
    };
    
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, filteredTools, selectedIndex]);

  const tPlaceholder = lang === 'id' ? 'Apa yang bos mau akses hari ini?' : 'What do you want to build?';
  const tNoResults = lang === 'id' ? `Tidak ada tool "${query}" ditemukan 😢` : `No tools found for "${query}" 😢`;
  const tNavigate = lang === 'id' ? 'pilih' : 'to navigate';
  const tSelect = lang === 'id' ? 'buka' : 'to select';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              $isCommandPaletteOpen.set(false);
              $searchQuery.set('');
            }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999,
            }}
          />

          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', justifyContent: 'center', paddingTop: '10vh',
            pointerEvents: 'none', zIndex: 10000,
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '100%', maxWidth: '640px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                overflow: 'hidden',
                pointerEvents: 'auto',
                display: 'flex', flexDirection: 'column',
                maxHeight: '70vh'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={tPlaceholder}
                  value={query}
                  onChange={(e) => {
                    $searchQuery.set(e.target.value);
                    setSelectedIndex(0); 
                  }}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: '1.25rem', fontFamily: "'Outfit', sans-serif",
                    marginLeft: '1rem', width: '100%'
                  }}
                />
                <kbd style={{ fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>ESC</kbd>
              </div>

              <div style={{ overflowY: 'auto', padding: '0.5rem', flex: 1, scrollBehavior: 'smooth' }}>
                {filteredTools.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                     {tNoResults}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {filteredTools.map((tool, idx) => {
                      const isSelected = idx === selectedIndex;
                      const title = lang === 'id' && tool.titleId ? tool.titleId : tool.title;
                      const desc = lang === 'id' && tool.descriptionId ? tool.descriptionId : tool.description;
                      
                      return (
                        <a
                          key={tool.href}
                          href={tool.href}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => {
                            $isCommandPaletteOpen.set(false);
                            playPop();
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '0.75rem 1rem', borderRadius: '10px',
                            backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                            textDecoration: 'none', transition: 'background-color 0.1s',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            backgroundColor: isSelected ? tool.color : 'rgba(255,255,255,0.05)',
                            color: isSelected ? '#fff' : tool.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', flexShrink: 0, transition: 'all 0.2s'
                          }}>
                            {tool.icon}
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.125rem' }}>
                              {title}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {desc}
                            </div>
                          </div>
                          {isSelected && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↑</kbd>
                  <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↓</kbd>
                  {tNavigate}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <kbd style={{ background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>↵</kbd>
                  {tSelect}
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
