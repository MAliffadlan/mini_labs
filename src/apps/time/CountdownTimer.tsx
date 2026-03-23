/**
 * CountdownTimer.tsx — Aesthetic Animated Countdown Timer
 */
import React, { useState, useEffect } from 'react';
import SplitView from '../../components/SplitView';
import { useAutoSave } from '../../hooks/useAutoSave';
import { motion } from 'framer-motion';

export default function CountdownTimer() {
  const dt = new Date(Date.now() + 86400000); // exactly 24 hours from now
  const dtString = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  
  const [targetDateStr, setTargetDateStr] = useAutoSave('countdown-target', dtString);
  const [eventName, setEventName] = useAutoSave('countdown-name', 'Product Launch');
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (isNaN(diff)) return;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isPast: false
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        width: '110px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 2px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '3.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  );

  return (
    <SplitView
      leftTitle="Event Configuration"
      rightTitle="Live Countdown"
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="E.g., New Year, Product Launch..."
              spellCheck={false}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', outline: 'none', transition: 'all 0.2s'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Date & Time</label>
            <input
              type="datetime-local"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9375rem', outline: 'none', transition: 'all 0.2s', colorScheme: 'dark'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
            />
          </div>
        </div>
      }
      rightContent={
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Aesthetic background glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 60%)', filter: 'blur(50px)', zIndex: 0 }}></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}
          >
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3rem', letterSpacing: '-0.03em', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {eventName || 'Untitled Event'}
            </h2>
            
            {timeLeft.isPast ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '2rem', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}
              >
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>🎉 Event Reached!</h3>
                <p style={{ fontWeight: 500 }}>The countdown has successfully finished.</p>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <TimeBlock value={timeLeft.days} label="Days" />
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--border-hover)', alignSelf: 'flex-start', paddingTop: '1.25rem' }}>:</span>
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--border-hover)', alignSelf: 'flex-start', paddingTop: '1.25rem' }}>:</span>
                <TimeBlock value={timeLeft.minutes} label="Mins" />
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--border-hover)', alignSelf: 'flex-start', paddingTop: '1.25rem' }}>:</span>
                <TimeBlock value={timeLeft.seconds} label="Secs" />
              </div>
            )}
          </motion.div>
        </div>
      }
    />
  );
}
