import React, { useState } from 'react';
import { motion } from 'framer-motion';

type CalcMode = 'basic' | 'scientific';

const btnStyle = (bg: string, color: string, span?: number): React.CSSProperties => ({
  gridColumn: span ? `span ${span}` : undefined,
  padding: '1rem', borderRadius: '14px', border: 'none',
  background: bg, color, fontSize: '1.25rem', fontWeight: 600,
  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  transition: 'all 0.15s ease',
});

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [isResult, setIsResult] = useState(false);

  const appendChar = (ch: string) => {
    if (isResult) {
      // If last action was =, start fresh unless operator
      if ('+-×÷'.includes(ch)) {
        setExpression(display + ch);
        setDisplay(ch);
        setIsResult(false);
      } else {
        setExpression(ch);
        setDisplay(ch);
        setIsResult(false);
      }
      return;
    }
    if (display === '0' && ch !== '.') {
      setDisplay(ch);
      setExpression(expression + ch);
    } else {
      setDisplay(display + ch);
      setExpression(expression + ch);
    }
  };

  const appendOp = (op: string) => {
    setIsResult(false);
    const lastChar = expression.slice(-1);
    if ('+-×÷'.includes(lastChar)) {
      setExpression(expression.slice(0, -1) + op);
    } else {
      setExpression(expression + op);
    }
    setDisplay(op);
  };

  const clear = () => { setDisplay('0'); setExpression(''); setIsResult(false); };

  const backspace = () => {
    if (isResult) { clear(); return; }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay('0');
      setExpression(expression.slice(0, -1));
    }
  };

  const applyFunc = (fn: string) => {
    try {
      const val = parseFloat(display) || 0;
      let result = 0;
      switch (fn) {
        case 'sin': result = Math.sin(val * Math.PI / 180); break;
        case 'cos': result = Math.cos(val * Math.PI / 180); break;
        case 'tan': result = Math.tan(val * Math.PI / 180); break;
        case 'log': result = Math.log10(val); break;
        case 'ln': result = Math.log(val); break;
        case '√': result = Math.sqrt(val); break;
        case 'x²': result = val * val; break;
        case 'x³': result = val * val * val; break;
        case '1/x': result = 1 / val; break;
        case 'n!': result = factorial(val); break;
        case 'π': { setDisplay(String(Math.PI)); setExpression(String(Math.PI)); setIsResult(true); return; }
        case 'e': { setDisplay(String(Math.E)); setExpression(String(Math.E)); setIsResult(true); return; }
        case '%': result = val / 100; break;
        case '±': result = -val; break;
        default: return;
      }
      const r = parseFloat(result.toFixed(10)).toString();
      setDisplay(r);
      setExpression(r);
      setIsResult(true);
      setHistory(prev => [{ expr: `${fn}(${val})`, result: r }, ...prev].slice(0, 15));
    } catch {
      setDisplay('Error');
      setIsResult(true);
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= Math.floor(n); i++) r *= i;
    return r;
  };

  const calculate = () => {
    try {
      const sanitized = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[^0-9+\-*/.()eE]/g, '');
      if (!sanitized) return;
      const result = Function('"use strict"; return (' + sanitized + ')')();
      const r = parseFloat(Number(result).toFixed(10)).toString();
      setHistory(prev => [{ expr: expression, result: r }, ...prev].slice(0, 15));
      setDisplay(r === 'NaN' || r === 'Infinity' ? 'Error' : r);
      setExpression(r);
      setIsResult(true);
    } catch {
      setDisplay('Error');
      setIsResult(true);
    }
  };

  const sciButtons = [
    { label: 'sin', action: () => applyFunc('sin'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'cos', action: () => applyFunc('cos'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'tan', action: () => applyFunc('tan'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'log', action: () => applyFunc('log'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'ln', action: () => applyFunc('ln'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: '√', action: () => applyFunc('√'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'x²', action: () => applyFunc('x²'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'x³', action: () => applyFunc('x³'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'n!', action: () => applyFunc('n!'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'π', action: () => applyFunc('π'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: 'e', action: () => applyFunc('e'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    { label: '1/x', action: () => applyFunc('1/x'), bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  ];

  const mainButtons = [
    { label: 'AC', action: clear, bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
    { label: '⌫', action: backspace, bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '%', action: () => applyFunc('%'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '÷', action: () => appendOp('÷'), bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
    { label: '7', action: () => appendChar('7'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '8', action: () => appendChar('8'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '9', action: () => appendChar('9'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '×', action: () => appendOp('×'), bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
    { label: '4', action: () => appendChar('4'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '5', action: () => appendChar('5'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '6', action: () => appendChar('6'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '-', action: () => appendOp('-'), bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
    { label: '1', action: () => appendChar('1'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '2', action: () => appendChar('2'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '3', action: () => appendChar('3'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '+', action: () => appendOp('+'), bg: 'rgba(59,130,246,0.2)', color: '#60a5fa' },
    { label: '±', action: () => applyFunc('±'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '0', action: () => appendChar('0'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '.', action: () => appendChar('.'), bg: 'rgba(255,255,255,0.06)', color: '#fff' },
    { label: '=', action: calculate, bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: history.length > 0 ? '1fr 280px' : '1fr', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
      <div>
        {/* Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['basic', 'scientific'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '0.375rem 1rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 600,
              background: mode === m ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
              color: mode === m ? '#fff' : 'var(--text-secondary)',
            }}>{m === 'basic' ? 'Basic' : 'Scientific'}</button>
          ))}
        </div>

        {/* Display */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px',
          padding: '1.5rem', marginBottom: '1rem', textAlign: 'right', minHeight: '100px',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem', wordBreak: 'break-all', minHeight: '1.25rem' }}>
            {expression || ' '}
          </div>
          <div style={{ fontSize: display.length > 12 ? '1.75rem' : '2.5rem', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all', transition: 'font-size 0.2s' }}>
            {display}
          </div>
        </div>

        {/* Scientific Buttons */}
        {mode === 'scientific' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {sciButtons.map(btn => (
              <motion.button key={btn.label} whileTap={{ scale: 0.92 }} onClick={btn.action}
                style={btnStyle(btn.bg, btn.color)}
              >{btn.label}</motion.button>
            ))}
          </div>
        )}

        {/* Main Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {mainButtons.map(btn => (
            <motion.button key={btn.label} whileTap={{ scale: 0.9 }} onClick={btn.action}
              style={btnStyle(btn.bg, btn.color)}
            >{btn.label}</motion.button>
          ))}
        </div>
      </div>

      {/* History Panel */}
      {history.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 700 }}>History</h4>
            <button onClick={() => setHistory([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>Clear</button>
          </div>
          {history.map((h, i) => (
            <div key={i} onClick={() => { setDisplay(h.result); setExpression(h.result); setIsResult(true); }}
              style={{ padding: '0.5rem 0.625rem', borderRadius: '10px', marginBottom: '0.375rem', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{h.expr}</div>
              <div style={{ fontSize: '0.9375rem', color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>= {h.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
