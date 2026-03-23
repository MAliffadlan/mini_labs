/**
 * ColorPickerTool.tsx — Aesthetic Interactive Color Picker
 */
import React from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerTool() {
  const [color, setColor] = useAutoSave('color-picker-hex', '#8b5cf6');
  
  const rgb = hexToRgb(color) || { r: 139, g: 92, b: 246 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const ResultBlock = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <CopyButton text={value} label="Copy" />
      </div>
      <div style={{
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '1rem',
        color: 'var(--text-primary)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <SplitView
      leftTitle="Pick a Color"
      rightTitle="Color Values"
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Aesthetic Color Input Block */}
          <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', boxShadow: `0 15px 50px ${color}60`, transition: 'all 0.3s ease', cursor: 'crosshair', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: color, transition: 'background-color 0.1s ease' }}></div>
            {/* The invisible native color input covering the entire block */}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '200%', height: '200%', 
                opacity: 0, cursor: 'pointer', transform: 'translate(-25%, -25%)'
              }}
            />
          </div>

          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Click the circle above to open the native color picker.
          </p>

          <div style={{ width: '100%', maxWidth: '300px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>HEX Input</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', textAlign: 'center', fontWeight: 'bold', outline: 'none', transition: 'all 0.2s', textTransform: 'uppercase'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            />
          </div>
        </div>
      }
      rightContent={
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflow: 'auto' }}>
          <ResultBlock label="HEX" value={color.toUpperCase()} />
          <ResultBlock label="RGB" value={rgbString} />
          <ResultBlock label="HSL" value={hslString} />
        </div>
      }
    />
  );
}
