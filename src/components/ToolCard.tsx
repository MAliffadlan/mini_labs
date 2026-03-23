/**
 * ToolCard.tsx — Premium animated glassmorphic card for homepage grid
 */
import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  glowColor?: string;
}

export default function ToolCard({ title, description, icon, href, color, glowColor = 'rgba(255,255,255,0.1)' }: ToolCardProps) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '1.75rem',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = color;
        el.style.transform = 'translateY(-6px) scale(1.02)';
        el.style.boxShadow = `0 20px 40px -10px ${glowColor}`;
        el.style.backgroundColor = 'var(--bg-elevated)';
        
        // Icon animation
        const iconDiv = el.querySelector('.tool-icon') as HTMLElement;
        if (iconDiv) {
          iconDiv.style.transform = 'scale(1.1)';
          iconDiv.style.boxShadow = `0 0 20px ${glowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0) scale(1)';
        el.style.boxShadow = 'none';
        el.style.backgroundColor = 'var(--bg-card)';
        
        // Icon animation
        const iconDiv = el.querySelector('.tool-icon') as HTMLElement;
        if (iconDiv) {
          iconDiv.style.transform = 'scale(1)';
          iconDiv.style.boxShadow = 'none';
        }
      }}
    >
      {/* Icon */}
      <div
        className="tool-icon"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          color: color,
          marginBottom: '1.25rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.375rem',
          fontWeight: 700,
          marginBottom: '0.625rem',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Arrow indicator (styled like a mini button) */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '0.375rem 0.875rem',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          transition: 'background-color 0.2s',
        }}
      >
        Open tool <span style={{ color: color }}>→</span>
      </div>
    </a>
  );
}
