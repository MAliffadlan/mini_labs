/**
 * ImageBase64.tsx — Image to Base64 & Base64 to Image
 */
import React, { useState, useRef } from 'react';
import CopyButton from '../../components/CopyButton';

export default function ImageBase64() {
  const [base64, setBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodedUrl, setDecodedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = () => {
    if (!decodeInput.trim()) return;
    let src = decodeInput.trim();
    if (!src.startsWith('data:')) src = 'data:image/png;base64,' + src;
    setDecodedUrl(src);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Encode Section */}
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>🖼️ Image → Base64</h2>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current?.click()}
          style={{ padding: '1rem 2rem', borderRadius: '14px', border: '2px dashed var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >📁 Click to upload image{fileName && ` — ${fileName}`}</button>

        {previewUrl && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '12px', border: '1px solid var(--border)', objectFit: 'contain' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base64 Output</span>
              <CopyButton text={base64} label="Copy" />
            </div>
            <textarea value={base64} readOnly style={{ width: '100%', height: '120px', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', resize: 'none' }} />
          </div>
        )}
      </div>

      {/* Decode Section */}
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>🔄 Base64 → Image</h2>
        <textarea value={decodeInput} onChange={e => setDecodeInput(e.target.value)} placeholder="Paste base64 string here..." spellCheck={false}
          style={{ width: '100%', height: '120px', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', resize: 'none', outline: 'none', transition: 'all 0.2s' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        />
        <button onClick={handleDecode}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '9999px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', color: '#fff', fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >Convert to Image</button>
        {decodedUrl && (
          <div style={{ marginTop: '1.5rem' }}>
            <img src={decodedUrl} alt="Decoded" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '12px', border: '1px solid var(--border)', objectFit: 'contain' }}
              onError={() => setDecodedUrl('')} />
          </div>
        )}
      </div>
    </div>
  );
}
