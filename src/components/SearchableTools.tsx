/**
 * SearchableTools.tsx — Real-time animated search and Tabs UI Filter
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolCard from './ToolCard';

interface Tool {
  title: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  popular?: boolean;
  color: string;
  glowColor?: string;
}

interface SearchableToolsProps {
  tools: Tool[];
}

export default function SearchableTools({ tools }: SearchableToolsProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Popular', 'Text', 'Dev', 'Utility'];

  // Filter tools by search query in real-time
  const searchFilteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    const lowerQuery = query.toLowerCase();
    
    return tools.filter(tool => 
      tool.title.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
    );
  }, [tools, query]);

  // Then segment based on the active tab
  const displayTools = useMemo(() => {
    if (activeTab === 'All') return searchFilteredTools;
    if (activeTab === 'Popular') return searchFilteredTools.filter(t => t.popular);
    return searchFilteredTools.filter(t => t.category === activeTab);
  }, [searchFilteredTools, activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Aesthetic Search Bar & Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}>
        
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          style={{ position: 'relative', maxWidth: '640px', margin: '0 auto', width: '100%', zIndex: 10 }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '1.25rem',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            transition: 'color 0.3s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools, encoders, formatters..."
            spellCheck={false}
            style={{
              width: '100%',
              padding: '1.25rem 1.25rem 1.25rem 3.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '1.0625rem',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-purple)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              const svg = e.currentTarget.parentElement?.querySelector('svg');
              if (svg) svg.style.color = 'var(--accent-purple)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              const svg = e.currentTarget.parentElement?.querySelector('svg');
              if (svg) svg.style.color = 'var(--text-muted)';
            }}
          />
          
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute', top: '50%', right: '1.25rem', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tab Filter Bar (The Game Changer) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            padding: '0.375rem', 
            backgroundColor: 'rgba(255,255,255,0.02)', 
            borderRadius: '9999px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflowX: 'auto',
            maxWidth: '100%',
            scrollbarWidth: 'none', // hide scrollbar for firefox
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                position: 'relative',
                padding: '0.625rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.9375rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: activeTab === tab ? 600 : 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                outline: 'none',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabPill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === 'Popular' && '⭐ '}
              {tab === 'Text' && '📝 '}
              {tab === 'Dev' && '👨‍💻 '}
              {tab === 'Utility' && '🛠️ '}
              {tab === 'All' && '🧩 '}
              {tab}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Grid with Framer Motion Layout Animations */}
      <div id="tools-grid" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', minHeight: '400px' }}>
        <AnimatePresence mode='popLayout'>
          {displayTools.length > 0 ? (
            <>
              {/* If "All" is active, show the distinct "Popular Tools" section first */}
              {activeTab === 'All' && (
                <motion.section 
                  key="popular-section"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div layout style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--eab308)', textShadow: '0 0 10px rgba(234, 179, 8, 0.4)' }}>⭐</span> Popular Tools
                    </h2>
                  </motion.div>
                  
                  <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence mode='popLayout'>
                      {displayTools.filter(t => t.popular).map((tool) => (
                        <motion.div key={tool.title} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }} style={{ position: 'relative' }}>
                          <ToolCard title={tool.title} description={tool.description} icon={tool.icon} href={tool.href} color={tool.color} glowColor={tool.glowColor} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.section>
              )}

              {/* Next section for the rest of tools, OR standard flat grid if not "All" */}
              <motion.section 
                key="other-section"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'All' && (
                  <motion.div layout style={{ marginBottom: '2rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>🗂️ All Other Tools</h2>
                  </motion.div>
                )}
                
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                  <AnimatePresence mode='popLayout'>
                    {(activeTab === 'All' ? displayTools.filter(t => !t.popular) : displayTools).map((tool) => (
                      <motion.div key={tool.title} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, type: "spring", stiffness: 350, damping: 25 }} style={{ position: 'relative' }}>
                        <ToolCard title={tool.title} description={tool.description} icon={tool.icon} href={tool.href} color={tool.color} glowColor={tool.glowColor} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.section>
            </>
          ) : (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}
            >
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem', filter: 'grayscale(0.5)' }}>📭</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>No tools found</h3>
              <p style={{ fontSize: '1.125rem' }}>We couldn't find anything matching "{query}" in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
