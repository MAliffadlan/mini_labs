/**
 * WordCounter.tsx — Aesthetic Real-time Text Analyzer
 */
import React, { useState, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import { useAutoSave } from '../../hooks/useAutoSave';


export default function WordCounter() {
  const [text, setText] = useAutoSave('word-counter-input', '');
  const [stats, setStats] = useState({ words: 0, characters: 0, charactersNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0 });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+(?=\s|$)/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(words / 200); // avg 200 words per minute

    setStats({ words, characters, charactersNoSpaces, sentences, paragraphs, readingTime });
  }, [text]);

  const StatBox = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div style={{
      padding: '1.25rem',
      backgroundColor: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );

  return (
    <SplitView
      leftTitle="Text Input"
      rightTitle="Analysis Metrics"
      leftActions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setText('')}
            style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--error)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'; e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            Clear Text
          </button>
        </div>
      }
      leftContent={
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to begin analysis..."
            spellCheck={false}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '400px',
              padding: '1.25rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
          />
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
            <StatBox label="Words" value={stats.words} color="#3b82f6" />
            <StatBox label="Characters" value={stats.characters} color="#10b981" />
            <StatBox label="Chars (No Space)" value={stats.charactersNoSpaces} color="#8b5cf6" />
            <StatBox label="Sentences" value={stats.sentences} color="#f59e0b" />
            <StatBox label="Paragraphs" value={stats.paragraphs} color="#ec4899" />
            <StatBox label="Reading Time" value={`${stats.readingTime} min`} color="#06b6d4" />
          </div>
          
          <div style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>SEO & Writing Insight</h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {stats.words === 0 ? "Start typing to generate insights." : 
               stats.words < 300 ? "Your text is quite short. If this is a blog post, aim for at least 300 words for better SEO." :
               stats.sentences > 0 && (stats.words / stats.sentences) > 20 ? "Your sentences are quite long on average. Consider breaking them down for better readability." :
               "Great length and structure! Your text looks highly readable."}
            </p>
          </div>
        </div>
      }
    />
  );
}
