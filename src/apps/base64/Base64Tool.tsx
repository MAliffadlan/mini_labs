/**
 * Base64Tool.tsx — Base64 Encoder/Decoder
 * Features: encode/decode toggle, error handling, copy, auto-save
 */
import React, { useState, useCallback, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const [mode, setMode] = useAutoSave<Mode>('base64-mode', 'encode');
  const [input, setInput] = useAutoSave('base64-input', 'Hello, Mini Labs!');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Process input based on current mode
  const processInput = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        // Encode: supports Unicode via TextEncoder
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        const binaryStr = Array.from(bytes)
          .map((b) => String.fromCharCode(b))
          .join('');
        setOutput(btoa(binaryStr));
      } else {
        // Decode: supports Unicode via TextDecoder
        const binaryStr = atob(input.trim());
        const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
        const decoder = new TextDecoder();
        setOutput(decoder.decode(bytes));
      }
      setError('');
    } catch (e: any) {
      setOutput('');
      setError(
        mode === 'decode'
          ? 'Invalid Base64 string. Please check your input.'
          : `Encoding error: ${e.message}`
      );
    }
  }, [input, mode]);

  useEffect(() => {
    processInput();
  }, [processInput]);

  // Toggle mode button styles
  const getModeButtonStyle = (btnMode: Mode) => ({
    padding: '0.375rem 0.875rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: 600 as const,
    cursor: 'pointer' as const,
    transition: 'all 0.15s ease',
    backgroundColor: mode === btnMode ? 'var(--accent)' : 'transparent',
    color: mode === btnMode ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div>
      {/* Mode Toggle */}
      <div
        style={{
          display: 'inline-flex',
          padding: '4px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          marginBottom: '1rem',
        }}
      >
        <button style={getModeButtonStyle('encode')} onClick={() => setMode('encode')}>
          Encode
        </button>
        <button style={getModeButtonStyle('decode')} onClick={() => setMode('decode')}>
          Decode
        </button>
      </div>

      <SplitView
        leftTitle={mode === 'encode' ? 'Plain Text' : 'Base64 String'}
        rightTitle={mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
        leftActions={
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        }
        rightActions={<CopyButton text={output} />}
        leftContent={
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text to encode...'
                : 'Enter Base64 string to decode...'
            }
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              padding: '1rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: 'none',
              resize: 'none',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              outline: 'none',
            }}
          />
        }
        rightContent={
          <div style={{ height: '100%' }}>
            {error ? (
              <div style={{ padding: '1rem' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: 'var(--error)',
                    fontSize: '0.8125rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>⚠ Error: </span>
                  {error}
                </div>
              </div>
            ) : (
              <pre
                style={{
                  padding: '1rem',
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  height: '100%',
                  overflow: 'auto',
                }}
              >
                {output || (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {mode === 'encode' ? 'Encoded output' : 'Decoded text'} will appear here...
                  </span>
                )}
              </pre>
            )}
          </div>
        }
      />
    </div>
  );
}
