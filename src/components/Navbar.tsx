/**
 * Navbar.tsx — Premium glassmorphism navbar
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
        backgroundColor: 'rgba(9, 9, 11, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
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
          height: '64px',
        }}
      >
        {/* Animated Brand Logo */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
              position: 'relative',
            }}
          >
            <span style={{ position: 'relative', zIndex: 2, color: '#fff', fontWeight: 'bold' }}>⚗</span>
            {/* Glowing ring under icon */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 'inherit',
                background: 'inherit',
                filter: 'blur(8px)',
                opacity: 0.6,
                zIndex: 1,
              }}
            ></div>
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Mini Labs
          </span>
        </a>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
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
