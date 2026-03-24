/**
 * QrGenerator.tsx — QR Code Generator with download
 */
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAutoSave } from '../../hooks/useAutoSave';

export default function QrGenerator() {
  const [text, setText] = useAutoSave('qr-gen-input', 'https://mini-labs-snowy.vercel.app');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) { setQrDataUrl(''); return; }
    QRCode.toDataURL(text, { width: 400, margin: 2, color: { dark: '#ffffffee', light: '#00000000' }, errorCorrectionLevel: 'H' })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [text]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto', alignItems: 'center' }}>
      {/* Input */}
      <div style={{ width: '100%' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enter URL or Text</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" spellCheck={false}
          style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', outline: 'none', transition: 'all 0.2s' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* QR Code Display */}
      {qrDataUrl ? (
        <div style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '16px' }}>
            <img src={qrDataUrl} alt="QR Code" style={{ width: '240px', height: '240px', display: 'block', filter: 'invert(1)' }} />
          </div>
          <button onClick={handleDownload}
            style={{ padding: '0.875rem 2rem', borderRadius: '9999px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', color: '#fff', fontSize: '0.9375rem', fontFamily: "'Outfit', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >⬇ Download PNG</button>
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📱</span>
          <p>Enter text or URL above to generate a QR code</p>
        </div>
      )}
    </div>
  );
}
