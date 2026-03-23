/**
 * PaletteGenerator.tsx — Aesthetic Harmonious Palette Generator
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function generateRandomHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette() {
  // Generate harmonious palette using an analogous + slight hue shifting technique
  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 45 + Math.floor(Math.random() * 25);  // 45-70%
  
  const palette = [];
  for(let i=0; i<5; i++) {
    // shift hue by 20-30 degrees per step for beautiful gradients
    const h = (baseHue + i * 28) % 360;
    palette.push(hslToHex(h, saturation, lightness));
  }
  return palette;
}

export default function PaletteGenerator() {
  const [colors, setColors] = useState<string[]>(['#000000', '#111111', '#222222', '#333333', '#444444']);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Generate initial palette slightly after mount for client hydration sync
    setColors(generatePalette());
  }, []);

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', height: 'calc(100vh - 280px)', minHeight: '520px', width: '100%' }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => setColors(generatePalette())}
          style={{
            padding: '1rem 2rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            color: '#fff',
            fontSize: '1.0625rem',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)'; }}
        >
          <span>✨</span> Generate Random Palette
        </button>
      </div>
      
      {/* Aesthetic Massive Cards Grid */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        borderRadius: '24px', 
        overflow: 'hidden', 
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)', 
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <AnimatePresence>
          {colors.map((color, index) => (
             <motion.div
               key={`${color}-${index}`}
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
               style={{
                 flex: 1,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'flex-end',
                 backgroundColor: color,
                 position: 'relative',
                 cursor: 'pointer',
                 transition: 'flex 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
               }}
               onMouseEnter={(e) => { e.currentTarget.style.flex = '1.3'; }}
               onMouseLeave={(e) => { e.currentTarget.style.flex = '1'; }}
               onClick={() => handleCopy(color, index)}
             >
               {/* Translucent overlay for text readability */}
               <div style={{
                 padding: '2rem 1rem',
                 background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 gap: '0.5rem',
                 opacity: 0,
                 transition: 'opacity 0.3s ease'
               }}
               className="color-card-info"
               >
                 <span style={{ 
                   fontFamily: "'JetBrains Mono', monospace", 
                   fontSize: '1.25rem', 
                   fontWeight: 'bold', 
                   color: '#fff',
                   letterSpacing: '0.05em',
                   textTransform: 'uppercase'
                 }}>
                   {color}
                 </span>
                 <span style={{
                   fontSize: '0.875rem',
                   color: copiedIndex === index ? 'var(--success)' : 'rgba(255,255,255,0.7)',
                   fontWeight: 600,
                   fontFamily: "'Inter', sans-serif"
                 }}>
                   {copiedIndex === index ? '✓ Copied' : 'Click to copy'}
                 </span>
               </div>

               <style>{`
                 div:hover > .color-card-info {
                   opacity: 1 !important;
                 }
               `}</style>
             </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
