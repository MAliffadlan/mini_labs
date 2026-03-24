/**
 * CaseConverter.tsx — Multi-mode Text Case Converter
 */
import React from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

const conversions = [
  { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
  { label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: 'snake_case', fn: (s: string) => s.replace(/\s+/g, '_').replace(/[A-Z]/g, l => '_' + l.toLowerCase()).replace(/^_/, '').replace(/__+/g, '_').toLowerCase() },
  { label: 'kebab-case', fn: (s: string) => s.replace(/\s+/g, '-').replace(/[A-Z]/g, l => '-' + l.toLowerCase()).replace(/^-/, '').replace(/--+/g, '-').toLowerCase() },
  { label: 'CONSTANT_CASE', fn: (s: string) => s.replace(/\s+/g, '_').replace(/[A-Z]/g, l => '_' + l).replace(/^_/, '').replace(/__+/g, '_').toUpperCase() },
];

export default function CaseConverter() {
  const [text, setText] = useAutoSave('case-converter-input', 'Hello World Example');

  return (
    <SplitView
      leftTitle="Input Text"
      rightTitle="Converted Results"
      leftActions={
        <button onClick={() => setText('')}
          style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--error)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >Clear</button>
      }
      leftContent={
        <div style={{ padding: '1.5rem', height: '100%' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type your text here..." spellCheck={false}
            style={{ width: '100%', height: '100%', minHeight: '400px', padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.6, outline: 'none', resize: 'none', transition: 'all 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'auto', height: '100%' }}>
          {conversions.map(c => (
            <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</span>
                <CopyButton text={c.fn(text)} label="Copy" />
              </div>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {c.fn(text) || '—'}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
