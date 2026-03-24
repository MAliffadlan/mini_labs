/**
 * JwtDecoder.tsx — Decode JSON Web Tokens
 */
import React from 'react';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useDragDrop } from '../../hooks/useDragDrop';

const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWYgRmFkbGFuIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  try { return atob(base64); } catch { return ''; }
}

function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch { return null; }
}

function formatExp(exp: number): string {
  const d = new Date(exp * 1000);
  const now = Date.now();
  const expired = d.getTime() < now;
  return `${d.toLocaleString()} ${expired ? '🔴 Expired' : '🟢 Valid'}`;
}

export default function JwtDecoder() {
  const [token, setToken] = useAutoSave('jwt-decoder-input', sampleJwt);
  const decoded = decodeJwt(token);


  const { isDragging, dragProps } = useDragDrop({ onDrop: setToken });

  const Section = ({ title, data, color }: { title: string; data: any; color: string }) => {
    const json = JSON.stringify(data, null, 2);
    return (
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
          <CopyButton text={json} label="Copy" />
        </div>
        <pre style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto' }}>
          {json}
        </pre>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Input */}
      <div {...dragProps} style={{ position: 'relative' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paste JWT Token</label>
        {isDragging && (
          <div style={{ position: 'absolute', inset: 0, top: '2rem', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(4px)', color: 'var(--accent-purple)', fontSize: '1.25rem', fontWeight: 600, borderRadius: '14px' }}>
            📥 Drop JWT text file
          </div>
        )}
        <textarea value={token} onChange={e => setToken(e.target.value)} placeholder="eyJhbGciOi... or drop a .txt file" spellCheck={false}
          style={{ width: '100%', height: '100px', padding: '1.25rem', borderRadius: '14px', backgroundColor: isDragging ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none', wordBreak: 'break-all', transition: 'all 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        />
      </div>

      {decoded ? (
        <>
          {/* Expiration check */}
          {decoded.payload.exp && (
            <div style={{ padding: '0.875rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <strong>Expiration:</strong> {formatExp(decoded.payload.exp)}
            </div>
          )}
          {/* Decoded sections */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Section title="Header" data={decoded.header} color="#3b82f6" />
            <Section title="Payload" data={decoded.payload} color="#8b5cf6" />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Signature</span>
            <div style={{ marginTop: '0.5rem', padding: '0.875rem 1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(244,63,94,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              {decoded.signature}
            </div>
          </div>
        </>
      ) : (
        token.trim() && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)', backgroundColor: 'rgba(244,63,94,0.05)', borderRadius: '14px', border: '1px solid rgba(244,63,94,0.15)' }}>
            ⚠ Invalid JWT format. Please enter a valid token (header.payload.signature)
          </div>
        )
      )}
    </div>
  );
}
