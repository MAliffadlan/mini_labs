import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// LSB Steganography: encode text into image pixel data
const MAGIC = 'STEG';
const END_MARKER = '\x00\x00\x00';

function textToBits(text: string): string {
  const encoded = MAGIC + text + END_MARKER;
  let bits = '';
  for (let i = 0; i < encoded.length; i++) {
    const byte = encoded.charCodeAt(i);
    bits += byte.toString(2).padStart(8, '0');
  }
  return bits;
}

function bitsToText(bits: string): string | null {
  let text = '';
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    if (byte.length < 8) break;
    text += String.fromCharCode(parseInt(byte, 2));
  }
  // Check magic header
  if (!text.startsWith(MAGIC)) return null;
  const content = text.slice(MAGIC.length);
  const endIdx = content.indexOf(END_MARKER);
  if (endIdx === -1) return content;
  return content.slice(0, endIdx);
}

function encodeMessage(canvas: HTMLCanvasElement, message: string): boolean {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const bits = textToBits(message);

  // Check capacity (we use 1 bit per color channel, skip alpha)
  const maxBits = Math.floor((data.length / 4) * 3);
  if (bits.length > maxBits) return false;

  let bitIdx = 0;
  for (let i = 0; i < data.length && bitIdx < bits.length; i++) {
    if (i % 4 === 3) continue; // Skip alpha channel
    data[i] = (data[i] & 0xFE) | parseInt(bits[bitIdx], 2);
    bitIdx++;
  }

  ctx.putImageData(imageData, 0, 0);
  return true;
}

function decodeMessage(canvas: HTMLCanvasElement): string | null {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let bits = '';
  for (let i = 0; i < data.length; i++) {
    if (i % 4 === 3) continue; // Skip alpha
    bits += (data[i] & 1).toString();
    // Check periodically to avoid unnecessary work
    if (bits.length % 8 === 0 && bits.length >= (MAGIC.length + END_MARKER.length) * 8) {
      const text = bitsToText(bits);
      if (text !== null && bits.length > (MAGIC.length + 10) * 8) {
        // Check if we found the end marker
        let decoded = '';
        for (let j = 0; j < bits.length; j += 8) {
          const byte = bits.slice(j, j + 8);
          if (byte.length < 8) break;
          decoded += String.fromCharCode(parseInt(byte, 2));
        }
        if (decoded.includes(END_MARKER)) {
          return text;
        }
      }
    }
  }
  return bitsToText(bits);
}

type Mode = 'encode' | 'decode';

export default function Steganography() {
  const [mode, setMode] = useState<Mode>('encode');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [decodedMsg, setDecodedMsg] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const loadImage = (file: File) => {
    setError('');
    setResultUrl(null);
    setDecodedMsg(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        setPreview(canvas.toDataURL('image/png'));

        // Auto-decode if in decode mode
        if (mode === 'decode') {
          const decoded = decodeMessage(canvas);
          if (decoded) {
            setDecodedMsg(decoded);
          } else {
            setError('No hidden message found in this image.');
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleEncode = () => {
    if (!preview || !message.trim()) {
      setError('Please upload an image and enter a message first.');
      return;
    }
    setError('');
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Redraw original image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const ok = encodeMessage(canvas, message);
      if (!ok) {
        setError(`Message too long! This image can hold ~${Math.floor((canvas.width * canvas.height * 3) / 8 - 10)} characters.`);
        return;
      }
      const url = canvas.toDataURL('image/png');
      setResultUrl(url);
      showToast('Message hidden successfully! Download the image.');
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `secret_${fileName.replace(/\.[^.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Secret image downloaded!');
  };

  const handleCopyDecoded = async () => {
    if (!decodedMsg) return;
    await navigator.clipboard.writeText(decodedMsg);
    showToast('Secret message copied!');
  };

  const maxChars = preview && canvasRef.current
    ? Math.floor((canvasRef.current.width * canvasRef.current.height * 3) / 8 - 20)
    : 0;

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        {([
          { key: 'encode' as Mode, icon: '🔒', label: 'Hide Message' },
          { key: 'decode' as Mode, icon: '🔓', label: 'Reveal Message' },
        ]).map(m => (
          <motion.button key={m.key} whileTap={{ scale: 0.97 }}
            onClick={() => { setMode(m.key); setPreview(null); setResultUrl(null); setDecodedMsg(null); setError(''); }}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '14px', border: 'none', cursor: 'pointer',
              fontSize: '0.9375rem', fontWeight: 700,
              background: mode === m.key ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.06)',
              color: mode === m.key ? '#fff' : 'var(--text-secondary)',
              boxShadow: mode === m.key ? '0 4px 20px rgba(139,92,246,0.3)' : 'none',
            }}
          >{m.icon} {m.label}</motion.button>
        ))}
      </div>

      {/* Drop Zone */}
      <motion.div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem 2rem',
          textAlign: 'center', cursor: 'pointer', marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden
          onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]); }}
        />
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{mode === 'encode' ? '🔒' : '🔓'}</div>
        <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem' }}>
          {mode === 'encode' ? 'Upload a carrier image' : 'Upload an image with a hidden message'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>PNG recommended for lossless encoding</p>
      </motion.div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {error && (
        <div style={{ padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Encode Mode */}
      {mode === 'encode' && preview && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original Image</p>
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={preview} alt="Original" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              </div>
            </div>
            {resultUrl && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔒 Image with Secret</p>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <img src={resultUrl} alt="Encoded" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Secret Message</label>
              <span style={{ color: message.length > maxChars ? '#ef4444' : 'var(--text-muted)', fontSize: '0.75rem' }}>
                {message.length} / {maxChars.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your secret message here..."
              rows={4}
              style={{
                width: '100%', padding: '1rem', borderRadius: '14px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                color: '#fff', fontSize: '0.9375rem', fontFamily: "'Inter', sans-serif",
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleEncode}
              style={{
                padding: '0.875rem 2rem', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              }}
            >🔒 Hide Message in Image</motion.button>

            {resultUrl && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                style={{
                  padding: '0.875rem 2rem', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                }}
              >💾 Download Secret Image</motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Decode Mode */}
      {mode === 'decode' && decodedMsg && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.08))',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#a78bfa', fontSize: '1rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>🔓 Hidden Message Revealed!</h3>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleCopyDecoded}
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >📋 Copy</motion.button>
          </div>
          <div style={{
            padding: '1.25rem', borderRadius: '14px', background: 'rgba(0,0,0,0.3)',
            color: '#fff', fontSize: '1rem', lineHeight: 1.7, fontFamily: "'Inter', sans-serif",
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {decodedMsg}
          </div>
        </motion.div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(139,92,246,0.9)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 8px 32px rgba(139,92,246,0.3)', zIndex: 50 }}
          >✓ {toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
