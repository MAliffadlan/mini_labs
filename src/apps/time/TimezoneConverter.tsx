/**
 * TimezoneConverter.tsx — Aesthetic World Time Converter
 */
import React, { useState, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import { useAutoSave } from '../../hooks/useAutoSave';
import CopyButton from '../../components/CopyButton';

const COMMON_TIMEZONES = [
  'UTC', 'America/Los_Angeles', 'America/New_York', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Jakarta', 'Asia/Singapore',
  'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland'
];

export default function TimezoneConverter() {
  const [sourceTime, setSourceTime] = useAutoSave('tz-source-time', new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  const [targetTz, setTargetTz] = useAutoSave('tz-target-tz', 'UTC');
  
  const [resultDisplay, setResultDisplay] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const inputDate = new Date(sourceTime);
      if (isNaN(inputDate.getTime())) throw new Error("Invalid date");
      
      const targetString = inputDate.toLocaleString('en-US', { 
        timeZone: targetTz, 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
      
      setResultDisplay(targetString);
      setError('');
    } catch {
      setError('Invalid date format or timezone');
      setResultDisplay('');
    }
  }, [sourceTime, targetTz]);

  return (
    <SplitView
      leftTitle="Your Local Time"
      rightTitle="Target Time"
      leftActions={
        <button
          onClick={() => {
            const now = new Date();
            setSourceTime(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
          }}
          style={{ padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          Set to Now
        </button>
      }
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Select a specific date and time in your local timezone to see what it corresponds to across the globe.
          </p>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</label>
            <input
              type="datetime-local"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9375rem', outline: 'none', colorScheme: 'dark', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(20, 184, 166, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            />
          </div>
        </div>
      }
      rightContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Target Timezone</label>
            <select
              value={targetTz}
              onChange={(e) => setTargetTz(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', outline: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(20, 184, 166, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz} value={tz} style={{ background: 'var(--bg-secondary)' }}>{tz}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calculation Result</label>
            {error ? (
              <div style={{ color: 'var(--error)', fontSize: '0.875rem', padding: '1rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)' }}>
                ⚠ {error}
              </div>
            ) : (
              <div style={{ padding: '1.5rem', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', position: 'relative', minHeight: '120px', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <CopyButton text={resultDisplay} label="Copy" />
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '4rem', lineHeight: 1.5 }}>
                  {resultDisplay}
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
