/**
 * UrlEncoder.tsx — URL Encoder/Decoder
 */
import React from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

export default function UrlEncoder() {
  const [input, setInput] = useAutoSave('url-encoder-input', 'https://example.com/path?name=hello world&lang=en');

  let encoded = '', decoded = '', encodeErr = '', decodeErr = '';
  try { encoded = encodeURIComponent(input); } catch { encodeErr = 'Invalid input for encoding'; }
  try { decoded = decodeURIComponent(input); } catch { decodeErr = 'Invalid encoded string'; }

  return (
    <SplitView
      leftTitle="Input"
      rightTitle="Results"
      leftActions={
        <button onClick={() => setInput('')}
          style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--error)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >Clear</button>
      }
      leftContent={
        <div style={{ padding: '1.5rem', height: '100%' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter URL or encoded string..." spellCheck={false}
            style={{ width: '100%', height: '100%', minHeight: '300px', padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9375rem', lineHeight: 1.6, outline: 'none', resize: 'none', transition: 'all 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflow: 'auto', height: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encoded</span>
              {!encodeErr && <CopyButton text={encoded} label="Copy" />}
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: encodeErr ? 'var(--error)' : 'var(--text-primary)', wordBreak: 'break-all' }}>
              {encodeErr || encoded || '—'}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decoded</span>
              {!decodeErr && <CopyButton text={decoded} label="Copy" />}
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: decodeErr ? 'var(--error)' : 'var(--text-primary)', wordBreak: 'break-all' }}>
              {decodeErr || decoded || '—'}
            </div>
          </div>
        </div>
      }
    />
  );
}
