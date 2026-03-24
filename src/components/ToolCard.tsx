import React, { useState, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  glowColor?: string;
}

export default function ToolCard({ title, description, icon, href, color, glowColor }: ToolCardProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    
    // 3D Tilt
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    setTilt({
      rotateX: (y - 0.5) * -12,
      rotateY: (x - 0.5) * 12,
    });
  }

  const baseGlow = glowColor || color;
  
  return (
    <motion.a
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ rotateX: 0, rotateY: 0 }); }}
      whileTap={{ scale: 0.97 }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: isHovered ? 1.02 : 1,
        y: isHovered ? -4 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem',
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        textDecoration: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        height: '100%',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      {/* 2. Hover Glow: Background radial gradient following mouse */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${baseGlow.replace('0.4', '0.12')},
              transparent 80%
            )
          `
        }}
      />
      
      {/* 2. Hover Glow: Border illumination following mouse */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: '25px',
          padding: '1px',
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        color: color,
        marginBottom: '1.5rem',
        boxShadow: isHovered ? `0 8px 30px ${baseGlow}` : 'none',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          animate={{ rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {icon}
        </motion.div>
      </div>

      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.375rem',
        fontWeight: 700,
        color: isHovered ? '#fff' : 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-0.01em',
        transition: 'color 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '0.9375rem',
        color: isHovered ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
        lineHeight: 1.6,
        margin: 0,
        transition: 'color 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}>
        {description}
      </p>
    </motion.a>
  );
}
