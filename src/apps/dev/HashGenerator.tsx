/**
 * HashGenerator.tsx — Text & File Hash/Checksum Generator
 */
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import CopyButton from '../../components/CopyButton';
import { useDragDrop } from '../../hooks/useDragDrop';

const algos = ['MD5', 'SHA1', 'SHA256', 'SHA512'] as const;
type Algo = typeof algos[number];

export default function HashGenerator() {
  const [input, setInput] = useState('Hello world!');
  const [fileDetails, setFileDetails] = useState<{name: string, size: number} | null>(null);
  const [hashes, setHashes] = useState<Record<Algo, string>>({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });

  const { isDragging, dragProps } = useDragDrop({
    onDrop: (text, file) => {
      setInput(text);
      setFileDetails({ name: file.name, size: file.size });
    }
  });

  useEffect(() => {
    import('../../utils/shareLink').then(({ getShareDataFromUrl }) => {
      const dbUrl = getShareDataFromUrl();
      if (dbUrl) setInput(dbUrl);
    });
  }, []);

  useEffect(() => {
    import('../../stores/shareStore').then(({ setShareData }) => setShareData(input));
  }, [input]);

  useEffect(() => {
    try {
      setHashes({
        MD5: CryptoJS.MD5(input).toString(CryptoJS.enc.Hex),
        SHA1: CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex),
        SHA256: CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex),
        SHA512: CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex),
      });
    } catch {
      setHashes({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });
    }
  }, [input]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Input / Dropzone */}
      <div 
        {...dragProps}
        style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', border: `2px dashed ${isDragging ? 'var(--accent-teal)' : 'var(--border)'}`, transition: 'all 0.2s', backgroundColor: isDragging ? 'rgba(20, 184, 166, 0.05)' : 'var(--bg-card)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {fileDetails ? `📄 ${fileDetails.name} (${(fileDetails.size / 1024).toFixed(1)} KB)` : 'Input Text'}
          </span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isDragging ? 'Drop it!' : 'Drag a text file here'}</span>
            <button onClick={() => { setInput(''); setFileDetails(null); }} style={{ fontSize: '0.75rem', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setFileDetails(null); }}
          placeholder="Paste text or drag a text file here to generate hashes..."
          spellCheck={false}
          style={{ width: '100%', height: '200px', padding: '1.5rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'vertical' }}
        />
        {isDragging && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(4px)', color: 'var(--accent-teal)', fontSize: '1.5rem', fontWeight: 600 }}>
            📥 Drop file to hash
          </div>
        )}
      </div>

      {/* Hashes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {algos.map(algo => (
          <div key={algo} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
               onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ width: '80px', flexShrink: 0 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-teal)' }}>{algo}</span>
            </div>
            <div style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              {hashes[algo] || '-'}
            </div>
            <CopyButton text={hashes[algo]} label="Copy" />
          </div>
        ))}
      </div>
    </div>
  );
}
