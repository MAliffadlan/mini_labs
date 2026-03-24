/**
 * Navbar.tsx — Floating Pill Navbar (Responsive)
 * Desktop: Horizontal pill with links + search trigger
 * Mobile: Compact pill with hamburger menu + slide-down drawer
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $isCommandPaletteOpen } from '../stores/searchStore';
import { $lang } from '../stores/langStore';

interface NavbarProps {
  currentPath?: string;
  showSearch?: boolean;
}

export default function Navbar({ currentPath = '/', showSearch = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lang = useStore($lang);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [currentPath]);

  const navLinks = [
    { name: lang === 'id' ? 'Beranda' : 'Home', path: '/', icon: '🏠' },
    { name: lang === 'id' ? 'Kategori' : 'Categories', path: '/#tools-grid', icon: '📂' },
    { name: 'GitHub', path: 'https://github.com/MAliffadlan/mini_labs', icon: '🐙' }
  ];

  const tSearchDesktop = lang === 'id' ? 'Cari...' : 'Search...';
  const tSearchMobile = lang === 'id' ? 'Cari semua tool...' : 'Search all tools...';

  return (
    <div
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 1rem',
        marginBottom: isMobile ? '1.5rem' : '3rem',
        marginTop: isMobile ? '0.75rem' : '1.5rem',
      }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '0.75rem' : '2.5rem',
          padding: isMobile ? '0.5rem 0.75rem' : '0.625rem 1rem 0.625rem 1.25rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '100%' : undefined,
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#09090b', borderRadius: '50%' }}></div>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: isMobile ? '1rem' : '1.125rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Mini<span style={{ color: 'var(--text-secondary)', marginLeft: '2px' }}>Labs</span>
          </span>
        </a>

        {/* Desktop: Nav Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map((link) => {
              const isActive = currentPath === link.path && !link.path.startsWith('http');
              return (
                <a key={link.path} href={link.path} target={link.path.startsWith('http') ? '_blank' : undefined} rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ position: 'relative', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500, fontFamily: "'Inter', sans-serif", textDecoration: 'none', color: isActive ? '#ffffff' : 'var(--text-secondary)', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; const hl = e.currentTarget.querySelector('.nav-highlight') as HTMLElement; if (hl) hl.style.opacity = '1'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; const hl = e.currentTarget.querySelector('.nav-highlight') as HTMLElement; if (hl && !isActive) hl.style.opacity = '0'; }}
                >
                  <div className="nav-highlight" style={{ position: 'absolute', inset: 0, borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.08)', opacity: isActive ? 1 : 0, transition: 'opacity 0.2s ease', zIndex: -1 }} />
                  {link.name}
                  {link.path.startsWith('http') && (<span style={{ fontSize: '0.7rem', opacity: 0.7 }}>↗</span>)}
                </a>
              );
            })}
          </div>
        )}

        {/* Desktop: Search Trigger */}
        {!isMobile && showSearch && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => $isCommandPaletteOpen.set(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '9999px', padding: '0.4rem 0.5rem 0.4rem 0.875rem',
              cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span style={{ fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif" }}>{tSearchDesktop}</span>
            <kbd style={{ fontSize: '0.6875rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginLeft: '0.25rem' }}>⌘K</kbd>
          </motion.button>
        )}

        {/* Mobile: Search + Hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {/* Mobile Search Icon */}
            {showSearch && (
              <button
                onClick={() => $isCommandPaletteOpen.set(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                background: isMenuOpen ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.06)',
                border: isMenuOpen ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', color: isMenuOpen ? '#a78bfa' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMenuOpen ? '0' : '4px', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', position: 'relative' }}>
                <span style={{
                  display: 'block', width: '16px', height: '2px', borderRadius: '2px',
                  background: 'currentColor', transition: 'all 0.3s ease',
                  position: isMenuOpen ? 'absolute' : 'relative',
                  transform: isMenuOpen ? 'rotate(45deg)' : 'none',
                }} />
                <span style={{
                  display: 'block', width: '16px', height: '2px', borderRadius: '2px',
                  background: 'currentColor', transition: 'all 0.3s ease',
                  opacity: isMenuOpen ? 0 : 1,
                }} />
                <span style={{
                  display: 'block', width: '16px', height: '2px', borderRadius: '2px',
                  background: 'currentColor', transition: 'all 0.3s ease',
                  position: isMenuOpen ? 'absolute' : 'relative',
                  transform: isMenuOpen ? 'rotate(-45deg)' : 'none',
                }} />
              </div>
            </button>
          </div>
        )}
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              borderRadius: '20px',
              backgroundColor: 'rgba(24, 24, 27, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              transformOrigin: 'top center',
            }}
          >
            <div style={{ padding: '0.5rem' }}>
              {navLinks.map((link, i) => {
                const isActive = currentPath === link.path && !link.path.startsWith('http');
                return (
                  <motion.a
                    key={link.path}
                    href={link.path}
                    target={link.path.startsWith('http') ? '_blank' : undefined}
                    rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.875rem 1rem', borderRadius: '14px',
                      textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                    {link.name}
                    {isActive && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }} />}
                    {link.path.startsWith('http') && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.5 }}>↗</span>}
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile Search Row */}
            {showSearch && (
              <div style={{ padding: '0 0.5rem 0.5rem' }}>
                <button
                  onClick={() => { setIsMenuOpen(false); $isCommandPaletteOpen.set(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                    padding: '0.875rem 1rem', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9375rem',
                    fontFamily: "'Inter', sans-serif", fontWeight: 500, transition: 'all 0.2s',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  {tSearchMobile}
                  <kbd style={{ marginLeft: 'auto', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>⌘K</kbd>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
