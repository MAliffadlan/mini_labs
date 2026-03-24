/**
 * TextDiff.tsx — Side-by-side Text Diff Checker
 */
import React, { useMemo } from 'react';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useDragDrop } from '../../hooks/useDragDrop';

function computeDiff(a: string, b: string): { left: {text: string; type: string}[]; right: {text: string; type: string}[] } {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const maxLen = Math.max(linesA.length, linesB.length);
  const left: {text: string; type: string}[] = [];
  const right: {text: string; type: string}[] = [];

  for (let i = 0; i < maxLen; i++) {
    const lineA = i < linesA.length ? linesA[i] : undefined;
    const lineB = i < linesB.length ? linesB[i] : undefined;

    if (lineA === lineB) {
      left.push({ text: lineA || '', type: 'same' });
      right.push({ text: lineB || '', type: 'same' });
    } else {
      left.push({ text: lineA ?? '', type: lineA !== undefined ? 'removed' : 'empty' });
      right.push({ text: lineB ?? '', type: lineB !== undefined ? 'added' : 'empty' });
    }
  }
  return { left, right };
}

const sampleA = `function greet(name) {
  console.log("Hello " + name);
  return true;
}`;

const sampleB = `function greet(name, age) {
  console.log("Hello " + name);
  console.log("Age: " + age);
  return true;
}`;

export default function TextDiff() {
  const [textA, setTextA] = useAutoSave('text-diff-a', sampleA);
  const [textB, setTextB] = useAutoSave('text-diff-b', sampleB);

  const { isDragging: isDraggingA, dragProps: dragPropsA } = useDragDrop({ onDrop: setTextA });
  const { isDragging: isDraggingB, dragProps: dragPropsB } = useDragDrop({ onDrop: setTextB });

  const diff = useMemo(() => computeDiff(textA, textB), [textA, textB]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, changed = 0;
    diff.left.forEach((l, i) => {
      if (l.type === 'removed' && diff.right[i].type === 'added') changed++;
      else if (l.type === 'removed') removed++;
    });
    diff.right.forEach((r, i) => {
      if (r.type === 'added' && diff.left[i].type !== 'removed') added++;
    });
    return { added, removed, changed };
  }, [diff]);

  const bgColors: Record<string, string> = {
    added: 'rgba(16, 185, 129, 0.1)',
    removed: 'rgba(244, 63, 94, 0.1)',
    same: 'transparent',
    empty: 'rgba(255,255,255,0.02)',
  };
  const borderColors: Record<string, string> = {
    added: 'rgba(16, 185, 129, 0.3)',
    removed: 'rgba(244, 63, 94, 0.3)',
    same: 'transparent',
    empty: 'transparent',
  };
  const textColors: Record<string, string> = {
    added: '#10b981', removed: '#f43f5e', same: 'var(--text-primary)', empty: 'var(--text-muted)',
  };

  const DiffLine = ({ line, lineNum }: { line: { text: string; type: string }; lineNum: number }) => (
    <div style={{ display: 'flex', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.75', backgroundColor: bgColors[line.type], borderLeft: `3px solid ${borderColors[line.type]}` }}>
      <span style={{ width: '2.5rem', textAlign: 'right', paddingRight: '0.75rem', color: 'var(--text-muted)', fontSize: '0.6875rem', userSelect: 'none', flexShrink: 0, lineHeight: '1.75' }}>{lineNum}</span>
      <span style={{ color: textColors[line.type], padding: '0 0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', flex: 1 }}>
        {line.type === 'added' && '+ '}{line.type === 'removed' && '- '}{line.text}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>+{stats.added + stats.changed} added</span>
        <span style={{ fontSize: '0.875rem', color: '#f43f5e', fontWeight: 600 }}>-{stats.removed + stats.changed} removed</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{diff.left.filter(l => l.type === 'same').length} unchanged</span>
      </div>

      {/* Input areas */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div {...dragPropsA} style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original</span>
            <button onClick={() => setTextA('')} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          {isDraggingA && (
            <div style={{ position: 'absolute', inset: 0, top: '2rem', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(4px)', color: '#f43f5e', fontSize: '1.25rem', fontWeight: 600, borderRadius: '12px' }}>
              📥 Drop text file
            </div>
          )}
          <textarea value={textA} onChange={e => setTextA(e.target.value)} spellCheck={false} placeholder="Paste original text or drop .txt file"
            style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: '12px', backgroundColor: isDraggingA ? 'rgba(244, 63, 94, 0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'vertical', transition: 'background-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = '#f43f5e'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
        </div>
        <div {...dragPropsB} style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modified</span>
            <button onClick={() => setTextB('')} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          {isDraggingB && (
            <div style={{ position: 'absolute', inset: 0, top: '2rem', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(4px)', color: '#10b981', fontSize: '1.25rem', fontWeight: 600, borderRadius: '12px' }}>
              📥 Drop text file
            </div>
          )}
          <textarea value={textB} onChange={e => setTextB(e.target.value)} spellCheck={false} placeholder="Paste modified text or drop .txt file"
            style={{ width: '100%', height: '180px', padding: '1rem', borderRadius: '12px', backgroundColor: isDraggingB ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'vertical', transition: 'background-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = '#10b981'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* Diff output */}
      <div style={{ display: 'flex', gap: '0', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Left diff */}
        <div style={{ flex: 1, borderRight: '1px solid var(--border)', overflow: 'auto', maxHeight: '500px' }}>
          <div style={{ padding: '0.75rem 0' }}>
            {diff.left.map((line, i) => <DiffLine key={i} line={line} lineNum={i + 1} />)}
          </div>
        </div>
        {/* Right diff */}
        <div style={{ flex: 1, overflow: 'auto', maxHeight: '500px' }}>
          <div style={{ padding: '0.75rem 0' }}>
            {diff.right.map((line, i) => <DiffLine key={i} line={line} lineNum={i + 1} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
