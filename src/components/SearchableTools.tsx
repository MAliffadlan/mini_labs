/**
 * SearchableTools.tsx — Real-time animated Tabs UI Filter
 * Reads search query from shared nanostores atom.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $searchQuery } from '../stores/searchStore';
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
  const query = useStore($searchQuery);
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
      
      {/* Tab Filter Bar */}
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
          scrollbarWidth: 'none',
          margin: '0 auto',
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
                      <span style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.4)' }}>⭐</span> Popular Tools
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

              {/* Standard grid */}
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
