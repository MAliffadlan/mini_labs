/**
 * TimestampConverter.tsx — Aesthetic UNIX time to Date converter
 */
import React, { useState, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

export default function TimestampConverter() {
  const [input, setInput] = useAutoSave('timestamp-input', Date.now().toString());
  const [parsedDate, setParsedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setParsedDate(null);
      return;
    }
    const val = input.trim();
    // If it's a number (UNIX ms or sec)
    if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      // Heuristic: if it's 10 digits, it's seconds. If 13ish, ms.
      if (val.length <= 10) {
        setParsedDate(new Date(num * 1000));
      } else {
        setParsedDate(new Date(num));
      }
    } else {
      // Try string parsing
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        setParsedDate(d);
      } else {
        setParsedDate(null);
      }
    }
  }, [input]);

  const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <CopyButton text={value} label="Copy" />
      </div>
      <div style={{
        padding: '0.875rem 1.25rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.9375rem',
        color: 'var(--text-primary)',
        wordBreak: 'break-all',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <SplitView
      leftTitle="Time Input"
      rightTitle="Converted Formats"
      leftActions={
        <button
          onClick={() => setInput(Date.now().toString())}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          Set to Now
        </button>
      }
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Enter a UNIX timestamp (seconds or milliseconds) or any valid date string (e.g., <code>2026-03-24T00:00:00Z</code>).
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter timestamp or date string..."
            spellCheck={false}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
          />
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', height: '100%', overflow: 'auto' }}>
          {parsedDate ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ResultRow label="UNIX Timestamp (Seconds)" value={Math.floor(parsedDate.getTime() / 1000).toString()} />
              <ResultRow label="UNIX Timestamp (Milliseconds)" value={parsedDate.getTime().toString()} />
              <ResultRow label="ISO 8601" value={parsedDate.toISOString()} />
              <ResultRow label="UTC String" value={parsedDate.toUTCString()} />
              <ResultRow label="Local String" value={parsedDate.toLocaleString()} />
            </div>
          ) : (
            <div style={{ 
              color: 'var(--error)', 
              fontSize: '0.875rem', 
              padding: '1rem 1.25rem', 
              backgroundColor: 'rgba(244, 63, 94, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(244,63,94,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500
            }}>
              <span>⚠</span> Invalid date format. Please check your input.
            </div>
          )}
        </div>
      }
    />
  );
}
