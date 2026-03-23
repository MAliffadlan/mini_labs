/**
 * RegexTester.tsx — Regex Tester with live match highlighting
 * Features: regex input with flags, highlighted matches, match info, copy, auto-save
 */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CopyButton from '../../components/CopyButton';
import { useAutoSave } from '../../hooks/useAutoSave';

interface MatchInfo {
  fullMatch: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useAutoSave('regex-pattern', '\\d+');
  const [flags, setFlags] = useAutoSave('regex-flags', 'g');
  const [testString, setTestString] = useAutoSave(
    'regex-test',
    'Hello 123 world 456! Test regex with abc 789.'
  );
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<MatchInfo[]>([]);

  // Build regex and find matches
  const processRegex = useCallback(() => {
    if (!pattern.trim()) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches: MatchInfo[] = [];

      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          // Prevent infinite loops on zero-length matches
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (e: any) {
      setMatches([]);
      setError(e.message || 'Invalid regex pattern');
    }
  }, [pattern, flags, testString]);

  useEffect(() => {
    processRegex();
  }, [processRegex]);

  // Build highlighted HTML from matches
  const highlightedHtml = useMemo(() => {
    if (!pattern.trim() || error || matches.length === 0) {
      return null;
    }

    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let matchIndex = 0;

      // Use matchAll for iteration
      const allMatches = [...testString.matchAll(regex)];

      for (const match of allMatches) {
        const start = match.index!;
        const end = start + match[0].length;

        // Add text before match
        if (start > lastIndex) {
          parts.push(
            <span key={`text-${matchIndex}`}>{testString.slice(lastIndex, start)}</span>
          );
        }

        // Add highlighted match
        if (match[0].length > 0) {
          parts.push(
            <mark
              key={`match-${matchIndex}`}
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.3)',
                color: '#c7d2fe',
                borderRadius: '2px',
                padding: '1px 2px',
                border: '1px solid rgba(99, 102, 241, 0.5)',
              }}
            >
              {match[0]}
            </mark>
          );
        }

        lastIndex = end;
        matchIndex++;
      }

      // Add remaining text
      if (lastIndex < testString.length) {
        parts.push(<span key="text-end">{testString.slice(lastIndex)}</span>);
      }

      return parts;
    } catch {
      return null;
    }
  }, [pattern, flags, testString, error, matches]);

  // Flag toggle buttons
  const flagOptions = [
    { flag: 'g', label: 'Global', desc: 'Find all matches' },
    { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
    { flag: 'm', label: 'Multiline', desc: '^$ match line boundaries' },
    { flag: 's', label: 'Dotall', desc: '. matches newline' },
  ];

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, '') : prev + flag));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 140px)' }}>
      {/* Regex Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontFamily: 'monospace' }}>/</span>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter regex pattern..."
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontFamily: 'monospace' }}>/</span>

        {/* Flag toggles */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {flagOptions.map(({ flag, label }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              title={label}
              style={{
                padding: '0.375rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: flags.includes(flag) ? 'var(--accent)' : 'var(--border)',
                backgroundColor: flags.includes(flag) ? 'var(--accent-glow)' : 'transparent',
                color: flags.includes(flag) ? 'var(--accent-hover)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {flag}
            </button>
          ))}
        </div>

        {/* Error badge */}
        {error && (
          <span
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--error)',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            ⚠ {error}
          </span>
        )}
      </div>

      {/* Main Content: Test String + Results */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          flex: 1,
          minHeight: 0,
        }}
        className="regex-grid"
      >
        {/* Test String Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-card)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Test String
            </span>
            <button
              onClick={() => setTestString('')}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter test string..."
            spellCheck={false}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              border: 'none',
              resize: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              outline: 'none',
            }}
          />
        </div>

        {/* Results Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-card)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Matches
              {matches.length > 0 && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-glow)',
                    color: 'var(--accent-hover)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  {matches.length}
                </span>
              )}
            </span>
            <CopyButton text={matches.map((m) => m.fullMatch).join('\n')} label="Copy matches" />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
            {/* Highlighted text preview */}
            {highlightedHtml && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-elevated)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8125rem',
                  lineHeight: 1.8,
                  marginBottom: '1rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {highlightedHtml}
              </div>
            )}

            {/* Match list */}
            {matches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {matches.map((match, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-secondary)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        minWidth: '1.5rem',
                      }}
                    >
                      #{i + 1}
                    </span>
                    <code
                      style={{
                        color: 'var(--accent-hover)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      "{match.fullMatch}"
                    </code>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>
                      index: {match.index}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center', paddingTop: '2rem' }}>
                {pattern.trim() ? 'No matches found' : 'Enter a regex pattern to start matching'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .regex-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
