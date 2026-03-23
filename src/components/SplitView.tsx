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
        gap: '1rem',
        height: 'calc(100vh - 140px)',
        minHeight: '400px',
      }}
      className="split-view"
    >
      {/* Left Panel (Input) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          overflow: 'hidden',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {leftTitle}
          </span>
          {leftActions && <div style={{ display: 'flex', gap: '0.5rem' }}>{leftActions}</div>}
        </div>
        {/* Panel Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>{leftContent}</div>
      </div>

      {/* Right Panel (Output) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          overflow: 'hidden',
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {rightTitle}
          </span>
          {rightActions && <div style={{ display: 'flex', gap: '0.5rem' }}>{rightActions}</div>}
        </div>
        {/* Panel Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>{rightContent}</div>
      </div>

      {/* Responsive styles via <style> tag */}
      <style>{`
        @media (max-width: 768px) {
          .split-view {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .split-view > div {
            min-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
