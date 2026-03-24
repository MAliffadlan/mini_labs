import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899',
  '#06b6d4', '#f97316', '#14b8a6', '#a855f7', '#6366f1', '#e11d48',
];

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function SpinWheel() {
  const [entries, setEntries] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(0);

  const addEntry = () => {
    const trimmed = inputText.trim();
    if (trimmed && !entries.includes(trimmed)) {
      setEntries([...entries, trimmed]);
      setInputText('');
    }
  };

  const addBulk = () => {
    const lines = inputText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const unique = [...new Set([...entries, ...lines])];
    setEntries(unique);
    setInputText('');
  };

  const removeEntry = (idx: number) => {
    setEntries(entries.filter((_, i) => i !== idx));
  };

  // Draw wheel
  useEffect(() => {
    drawWheel(angleRef.current);
  }, [entries]);

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas || entries.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (2 * Math.PI) / entries.length;

    entries.forEach((entry, i) => {
      const startAngle = rotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      const textAngle = startAngle + sliceAngle / 2;
      const textR = r * 0.65;
      ctx.translate(cx + Math.cos(textAngle) * textR, cy + Math.sin(textAngle) * textR);
      ctx.rotate(textAngle);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.min(14, 120 / entries.length + 8)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxLen = 12;
      const displayText = entry.length > maxLen ? entry.slice(0, maxLen) + '…' : entry;
      ctx.fillText(displayText, 0, 0);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#18181b';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer triangle (top)
    ctx.beginPath();
    ctx.moveTo(cx - 16, 4);
    ctx.lineTo(cx + 16, 4);
    ctx.lineTo(cx, 32);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spin = () => {
    if (entries.length < 2 || isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    const duration = 4000 + Math.random() * 2000; // 4-6 seconds
    const totalRotation = 6 * Math.PI + Math.random() * 4 * Math.PI; // 3-5 full spins
    const startAngle = angleRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentAngle = startAngle + totalRotation * easedProgress;

      angleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner
        const sliceAngle = (2 * Math.PI) / entries.length;
        // The pointer is at the top (- PI/2), normalize angle
        const pointerAngle = (-currentAngle - Math.PI / 2) % (2 * Math.PI);
        const normalizedAngle = ((pointerAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const winnerIndex = Math.floor(normalizedAngle / sliceAngle) % entries.length;

        setWinner(entries[winnerIndex]);
        setIsSpinning(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  // Confetti particles
  const confettiElements = showConfetti ? Array.from({ length: 60 }).map((_, i) => {
    const x = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 2 + Math.random() * 2;
    const color = COLORS[i % COLORS.length];
    const size = 6 + Math.random() * 8;
    return (
      <motion.div
        key={i}
        initial={{ opacity: 1, y: -20, x: `${x}vw`, rotate: 0 }}
        animate={{ opacity: 0, y: '100vh', rotate: 720 * (Math.random() > 0.5 ? 1 : -1) }}
        transition={{ duration, delay, ease: 'linear' }}
        style={{
          position: 'fixed', top: 0, left: 0, width: size, height: size,
          background: color, borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          zIndex: 200, pointerEvents: 'none',
        }}
      />
    );
  }) : null;

  return (
    <div>
      {/* Confetti Layer */}
      <AnimatePresence>{confettiElements}</AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: entries.length > 0 ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Input Panel */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
              ✏️ Add Participants
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry(); } }}
                placeholder="Type a name..."
                style={{
                  flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: '#fff', fontSize: '0.9375rem', fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addEntry}
                style={{
                  padding: '0.75rem 1.25rem', borderRadius: '12px', border: 'none',
                  background: '#8b5cf6', color: '#fff', fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.9375rem',
                }}
              >
                Add
              </motion.button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
              💡 Tip: Paste multiple names (one per line) then click "Add Bulk"
            </p>

            {inputText.includes('\n') && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={addBulk}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}
              >
                + Add Bulk ({inputText.split('\n').filter(l => l.trim()).length} names)
              </motion.button>
            )}

            {/* Entry List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <AnimatePresence>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.625rem 0.75rem', borderRadius: '10px', marginBottom: '0.375rem',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500 }}>{entry}</span>
                    </div>
                    <button
                      onClick={() => removeEntry(i)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {entries.length > 0 && (
              <button
                onClick={() => { setEntries([]); setWinner(null); }}
                style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8125rem', textDecoration: 'underline' }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Right: Wheel */}
        {entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                style={{ borderRadius: '50%', boxShadow: '0 0 40px rgba(139, 92, 246, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={spin}
              disabled={entries.length < 2 || isSpinning}
              style={{
                padding: '1rem 3rem', borderRadius: '9999px', border: 'none',
                background: isSpinning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#fff', fontSize: '1.125rem', fontWeight: 800, cursor: isSpinning ? 'not-allowed' : 'pointer',
                boxShadow: isSpinning ? 'none' : '0 8px 30px rgba(139, 92, 246, 0.4)',
                fontFamily: "'Outfit', sans-serif", letterSpacing: '0.03em',
              }}
            >
              {isSpinning ? '🌀 Spinning...' : '🎰 SPIN!'}
            </motion.button>

            {/* Winner Modal */}
            <AnimatePresence>
              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '20px', padding: '2rem', textAlign: 'center', width: '100%',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>The winner is...</p>
                  <h2 style={{ color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {winner}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎡</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Add at least 2 names to spin the wheel!</p>
          <p style={{ fontSize: '0.875rem' }}>Perfect for giveaways, deciding who pays the bill, or picking a random winner.</p>
        </div>
      )}
    </div>
  );
}
