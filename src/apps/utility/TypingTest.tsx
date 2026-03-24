import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORD_LISTS = {
  easy: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'day', 'most', 'give', 'find'],
  medium: ['because', 'through', 'between', 'should', 'before', 'system', 'program', 'question', 'another', 'problem', 'during', 'without', 'change', 'around', 'number', 'always', 'really', 'world', 'small', 'water', 'since', 'place', 'never', 'under', 'together', 'start', 'might', 'every', 'still', 'important', 'example', 'children', 'almost', 'different', 'school', 'change', 'follow', 'animal', 'study', 'something', 'country', 'family', 'develop', 'include', 'second', 'point', 'again', 'story', 'begin', 'while', 'around', 'thought', 'against', 'idea', 'enough', 'learn', 'answer', 'group', 'night', 'young'],
  hard: ['algorithm', 'bureaucracy', 'cacophony', 'dichotomy', 'ephemeral', 'fastidious', 'garrulous', 'hierarchy', 'idiosyncrasy', 'juxtaposition', 'kaleidoscope', 'labyrinth', 'meticulous', 'nonchalant', 'obfuscate', 'paradigm', 'quintessential', 'reconnaissance', 'serendipity', 'transcendence', 'ubiquitous', 'vicissitude', 'whimsical', 'xenophobia', 'zeitgeist', 'ambiguous', 'belligerent', 'clandestine', 'dilapidated', 'exacerbate', 'flabbergasted', 'gregarious', 'hypothetical', 'impeccable', 'judiciously', 'kinesthetic', 'loquacious', 'magnanimous', 'ostentatious', 'philanthropic'],
};

