/**
 * PasswordGenerator.tsx — Secure Password Generator
 */
import React, { useState, useCallback } from 'react';
import CopyButton from '../../components/CopyButton';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword('Select at least one option'); return; }
    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) result += chars[array[i] % chars.length];
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  // Generate on first render
  React.useEffect(() => { generate(); }, []);

  const getStrength = () => {
    if (length >= 20 && uppercase && lowercase && numbers && symbols) return { label: 'Very Strong', color: '#10b981' };
    if (length >= 12 && [uppercase, lowercase, numbers, symbols].filter(Boolean).length >= 3) return { label: 'Strong', color: '#3b82f6' };
    if (length >= 8) return { label: 'Medium', color: '#eab308' };
    return { label: 'Weak', color: '#f43f5e' };
  };
  const strength = getStrength();

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: checked ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)', borderColor: checked ? 'rgba(139, 92, 246, 0.3)' : 'var(--border)', transition: 'all 0.2s' }}>
      <div style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: checked ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
        onClick={() => onChange(!checked)}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: checked ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
    </label>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      {/* Password Display */}
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}><CopyButton text={password} label="Copy" /></div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.6, letterSpacing: '0.05em' }}>{password}</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: strength.color, boxShadow: `0 0 8px ${strength.color}` }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: strength.color }}>{strength.label}</span>
        </div>
      </div>

      {/* Length Slider */}
      <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password Length</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{length}</span>
        </div>
        <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
      </div>

      {/* Toggles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Toggle label="Uppercase (A-Z)" checked={uppercase} onChange={setUppercase} />
        <Toggle label="Lowercase (a-z)" checked={lowercase} onChange={setLowercase} />
        <Toggle label="Numbers (0-9)" checked={numbers} onChange={setNumbers} />
        <Toggle label="Symbols (!@#)" checked={symbols} onChange={setSymbols} />
      </div>

      {/* Generate Button */}
      <button onClick={generate} style={{ padding: '1rem 2rem', borderRadius: '9999px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', color: '#fff', fontSize: '1.0625rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s', letterSpacing: '0.02em' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.6)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)'; }}
      >🔐 Generate Password</button>
    </div>
  );
}
