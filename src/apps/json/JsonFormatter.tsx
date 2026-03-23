/**
 * JsonFormatter.tsx — JSON Formatter tool with Monaco Editor
 * Features: format/validate JSON, error display, copy, auto-save
 */
import React, { useState, useCallback, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

const SAMPLE_JSON = `{
  "name": "Mini Labs",
  "version": "1.0.0",
  "tools": ["json", "base64", "regex"],
  "config": {
    "theme": "dark",
    "language": "en"
  }
}`;

export default function JsonFormatter() {
  const [input, setInput] = useAutoSave('json-input', SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  // Format JSON whenever input or indent changes
  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError('');
    } catch (e: any) {
      setOutput('');
      setError(e.message || 'Invalid JSON');
    }
  }, [input, indentSize]);

  useEffect(() => {
    formatJson();
  }, [formatJson]);

  // Minify JSON
  const minifyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
      // Do nothing if invalid
    }
  }, [input, setInput]);

  return (
    <SplitView
      leftTitle="Input"
      rightTitle="Output"
      leftActions={
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Indent size selector */}
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
          <button
            onClick={minifyJson}
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
            Minify
          </button>
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
        </div>
      }
      rightActions={<CopyButton text={output} />}
      leftContent={
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
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
        <div style={{ height: '100%', position: 'relative' }}>
          {error ? (
            /* Error Display */
            <div
              style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
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
            /* Formatted Output */
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
                  Formatted JSON will appear here...
                </span>
              )}
            </pre>
          )}
        </div>
      }
    />
  );
}
