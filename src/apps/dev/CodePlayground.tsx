/**
 * CodePlayground.tsx — Full IDE Experience using StackBlitz
 * Embeds full WebContainers / CodeSandbox equivalents for real VS Code feel.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EnvTemplate = {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
  desc: string;
};

const TEMPLATES: EnvTemplate[] = [
  {
    id: 'vanilla',
    name: 'Vanilla JS',
    icon: '🟨',
    color: '#f7df1e',
    desc: 'Pure HTML, CSS, and JS',
    url: 'https://stackblitz.com/edit/web-platform?embed=1&theme=dark&hideNavigation=1',
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    color: '#61dafb',
    desc: 'Create React App starter',
    url: 'https://stackblitz.com/edit/react?embed=1&theme=dark&hideNavigation=1',
  },
  {
    id: 'vue',
    name: 'Vue 3',
    icon: '🟩',
    color: '#42b883',
    desc: 'Vue 3 Composition API',
    url: 'https://stackblitz.com/edit/vue3-script-setup-empty?embed=1&theme=dark&hideNavigation=1',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '⬛',
    color: '#ffffff',
    desc: 'React framework SSR/SSG',
    url: 'https://stackblitz.com/edit/nextjs?embed=1&theme=dark&hideNavigation=1',
  },
  {
    id: 'node',
    name: 'Node.js',
    icon: '🟩',
    color: '#339933',
    desc: 'Backend Node.js environment',
    url: 'https://stackblitz.com/edit/node?embed=1&theme=dark&hideNavigation=1',
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🅰️',
    color: '#dd0031',
    desc: 'Angular framework starter',
    url: 'https://stackblitz.com/edit/angular?embed=1&theme=dark&hideNavigation=1',
  },
];

export default function CodePlayground() {
  const [activeEnv, setActiveEnv] = useState<EnvTemplate | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', minHeight: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'relative' }}>
      
      <AnimatePresence mode="wait">
        {!activeEnv ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '3rem 2rem', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💻</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif", marginBottom: '0.5rem' }}>Select Environment</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '500px' }}>
                Launch a full IDE in your browser. Complete with File Explorer, Terminal, and package manager.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1000px' }}>
              {TEMPLATES.map((tmpl) => (
                <motion.button
                  key={tmpl.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveEnv(tmpl)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tmpl.color;
                    e.currentTarget.style.boxShadow = `0 8px 32px color-mix(in srgb, ${tmpl.color} 15%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.05, filter: 'grayscale(100%)' }}>
                    {tmpl.icon}
                  </div>
                  
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{tmpl.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif", marginBottom: '0.25rem' }}>{tmpl.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{tmpl.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}
          >
            {/* Top Bar inside IDE mode */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#1c1c1c', borderBottom: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setActiveEnv(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem',
                    borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                    color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Back to Templates
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid #333' }}>
                  <span style={{ fontSize: '1.25rem' }}>{activeEnv.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>{activeEnv.name} Environment</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a href={activeEnv.url.replace('?embed=1', '')} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Open in New Tab <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>

            {/* Iframe IDE */}
            <div style={{ flex: 1, backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <iframe
                src={activeEnv.url}
                title={`StackBlitz ${activeEnv.name} IDE`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
