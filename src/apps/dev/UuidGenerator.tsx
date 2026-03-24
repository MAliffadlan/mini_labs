/**
 * UuidGenerator.tsx — Bulk UUID v4 Generator
 */
import React, { useState } from 'react';
import CopyButton from '../../components/CopyButton';
import { playPop } from '../../utils/sounds';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuid = () => {
    // Generate v4 UUID
    let uuid = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

    if (!hyphens) uuid = uuid.replace(/-/g, '');
    if (uppercase) uuid = uuid.toUpperCase();
    return uuid;
  };

  const handleGenerate = () => {
    playPop();
    const newUuids = Array.from({ length: Math.min(Math.max(1, count), 10000) }, generateUuid);
    setUuids(newUuids);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Controls */}
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How many?</label>
            <input type="number" min="1" max="10000" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} style={{ accentColor: 'var(--accent-purple)', width: '1.25rem', height: '1.25rem' }} />
              Uppercase (A-F)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} style={{ accentColor: 'var(--accent-purple)', width: '1.25rem', height: '1.25rem' }} />
              Include Hyphens (-)
            </label>
          </div>
        </div>
        <button onClick={handleGenerate}
          style={{ width: '100%', padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--accent-purple)', color: '#fff', fontSize: '1rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.3)'; }}
        >Generate {count.toLocaleString()} UUIDs</button>
      </div>

      {/* Output */}
      {uuids.length > 0 && (
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Generated UUIDs</span>
            <CopyButton text={uuids.join('\n')} label={`Copy All (${uuids.length})`} />
          </div>
          <textarea readOnly value={uuids.join('\n')} spellCheck={false}
            style={{ width: '100%', height: '400px', padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'vertical' }}
          />
        </div>
      )}
    </div>
  );
}
