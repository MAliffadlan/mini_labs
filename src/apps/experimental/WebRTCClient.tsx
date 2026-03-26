import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DataConnection } from 'peerjs';

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  sender: 'me' | 'them' | 'system';
  text: string;
  time: string;
}

// ─── Component ───────────────────────────────────────────────
export default function WebRTCClient() {
  const [peerId, setPeerId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [connectedPeerId, setConnectedPeerId] = useState('');

  const peerRef = useRef<any>(null);
  const connRef = useRef<DataConnection | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Auto-scroll chat
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Init PeerJS (dynamic import to avoid SSR crash)
  useEffect(() => {
    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer();
      peer.on('open', (id: string) => setPeerId(id));
      peer.on('connection', (conn: DataConnection) => wireConnection(conn));
      peerRef.current = peer;
    });
    return () => { peerRef.current?.destroy(); };
  }, []);

  // ─── Connection Logic ───────────────────────────────────────
  const wireConnection = useCallback((conn: DataConnection) => {
    connRef.current = conn;
    setStatus('connected');
    setConnectedPeerId(conn.peer);

    conn.on('data', (data: any) => {
      const t = now();
      if (data.type === 'chat') {
        setMessages(prev => [...prev, { sender: 'them', text: data.text, time: t }]);
      } else if (data.type === 'file') {
        const blob = new Blob([data.file]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = data.filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        setMessages(prev => [...prev, { sender: 'system', text: `📁 Received file: ${data.filename}`, time: t }]);
      }
    });
    conn.on('close', () => { setStatus('idle'); connRef.current = null; setConnectedPeerId(''); });
  }, []);

  const connect = () => {
    if (!peerRef.current || !targetId.trim()) return;
    setStatus('connecting');
    const conn = peerRef.current.connect(targetId.trim(), { reliable: true });
    conn.on('open', () => wireConnection(conn));
    conn.on('error', () => { setStatus('idle'); alert('Connection failed. Check the ID.'); });
  };

  const disconnect = () => { connRef.current?.close(); connRef.current = null; setStatus('idle'); setConnectedPeerId(''); };

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!connRef.current || !input.trim()) return;
    connRef.current.send({ type: 'chat', text: input });
    setMessages(prev => [...prev, { sender: 'me', text: input, time: now() }]);
    setInput('');
  };

  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!connRef.current || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    connRef.current.send({ type: 'file', file, filename: file.name });
    setMessages(prev => [...prev, { sender: 'me', text: `📁 Sent: ${file.name}`, time: now() }]);
    e.target.value = '';
  };

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Status helpers ─────────────────────────────────────────
  const statusColor = status === 'connected' ? '#10b981' : status === 'connecting' ? '#f59e0b' : 'var(--text-muted)';
  const statusLabel = status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Disconnected';

  // ─── Styles ─────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
  };

  const label: React.CSSProperties = {
    fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.625rem 0.875rem', borderRadius: '10px',
    border: '1px solid var(--border)', background: 'var(--bg-elevated)',
    color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const btnPrimary: React.CSSProperties = {
    padding: '0.625rem 1.5rem', borderRadius: '10px', border: 'none',
    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
    fontSize: '0.8125rem', fontWeight: 600, fontFamily: "'Inter', sans-serif",
    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
  };

  const btnDanger: React.CSSProperties = {
    ...btnPrimary,
    background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)',
    boxShadow: 'none',
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Connection Panel ─────────────────────────────────── */}
      <div style={{ ...card, padding: '1.75rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Left: My ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={label}>Your Peer ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{
                flex: 1, padding: '0.625rem 0.875rem', borderRadius: '10px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: '#10b981', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace",
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                userSelect: 'all',
              }}>
                {peerId || '● ● ● generating...'}
              </code>
              <button
                onClick={copyId} disabled={!peerId}
                style={{
                  padding: '0.625rem', borderRadius: '10px',
                  border: '1px solid var(--border)', background: copied ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)',
                  color: copied ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
                title="Copy ID"
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Share this ID with another tab or device to connect.
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '100%', background: 'var(--border)' }} />

          {/* Right: Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={label}>Connect to Peer</span>
            <input
              type="text" value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Paste remote Peer ID"
              disabled={status === 'connected'}
              style={{ ...inputStyle, opacity: status === 'connected' ? 0.5 : 1 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, display: 'inline-block', boxShadow: status === 'connected' ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                <span style={{ fontSize: '0.75rem', color: statusColor, fontWeight: 500 }}>{statusLabel}</span>
              </div>
              {status === 'connected' ? (
                <button onClick={disconnect} style={btnDanger}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                >Disconnect</button>
              ) : (
                <button
                  onClick={connect}
                  disabled={!targetId.trim() || !peerId || status === 'connecting'}
                  style={{ ...btnPrimary, opacity: (!targetId.trim() || !peerId) ? 0.5 : 1, cursor: (!targetId.trim() || !peerId) ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={(e) => { if (targetId.trim() && peerId) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >{status === 'connecting' ? 'Connecting...' : 'Connect'}</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Panel ───────────────────────────────────────── */}
      <div style={{
        ...card, display: 'flex', flexDirection: 'column', height: '480px',
        transition: 'opacity 0.3s, filter 0.3s',
        opacity: status === 'connected' ? 1 : 0.4,
        filter: status === 'connected' ? 'none' : 'grayscale(0.6)',
        pointerEvents: status === 'connected' ? 'auto' : 'none',
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem',
            }}>💬</div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Secure P2P Channel
              </p>
              {connectedPeerId && (
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {connectedPeerId.slice(0, 16)}...
                </p>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem',
            borderRadius: '999px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Encrypted</span>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', opacity: 0.4 }}>📡</div>
              <p style={{ fontSize: '0.8125rem', textAlign: 'center', maxWidth: '260px', lineHeight: 1.5 }}>
                {status === 'connected' ? 'Connection established! Send your first message.' : 'Connect to a peer to begin chatting.'}
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start' }}>
                {msg.sender === 'system' ? (
                  <span style={{
                    fontSize: '0.6875rem', color: 'var(--text-muted)',
                    padding: '0.25rem 0.75rem', borderRadius: '999px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  }}>{msg.text}</span>
                ) : (
                  <div style={{
                    maxWidth: '70%', padding: '0.625rem 0.875rem', borderRadius: '14px',
                    ...(msg.sender === 'me'
                      ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderBottomRightRadius: '4px' }
                      : { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderBottomLeftRadius: '4px' }
                    ),
                  }}>
                    <p style={{ fontSize: '0.8125rem', lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.text}</p>
                    <span style={{ fontSize: '0.5625rem', opacity: 0.6, display: 'block', marginTop: '0.25rem', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>{msg.time}</span>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={send} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <input type="file" ref={fileRef} className="hidden" style={{ display: 'none' }} onChange={sendFile} />
          <button
            type="button" onClick={() => fileRef.current?.click()}
            style={{
              padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            title="Send a file"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          </button>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ ...inputStyle, flex: 1 }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <button
            type="submit" disabled={!input.trim()}
            style={{
              padding: '0.5rem 0.875rem', borderRadius: '10px', border: 'none',
              background: input.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-elevated)',
              color: input.trim() ? '#fff' : 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0,
              boxShadow: input.trim() ? '0 4px 12px rgba(16,185,129,0.2)' : 'none',
            }}
            onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>

      {/* ── Info Banner ──────────────────────────────────────── */}
      <div style={{
        ...card, padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(5,150,105,0.02))',
        borderColor: 'rgba(16,185,129,0.1)',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>🔐</div>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>100% Peer-to-Peer · Zero Server</p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            All data travels directly between browsers via WebRTC Data Channel. Nothing is stored or relayed through any server.
          </p>
        </div>
      </div>
    </div>
  );
}
