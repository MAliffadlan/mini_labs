/**
 * Navbar.tsx — Floating Pill Navbar
 * Now integrates heavily with the global Command Palette
 */
import React from 'react';
import { motion } from 'framer-motion';
import { $isCommandPaletteOpen } from '../stores/searchStore';

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
  return (
    <div
      style={{
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 1rem',
        marginBottom: '3rem',
        marginTop: '1.5rem',
      }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          padding: '0.625rem 1rem 0.625rem 1.25rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#09090b', borderRadius: '50%' }}></div>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Mini<span style={{ color: 'var(--text-secondary)', marginLeft: '2px' }}>Labs</span>
          </span>
        </a>

        {/* Nav Links */}
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

        {/* Search Trigger Button */}
        {showSearch && (
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
            <span style={{ fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif" }}>Search...</span>
            <kbd style={{ fontSize: '0.6875rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginLeft: '0.25rem' }}>⌘K</kbd>
          </motion.button>
        )}
      </motion.nav>
    </div>
  );
}
