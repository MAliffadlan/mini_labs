/**
 * Navbar.tsx — Floating Pill Navbar with iOS 26-style Expanding Search
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $searchQuery } from '../stores/searchStore';

interface NavbarProps {
  currentPath?: string;
  showSearch?: boolean;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/#tools-grid' },
  { name: 'GitHub', path: 'https://github.com/MAliffadlan/mini_labs' }
];

export default function Navbar({ currentPath = '/', showSearch = false }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const query = useStore($searchQuery);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        $searchQuery.set('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <div
      style={{
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem',
        marginBottom: '3rem',
        marginTop: '1.5rem'
      }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isSearchOpen ? '0.75rem' : '2.5rem',
          padding: '0.625rem 1rem 0.625rem 1.25rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Logo — always visible */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#09090b',
                borderRadius: '50%',
              }}
            ></div>
          </div>

          <AnimatePresence>
            {!isSearchOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                Mini
                <span style={{ color: 'var(--text-secondary)', marginLeft: '2px' }}>Labs</span>
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        {/* Nav Links — hidden when search is open */}
        <AnimatePresence>
          {!isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {navLinks.map((link) => {
                const isActive = currentPath === link.path && !link.path.startsWith('http');
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    target={link.path.startsWith('http') ? '_blank' : undefined}
                    rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      position: 'relative',
                      padding: '0.4rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: 'none',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      const hl = e.currentTarget.querySelector('.nav-highlight') as HTMLElement;
                      if (hl) hl.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                      const hl = e.currentTarget.querySelector('.nav-highlight') as HTMLElement;
                      if (hl && !isActive) hl.style.opacity = '0';
                    }}
                  >
                    <div
                      className="nav-highlight"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                        zIndex: -1,
                      }}
                    />
                    {link.name}
                    {link.path.startsWith('http') && (
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>↗</span>
                    )}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* iOS 26 style Search — expands when clicked */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-expanded"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '340px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Search Icon inside the expanded bar */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => $searchQuery.set(e.target.value)}
                placeholder="Search tools..."
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  minWidth: 0,
                }}
              />
              {/* Clear / Close button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  $searchQuery.set('');
                  setIsSearchOpen(false);
                }}
                style={{
                  flexShrink: 0,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </motion.button>
            </motion.div>
          ) : (
            showSearch && (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                style={{
                  flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </motion.button>
            )
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
