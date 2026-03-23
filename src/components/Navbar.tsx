/**
 * Navbar.tsx — Aesthetic Floating Pill Navbar (Ultra Premium)
 */
import React from 'react';

interface NavbarProps {
  currentPath?: string;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/#categories' },
  { name: 'GitHub', path: 'https://github.com/MAliffadlan/mini_labs' }
];

export default function Navbar({ currentPath = '/' }: NavbarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 1rem',
        marginBottom: '3rem', /* Spacing below the navbar */
        marginTop: '1.5rem'
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          padding: '0.625rem 1rem 0.625rem 1.25rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(24, 24, 27, 0.6)', /* zinc-900 with opacity */
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Aesthetic Minimal Logo */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
          }}
        >
          {/* Abstract Ring Logo */}
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
                backgroundColor: '#09090b', /* Match body background */
                borderRadius: '50%',
              }}
            ></div>
          </div>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '1.125rem',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Mini
            <span style={{ color: 'var(--text-secondary)', marginLeft: '2px' }}>Labs</span>
          </span>
        </a>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  const highlight = e.currentTarget.querySelector('.nav-highlight') as HTMLElement;
                  if (highlight) highlight.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                  const highlight = e.currentTarget.querySelector('.nav-highlight') as HTMLElement;
                  if (highlight && !isActive) highlight.style.opacity = '0';
                }}
              >
                {/* Pill background hover effect */}
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
        </div>
      </nav>
    </div>
  );
}
