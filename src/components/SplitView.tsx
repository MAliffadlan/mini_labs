/**
 * SplitView.tsx — Two-panel responsive layout for input/output
 */
import React from 'react';

interface SplitViewProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export default function SplitView({
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
  leftActions,
  rightActions,
}: SplitViewProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.25rem',
        height: 'calc(100vh - 160px)',
        minHeight: '500px',
      }}
      className="split-view"
    >
      {/* Left Panel (Input) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {leftTitle}
          </span>
          {leftActions && <div style={{ display: 'flex', gap: '0.5rem' }}>{leftActions}</div>}
        </div>
        {/* Panel Content */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-primary)' }}>{leftContent}</div>
      </div>

      {/* Right Panel (Output) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {rightTitle}
          </span>
          {rightActions && <div style={{ display: 'flex', gap: '0.5rem' }}>{rightActions}</div>}
        </div>
        {/* Panel Content */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-primary)' }}>{rightContent}</div>
      </div>

      {/* Responsive styles via <style> tag */}
      <style>{`
        @media (max-width: 768px) {
          .split-view {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .split-view > div {
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
