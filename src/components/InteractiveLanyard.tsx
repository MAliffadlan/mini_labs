import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function InteractiveLanyard() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for the badge's position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smoother pullback when released
  const springConfig = { damping: 15, stiffness: 100, mass: 1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  // Map movement to 3D rotation mimicking a physical pendulum/card
  const rotateX = useTransform(springY, [-300, 300], [45, -45]);
  const rotateY = useTransform(springX, [-300, 300], [-45, 45]);
  const rotateZ = useTransform(springX, [-300, 300], [-20, 20]); // Pendulum swing
  
  // Lighting effect based on tilt
  const lightX = useTransform(springX, [-300, 300], [100, 0]);
  const lightY = useTransform(springY, [-300, 300], [100, 0]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100dvh', // Use dvh for mobile
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        perspective: '1200px',
        overflow: 'hidden',
        position: 'relative',
        background: '#09090b', // Deep background
         // Using a subtle gradient to match the dark aesthetic
        backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #09090b 60%)'
      }}
    >
      {/* Background Watermark Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 15vw, 15rem)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.02)',
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        Drag it!
      </div>

      {/* The entire lanyard assembly that swings */}
      <motion.div
        drag
        dragConstraints={containerRef} // Snap back to center
        dragElastic={0.4} // How stretchy the drag is
        style={{
          x,
          y,
          rotateX,
          rotateY,
          rotateZ,
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'grab',
          position: 'absolute',
          top: '-20%', // Hang from off-screen
          height: '120vh',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* The String */}
        <div style={{
          width: '18px',
          height: '40vh',
          background: '#111',
          borderLeft: '1px solid #333',
          borderRight: '1px solid #000',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '2rem',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
        }}>
          {/* Subtle logo pattern on the string */}
          <div style={{ position: 'absolute', top: '50%', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>⚛</div>
          <div style={{ position: 'absolute', top: '70%', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>⚛</div>
          <div style={{ position: 'absolute', top: '30%', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>⚛</div>
          
          {/* The Metal Clip Mechanism */}
          <div style={{
            position: 'absolute',
            bottom: '-15px',
            width: '24px',
            height: '30px',
            background: 'linear-gradient(135deg, #444, #111)',
            borderRadius: '4px',
            border: '1px solid #555',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            {/* The ring inside the clip */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '14px',
              height: '18px',
              borderRadius: '50%',
              border: '3px solid #333',
              borderTop: 'none'
            }} />
          </div>
        </div>

        {/* The ID Card / Badge */}
        <div style={{
          width: 'clamp(260px, 25vw, 320px)',
          height: 'clamp(380px, 35vw, 480px)',
          background: '#e0e0e0',
          borderRadius: '16px',
          position: 'relative',
          marginTop: '15px', // Gap below the clip ring
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Punched Hole for the clip */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '12px',
            background: '#09090b',
            borderRadius: '10px',
            boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.5)'
          }} />

          {/* Dynamic Lighting Layer (Shine effect based on drag tilt) */}
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
            pointerEvents: 'none',
            zIndex: 20
          }} />
          
          {/* Card Content - React Logo */}
          <div style={{
            color: '#111',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            transform: 'translateZ(20px)', // Make content pop out slightly in 3D
            transformStyle: 'preserve-3d'
          }}>
            {/* Massive React Logo */}
            <div style={{ 
              position: 'relative', 
              width: '120px', 
              height: '120px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {/* Ellipses mimicking React logo */}
              <div style={{ position: 'absolute', width: '100%', height: '40%', border: '8px solid #111', borderRadius: '50%', transform: 'rotate(0deg)' }} />
              <div style={{ position: 'absolute', width: '100%', height: '40%', border: '8px solid #111', borderRadius: '50%', transform: 'rotate(60deg)' }} />
              <div style={{ position: 'absolute', width: '100%', height: '40%', border: '8px solid #111', borderRadius: '50%', transform: 'rotate(120deg)' }} />
              <div style={{ position: 'absolute', width: '24px', height: '24px', background: '#111', borderRadius: '50%' }} />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>MINI LABS</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 500, margin: '0.25rem 0 0', opacity: 0.6 }}>VIP ACCESS PASS</p>
            </div>
          </div>
          
          {/* Bottom Bar Design */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '12px',
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)'
          }} />
        </div>
      </motion.div>

      {/* Overlay UI: Top Left (Title) */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 50 }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', margin: 0, fontWeight: 900 }}>Interactive</h1>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', margin: 0, fontWeight: 900, marginTop: '-10px' }}>Lanyard</h1>
      </div>

    </div>
  );
}
