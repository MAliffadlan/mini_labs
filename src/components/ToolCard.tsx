/**
 * ToolCard.tsx — Clickable card for homepage tool grid
 */
import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export default function ToolCard({ title, description, icon, href, color }: ToolCardProps) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '10px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {/* Arrow indicator */}
      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.8125rem',
          color: color,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        Open tool →
      </div>
    </a>
  );
}
