/**
 * JsonCsv.tsx — JSON to CSV Converter
 */
import React, { useState } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

function jsonToCsv(json: any[]): string {
  if (!Array.isArray(json) || json.length === 0) return '';
  const headers = Object.keys(json[0]);
  const rows = json.map(obj =>
    headers.map(h => { const v = obj[h]; return typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v ?? ''); }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

const sampleJson = `[
  { "name": "Alice", "age": 30, "city": "Jakarta" },
  { "name": "Bob", "age": 25, "city": "Bandung" },
  { "name": "Charlie", "age": 35, "city": "Surabaya" }
]`;

export default function JsonCsv() {
  const [input, setInput] = useAutoSave('json-csv-input', sampleJson);
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) { setError('JSON must be an array of objects'); setCsv(''); return; }
      setCsv(jsonToCsv(parsed));
      setError('');
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setCsv('');
    }
  };

  // Convert on mount
  React.useEffect(() => { convert(); }, []);

  const handleDownload = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
  };

  return (
    <SplitView
      leftTitle="JSON Input"
      rightTitle="CSV Output"
      leftActions={
        <button onClick={convert}
          style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >Convert</button>
      }
      rightActions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {csv && <CopyButton text={csv} label="Copy" />}
          {csv && <button onClick={handleDownload}
            style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >⬇ .csv</button>}
        </div>
      }
      leftContent={
        <div style={{ padding: '1.5rem', height: '100%' }}>
          <textarea value={input} onChange={e => { setInput(e.target.value); }} placeholder='[{"key": "value"}]' spellCheck={false}
            style={{ width: '100%', height: '100%', minHeight: '400px', padding: '1.25rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          />
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', height: '100%', overflow: 'auto' }}>
          {error ? (
            <div style={{ color: 'var(--error)', fontSize: '0.875rem', padding: '1rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)' }}>⚠ {error}</div>
          ) : (
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{csv || 'Click "Convert" to generate CSV'}</pre>
          )}
        </div>
      }
    />
  );
}