type Difficulty = 'easy' | 'medium' | 'hard';
type TestDuration = 15 | 30 | 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TypingSpeedTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [duration, setDuration] = useState<TestDuration>(30);
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [charStatuses, setCharStatuses] = useState<('correct' | 'wrong' | 'pending')[][]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  const generateWords = useCallback(() => {
    const pool = WORD_LISTS[difficulty];
    const shuffled = shuffle(pool);
    // Generate enough words for the test
    const count = duration * 3;
    const result: string[] = [];
    while (result.length < count) {
      result.push(...shuffle(pool));
    }
    return result.slice(0, count);
  }, [difficulty, duration]);

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newWords = generateWords();
    setWords(newWords);
    setTyped('');
    setWordIndex(0);
    setCharIndex(0);
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setCorrectWords(0);
    setWrongWords(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setCharStatuses(newWords.map(w => w.split('').map(() => 'pending')));
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, generateWords]);

  useEffect(() => {
    resetTest();
  }, [difficulty, duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [isRunning]);

  // Scroll active word into view
  useEffect(() => {
    const activeEl = document.getElementById(`word-${wordIndex}`);
    if (activeEl && wordsContainerRef.current) {
      const container = wordsContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const wordRect = activeEl.getBoundingClientRect();
      if (wordRect.top > containerRect.top + containerRect.height * 0.6) {
        container.scrollTop += wordRect.height + 8;
      }
    }
  }, [wordIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (!isRunning && e.key.length === 1) {
      setIsRunning(true);
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (typed.length === 0) return;

      const currentWord = words[wordIndex];
      const isCorrect = typed === currentWord;

      // Update remaining chars as wrong if word is shorter than expected
      const newStatuses = [...charStatuses];
      for (let i = typed.length; i < currentWord.length; i++) {
        newStatuses[wordIndex][i] = 'wrong';
      }
      setCharStatuses(newStatuses);

      if (isCorrect) {
        setCorrectWords(prev => prev + 1);
      } else {
        setWrongWords(prev => prev + 1);
      }

      setWordIndex(prev => prev + 1);
      setCharIndex(0);
      setTyped('');
      return;
    }

    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        const newStatuses = [...charStatuses];
        newStatuses[wordIndex][typed.length - 1] = 'pending';
        setCharStatuses(newStatuses);
        setTyped(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      }
      return;
    }

    // Regular character
    if (e.key.length === 1) {
      const currentWord = words[wordIndex];
      if (typed.length >= currentWord.length) return; // don't type beyond word length

      setTotalKeystrokes(prev => prev + 1);
      const isCharCorrect = e.key === currentWord[typed.length];
      if (isCharCorrect) {
        setCorrectKeystrokes(prev => prev + 1);
      }

      const newStatuses = [...charStatuses];
      newStatuses[wordIndex][typed.length] = isCharCorrect ? 'correct' : 'wrong';
      setCharStatuses(newStatuses);

      setTyped(prev => prev + e.key);
      setCharIndex(prev => prev + 1);
    }
  };

  const wpm = isFinished ? Math.round((correctWords / duration) * 60) : 0;
  const accuracy = isFinished && totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;
  const cpm = isFinished ? Math.round((correctKeystrokes / duration) * 60) : 0;

  const timerPercent = (timeLeft / duration) * 100;
  const timerColor = timerPercent > 50 ? '#10b981' : timerPercent > 20 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      {/* Settings Bar */}
      {!isRunning && !isFinished && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {/* Difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Difficulty:</span>
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s',
                  background: difficulty === d ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
                  color: difficulty === d ? '#fff' : 'var(--text-secondary)',
                }}
              >{d}</button>
            ))}
          </div>
          {/* Duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Time:</span>
            {([15, 30, 60] as const).map(t => (
              <button key={t} onClick={() => setDuration(t)}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s',
                  background: duration === t ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
                  color: duration === t ? '#fff' : 'var(--text-secondary)',
                }}
              >{t}s</button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timer Bar */}
      {isRunning && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: timerColor, fontSize: '2rem', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{timeLeft}s</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{correctWords} words</span>
          </div>
          <div style={{ width: '100%', height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }}>
            <motion.div animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: '4px', background: timerColor }} />
          </div>
        </div>
      )}

      {/* Word Display */}
      {!isFinished && (
        <div
          ref={wordsContainerRef}
          onClick={() => inputRef.current?.focus()}
          style={{
            position: 'relative', padding: '2rem', borderRadius: '20px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            cursor: 'text', minHeight: '160px', maxHeight: '200px', overflow: 'hidden',
            marginBottom: '1.5rem', lineHeight: 2.2, fontSize: '1.375rem',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {words.map((word, wi) => (
            <span key={wi} id={`word-${wi}`} style={{ marginRight: '0.5em', display: 'inline-block' }}>
              {word.split('').map((char, ci) => {
                const status = charStatuses[wi]?.[ci] || 'pending';
                let color = 'var(--text-muted)';
                if (status === 'correct') color = '#10b981';
                if (status === 'wrong') color = '#ef4444';
                const isCurrentChar = wi === wordIndex && ci === charIndex;
                return (
                  <span key={ci} style={{ color, position: 'relative', transition: 'color 0.1s' }}>
                    {isCurrentChar && (
                      <span style={{
                        position: 'absolute', left: '-1px', top: '2px', bottom: '2px',
                        width: '2px', background: '#8b5cf6', borderRadius: '2px',
                        animation: 'blink 1s step-end infinite',
                      }} />
                    )}
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
          <input
            ref={inputRef}
            value={typed}
            onChange={() => {}}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              position: 'absolute', opacity: 0, left: 0, top: 0,
              width: '100%', height: '100%', cursor: 'text',
            }}
          />
          {!isRunning && !isFinished && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,9,11,0.6)', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Click here and start typing...</p>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            {/* Big WPM */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                <span style={{ fontSize: '5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {wpm}
                </span>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '0.5rem' }}>WPM</span>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 90 ? '#10b981' : accuracy >= 70 ? '#f59e0b' : '#ef4444' },
                { label: 'CPM', value: cpm.toString(), color: '#3b82f6' },
                { label: 'Correct', value: correctWords.toString(), color: '#10b981' },
                { label: 'Wrong', value: wrongWords.toString(), color: '#ef4444' },
                { label: 'Total Keys', value: totalKeystrokes.toString(), color: '#8b5cf6' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
                    padding: '1.25rem', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, fontFamily: "'Outfit', sans-serif" }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Restart */}
            <div style={{ textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={resetTest}
                style={{
                  padding: '0.875rem 2.5rem', borderRadius: '9999px', border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                🔄 Try Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
