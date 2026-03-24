/**
 * LoremIpsum.tsx — Placeholder text generator
 */
import React, { useState, useMemo } from 'react';
import CopyButton from '../../components/CopyButton';
import { playPop } from '../../utils/sounds';

const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function generate(type: 'words' | 'sentences' | 'paragraphs', amount: number): string {
  if (amount <= 0) return '';
  
  const getWord = () => words[Math.floor(Math.random() * words.length)];
  
  const getSentence = () => {
    const len = Math.floor(Math.random() * 10) + 5;
    let s = Array.from({ length: len }, getWord).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };
  
  const getParagraph = () => {
    const len = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length: len }, getSentence).join(' ');
  };

  if (type === 'words') {
    let s = Array.from({ length: amount }, getWord).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  if (type === 'sentences') {
    return Array.from({ length: amount }, getSentence).join(' ');
  }
  return Array.from({ length: amount }, getParagraph).join('\n\n');
}

export default function LoremIpsum() {
  const [amount, setAmount] = useState(3);
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [text, setText] = useState(() => generate('paragraphs', 3));

  const handleGenerate = () => {
    playPop();
    const result = generate(type, Math.min(Math.max(1, amount), 1000));
    // Ensure "Lorem ipsum" starts the text if it's the standard paragraph approach
    if (result && type === 'paragraphs') {
      const parts = result.split(' ');
      parts[0] = 'Lorem'; parts[1] = 'ipsum'; parts[2] = 'dolor'; parts[3] = 'sit'; parts[4] = 'amet,';
      setText(parts.join(' '));
    } else {
      setText(result);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</label>
            <input type="number" min="1" max="1000" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-teal)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['words', 'sentences', 'paragraphs'] as const).map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{ flex: 1, padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: type === t ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-primary)', borderColor: type === t ? 'rgba(20, 184, 166, 0.4)' : 'var(--border)', color: type === t ? 'var(--accent-teal)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize' }}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleGenerate}
          style={{ width: '100%', padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--accent-teal)', color: '#fff', fontSize: '1rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(20, 184, 166, 0.3)'; }}
        >Generate</button>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Generated Text</span>
          <CopyButton text={text} label="Copy All" />
        </div>
        <textarea readOnly value={text} spellCheck={false}
          style={{ width: '100%', height: '400px', padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.8, outline: 'none', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}
