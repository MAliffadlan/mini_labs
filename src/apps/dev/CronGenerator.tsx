/**
 * CronGenerator.tsx — Visual Cron Expression Generator
 */
import React, { useState, useMemo } from 'react';
import CopyButton from '../../components/CopyButton';

const presets = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at noon', cron: '0 12 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every 1st of month', cron: '0 0 1 * *' },
  { label: 'Every weekday at 8am', cron: '0 8 * * 1-5' },
];

const fieldLabels = ['Minute', 'Hour', 'Day (Month)', 'Month', 'Day (Week)'];
const fieldRanges = ['0-59', '0-23', '1-31', '1-12', '0-6 (Sun=0)'];

function describeCron(parts: string[]): string {
  if (parts.length !== 5) return 'Invalid cron expression';
  const [min, hr, dom, mon, dow] = parts;
  let desc = 'Runs ';
  // Minute
  if (min === '*') desc += 'every minute';
  else if (min.startsWith('*/')) desc += `every ${min.slice(2)} minutes`;
  else desc += `at minute ${min}`;
  // Hour
  if (hr === '*') desc += ', every hour';
  else if (hr.startsWith('*/')) desc += `, every ${hr.slice(2)} hours`;
  else desc += `, at ${hr.padStart(2,'0')}:${min === '*' ? '00' : min.padStart(2,'0')}`;
  // DOM
  if (dom !== '*') desc += `, on day ${dom} of the month`;
  // Month
  if (mon !== '*') {
    const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    desc += `, in ${months[parseInt(mon)] || mon}`;
  }
  // DOW
  if (dow !== '*') {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if (dow === '1-5') desc += ', on weekdays';
    else if (dow === '0,6') desc += ', on weekends';
    else desc += `, on ${days[parseInt(dow)] || dow}`;
  }
  return desc + '.';
}

export default function CronGenerator() {
  const [fields, setFields] = useState(['*', '*', '*', '*', '*']);

  const cron = fields.join(' ');
  const description = useMemo(() => describeCron(fields), [fields]);

  const setField = (i: number, val: string) => {
    const next = [...fields];
    next[i] = val || '*';
    setFields(next);
  };

  const applyPreset = (cronStr: string) => {
    setFields(cronStr.split(' '));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Output */}
      <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}><CopyButton text={cron} label="Copy" /></div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.15em', marginBottom: '1rem' }}>{cron}</p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
      </div>

      {/* Field editors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
        {fieldLabels.map((label, i) => (
          <div key={i}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            <input type="text" value={fields[i]} onChange={e => setField(i, e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', textAlign: 'center', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '0.25rem' }}>{fieldRanges[i]}</span>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Presets</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
          {presets.map(p => (
            <button key={p.cron} onClick={() => applyPreset(p.cron)}
              style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid var(--border)', backgroundColor: cron === p.cron ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.02)', borderColor: cron === p.cron ? 'rgba(139,92,246,0.3)' : 'var(--border)', color: cron === p.cron ? 'var(--accent-purple)' : 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (cron !== p.cron) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >{p.label}</button>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div style={{ padding: '1.5rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>📖 Cron Syntax Reference</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 2 }}>
          <code>*</code> = any value &nbsp;|&nbsp; <code>,</code> = list (1,3,5) &nbsp;|&nbsp; <code>-</code> = range (1-5) &nbsp;|&nbsp; <code>/</code> = step (*/5)
        </div>
      </div>
    </div>
  );
}
