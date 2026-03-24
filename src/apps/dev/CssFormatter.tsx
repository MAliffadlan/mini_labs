/**
 * CssFormatter.tsx — Format and Minify CSS
 */
import React, { useState } from 'react';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';
import { playPop } from '../../utils/sounds';

const defaultCss = `body {
  margin: 0;
    padding: 0;   
background-color: #fff;
}
.card { border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
display: flex;justify-content:center;
}
`;

function formatCss(css: string): string {
  // A simple standard regex-based formatter for demonstration
  // Strips extra spaces, then re-adds them
  let formatted = css
    .replace(/\s+/g, ' ')
    .replace(/ { /g, ' {\n  ')
    .replace(/ {/g, ' {\n  ')
    .replace(/ }/g, '\n}\n')
    .replace(/}/g, '\n}\n')
    .replace(/;/g, ';\n  ')
    .replace(/;\n  \n/g, ';\n')
    .replace(/\n  }/g, '\n}')
    .trim();
  
  // Clean up multiple newlines
  return formatted.replace(/\n{3,}/g, '\n\n');
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ')             // collapse whitespace
    .replace(/ {\s+/g, '{')           // remove space inside {
    .replace(/\s+}/g, '}')            // remove space inside }
    .replace(/;\s+/g, ';')            // remove space around ;
    .replace(/:\s+/g, ':')            // remove space around :
    .trim();
}

export default function CssFormatter() {
  const [input, setInput] = useAutoSave('css-formatter-input', defaultCss);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const processCss = () => {
    playPop();
    setOutput(mode === 'format' ? formatCss(input) : minifyCss(input));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.25rem' }}>
          <button 
            onClick={() => { setMode('format'); setOutput(''); }}
            style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: mode === 'format' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: mode === 'format' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >Format (Beautify)</button>
          <button 
            onClick={() => { setMode('minify'); setOutput(''); }}
            style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: mode === 'minify' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: mode === 'minify' ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >Minify / Compress</button>
        </div>
        <button onClick={processCss}
          style={{ padding: '0.875rem 2rem', borderRadius: '12px', backgroundColor: 'var(--accent-blue)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >Run</button>
      </div>

      <div className="split-view-container" style={{ display: 'flex', gap: '1rem', minHeight: '500px' }}>
        {/* Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input CSS</span>
            <button onClick={() => { setInput(''); setOutput(''); }} style={{ fontSize: '0.75rem', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            style={{ flex: 1, width: '100%', padding: '1.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
          />
        </div>

        {/* Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output</span>
            <CopyButton text={output} label="Copy Output" />
          </div>
          <textarea
            readOnly
            value={output}
            spellCheck={false}
            placeholder={mode === 'format' ? 'Formatted CSS will appear here...' : 'Minified CSS will appear here...'}
            style={{ flex: 1, width: '100%', padding: '1.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
