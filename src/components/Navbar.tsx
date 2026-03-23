/**
 * Navbar.tsx — Sticky navigation bar with logo and links
 */
import React from 'react';

interface NavbarProps {
  currentPath?: string;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/#categories' },
];

export default function Navbar({ currentPath = '/' }: NavbarProps) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
        }}
      >
        {/* Logo / Brand */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            ⚗
          </span>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.025em' }}>
            Mini Labs
          </span>
        </a>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
