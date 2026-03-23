/**
 * HexRgbConverter.tsx — Aesthetic Dual-mode Color string Converter
 */
import React, { useState, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex: string) {
  // Support both 3-digit and 6-digit hex
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export default function HexRgbConverter() {
  const [hexInput, setHexInput] = useAutoSave('hex-to-rgb-input', '#ec4899');
  const [rInput, setRInput] = useAutoSave('rgb-r-input', '236');
  const [gInput, setGInput] = useAutoSave('rgb-g-input', '72');
  const [bInput, setBInput] = useAutoSave('rgb-b-input', '153');

  const [hexOutput, setHexOutput] = useState('');
  const [rgbOutput, setRgbOutput] = useState('');

  // HEX to RGB logic
  useEffect(() => {
    const rgb = hexToRgb(hexInput.trim());
    if (rgb) {
      setRgbOutput(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    } else {
      setRgbOutput('Invalid HEX');
    }
  }, [hexInput]);

  // RGB to HEX logic
  useEffect(() => {
    const r = parseInt(rInput, 10);
    const g = parseInt(gInput, 10);
    const b = parseInt(bInput, 10);
    
    if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      setHexOutput(rgbToHex(r, g, b).toUpperCase());
    } else {
      setHexOutput('Invalid RGB');
    }
  }, [rInput, gInput, bInput]);

  const getInputStyle = (colorFocusStr: string) => ({
    width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', outline: 'none', transition: 'all 0.2s', textAlign: 'center' as const
  });

  return (
    <SplitView
      leftTitle="HEX to RGB"
      rightTitle="RGB to HEX"
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>HEX Code</label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#FFFFFF"
              spellCheck={false}
              style={{ ...getInputStyle('var(--accent-purple)'), textTransform: 'uppercase', fontWeight: 700 }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            />
          </div>

          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result (RGB)</span>
            <div style={{
              width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: rgbOutput !== 'Invalid HEX' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(244, 63, 94, 0.05)',
              border: `1px solid ${rgbOutput !== 'Invalid HEX' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
              color: rgbOutput !== 'Invalid HEX' ? 'var(--text-primary)' : 'var(--error)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '1.125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span>{rgbOutput}</span>
              {rgbOutput !== 'Invalid HEX' && <CopyButton text={rgbOutput} label="" />}
            </div>
            {/* Color Preview */}
            {rgbOutput !== 'Invalid HEX' && (
              <div style={{ width: '100%', height: '40px', borderRadius: '8px', backgroundColor: rgbOutput, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginTop: '0.5rem' }}></div>
            )}
          </div>

        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{ width: '100%', maxWidth: '340px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>R, G, B Channels</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number" min="0" max="255" value={rInput} onChange={(e) => setRInput(e.target.value)} placeholder="R"
                style={{ ...getInputStyle('#f87171'), color: '#fca5a5' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              />
              <input
                type="number" min="0" max="255" value={gInput} onChange={(e) => setGInput(e.target.value)} placeholder="G"
                style={{ ...getInputStyle('#4ade80'), color: '#86efac' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(74, 222, 128, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              />
              <input
                type="number" min="0" max="255" value={bInput} onChange={(e) => setBInput(e.target.value)} placeholder="B"
                style={{ ...getInputStyle('#60a5fa'), color: '#93c5fd' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(96, 165, 250, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              />
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result (HEX)</span>
            <div style={{
              width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: hexOutput !== 'Invalid RGB' ? 'rgba(56, 189, 248, 0.05)' : 'rgba(244, 63, 94, 0.05)',
              border: `1px solid ${hexOutput !== 'Invalid RGB' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
              color: hexOutput !== 'Invalid RGB' ? 'var(--text-primary)' : 'var(--error)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '1.125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 700 }}>{hexOutput}</span>
              {hexOutput !== 'Invalid RGB' && <CopyButton text={hexOutput} label="" />}
            </div>
            {/* Color Preview */}
            {hexOutput !== 'Invalid RGB' && (
              <div style={{ width: '100%', height: '40px', borderRadius: '8px', backgroundColor: hexOutput, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginTop: '0.5rem' }}></div>
            )}
          </div>

        </div>
      }
    />
  );
}
