import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DataConnection, MediaConnection } from 'peerjs';

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  sender: 'me' | 'them' | 'system';
  text: string;
  time: string;
}

type ActiveTab = 'chat' | 'video' | 'screen';

// ─── Component ───────────────────────────────────────────────
export default function WebRTCClient() {
  // Connection state
  const [peerId, setPeerId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [connectedPeerId, setConnectedPeerId] = useState('');
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isPeerTyping, setIsPeerTyping] = useState(false);

  // Media state
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [callActive, setCallActive] = useState(false);
  const [screenActive, setScreenActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Refs
  const peerRef = useRef<any>(null);
  const connRef = useRef<DataConnection | null>(null);
  const mediaConnRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const peerTypingTimeoutRef = useRef<any>(null);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Auto-scroll chat
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Sync streams to video elements AFTER they mount in the DOM
  // This fixes the black screen bug: video elements only exist when callActive/screenActive is true,
  // but streams are obtained BEFORE setting those states.
  useEffect(() => {
    if ((callActive || screenActive) && localStreamRef.current) {
      if (localVideoRef.current && localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    if ((callActive || screenActive) && remoteStreamRef.current) {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [callActive, screenActive]);

  // Init PeerJS
  useEffect(() => {
    import('peerjs').then(({ default: Peer }) => {
      const peer = new Peer();
      peer.on('open', (id: string) => setPeerId(id));
      peer.on('connection', (conn: DataConnection) => wireDataConnection(conn));
      peer.on('call', (call: MediaConnection) => {
        // Auto-answer incoming calls
        handleIncomingCall(call);
      });
      peerRef.current = peer;
    });
    return () => { stopAllMedia(); peerRef.current?.destroy(); };
  }, []);

  // ─── Data Connection ───────────────────────────────────────
  const wireDataConnection = useCallback((conn: DataConnection) => {
    connRef.current = conn;
    setStatus('connected');
    setConnectedPeerId(conn.peer);

    conn.on('data', (data: any) => {
      const t = now();
      if (data.type === 'typing') {
        setIsPeerTyping(data.isTyping);
        if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
        if (data.isTyping) {
          peerTypingTimeoutRef.current = setTimeout(() => setIsPeerTyping(false), 3000);
        }
      } else if (data.type === 'chat') {
        setIsPeerTyping(false);
        setMessages(prev => [...prev, { sender: 'them', text: data.text, time: t }]);
      } else if (data.type === 'file') {
        setIsPeerTyping(false);
        const blob = new Blob([data.file]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = data.filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        setMessages(prev => [...prev, { sender: 'system', text: `📁 Received file: ${data.filename}`, time: t }]);
      }
    });
    conn.on('close', () => { setStatus('idle'); connRef.current = null; setConnectedPeerId(''); stopAllMedia(); });
  }, []);

  const connect = () => {
    if (!peerRef.current || !targetId.trim()) return;
    setStatus('connecting');
    const conn = peerRef.current.connect(targetId.trim(), { reliable: true });
    conn.on('open', () => wireDataConnection(conn));
    conn.on('error', () => { setStatus('idle'); alert('Connection failed. Check the ID.'); });
  };

  const disconnectAll = () => {
    stopAllMedia();
    connRef.current?.close(); connRef.current = null;
    setStatus('idle'); setConnectedPeerId('');
  };

  // ─── Chat ──────────────────────────────────────────────────
  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!connRef.current || !input.trim()) return;
    connRef.current.send({ type: 'chat', text: input });
    setMessages(prev => [...prev, { sender: 'me', text: input, time: now() }]);
    setInput('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    connRef.current.send({ type: 'typing', isTyping: false });
    typingTimeoutRef.current = null;
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

  // ─── Media Helpers ─────────────────────────────────────────
  const handleIncomingCall = async (call: MediaConnection) => {
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          stream = new MediaStream();
        }
      }
      localStreamRef.current = stream;
      call.answer(stream);
      mediaConnRef.current = call;

      call.on('stream', (remoteStream: MediaStream) => {
        remoteStreamRef.current = remoteStream;
        // Try to assign now, useEffect will also handle it after mount
        if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = remoteStream; }
      });
      call.on('close', () => { stopAllMedia(); });

      // Set state LAST so useEffect can assign streams after video elements mount
      setCallActive(true);
      setActiveTab('video');
    } catch (err) {
      console.error('Failed to answer call:', err);
    }
  };

  const startVideoCall = async () => {
    if (!peerRef.current || !connectedPeerId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;

      const call = peerRef.current.call(connectedPeerId, stream);
      mediaConnRef.current = call;

      call.on('stream', (remoteStream: MediaStream) => {
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = remoteStream; }
      });
      call.on('close', () => { stopAllMedia(); });

      // Set state LAST so useEffect syncs streams after video elements mount
      setCallActive(true);
    } catch (err) {
      alert('Camera/Mic access denied. Please allow permissions.');
      console.error(err);
    }
  };

  const startScreenShare = async () => {
    if (!peerRef.current || !connectedPeerId) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      localStreamRef.current = stream;

      const call = peerRef.current.call(connectedPeerId, stream);
      mediaConnRef.current = call;

      stream.getVideoTracks()[0].addEventListener('ended', () => { stopAllMedia(); });

      call.on('stream', (remoteStream: MediaStream) => {
        remoteStreamRef.current = remoteStream;
        if (remoteVideoRef.current) { remoteVideoRef.current.srcObject = remoteStream; }
      });
      call.on('close', () => { stopAllMedia(); });

      // Set state LAST so useEffect syncs streams after video elements mount
      setScreenActive(true);
    } catch (err) {
      console.error('Screen share cancelled or denied:', err);
    }
  };

  const stopAllMedia = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    mediaConnRef.current?.close();
    mediaConnRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setCallActive(false);
    setScreenActive(false);
    setMicMuted(false);
    setCamOff(false);
  };

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicMuted(prev => !prev);
  };

  const toggleCam = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setCamOff(prev => !prev);
  };

  // ─── Status Helpers ────────────────────────────────────────
  const statusColor = status === 'connected' ? '#10b981' : status === 'connecting' ? '#f59e0b' : 'var(--text-muted)';
  const statusLabel = status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting...' : 'Disconnected';
  const isConnected = status === 'connected';

  // ─── Styles ────────────────────────────────────────────────
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
    ...btnPrimary, background: 'rgba(244,63,94,0.1)', color: '#f43f5e',
    border: '1px solid rgba(244,63,94,0.3)', boxShadow: 'none',
  };

  const tabBtn = (tab: ActiveTab): React.CSSProperties => ({
    flex: 1, padding: '0.625rem 0', borderRadius: '10px', border: 'none',
    background: activeTab === tab ? 'var(--bg-elevated)' : 'transparent',
    color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
    fontSize: '0.8125rem', fontWeight: activeTab === tab ? 600 : 500,
    fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
  });

  const mediaCtrlBtn = (active: boolean, color: string): React.CSSProperties => ({
    width: '44px', height: '44px', borderRadius: '50%', border: 'none',
    background: active ? `rgba(244,63,94,0.15)` : `rgba(255,255,255,0.06)`,
    color: active ? '#f43f5e' : color,
    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  // ─── Render ────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Connection Panel ─────────────────────────────────── */}
      <div style={{ ...card, padding: '1.5rem' }}>
        <div className="webrtc-connection-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* My ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={label}>Your Peer ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{
                flex: 1, padding: '0.625rem 0.875rem', borderRadius: '10px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: '#10b981', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace",
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'all',
                minWidth: 0,
              }}>
                {peerId || '● ● ● generating...'}
              </code>
              <button onClick={copyId} disabled={!peerId} style={{
                padding: '0.625rem', borderRadius: '10px', border: '1px solid var(--border)',
                background: copied ? 'rgba(16,185,129,0.15)' : 'var(--bg-elevated)',
                color: copied ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }} title="Copy ID">
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

          {/* Horizontal Divider */}
          <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

          {/* Right: Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={label}>Connect to Peer</span>
            <input
              type="text" value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Paste remote Peer ID"
              disabled={isConnected}
              style={{ ...inputStyle, opacity: isConnected ? 0.5 : 1 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, display: 'inline-block', boxShadow: isConnected ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                <span style={{ fontSize: '0.75rem', color: statusColor, fontWeight: 500 }}>{statusLabel}</span>
              </div>
              {isConnected ? (
                <button onClick={disconnectAll} style={btnDanger}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                >Disconnect</button>
              ) : (
                <button onClick={connect}
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

      {/* ── Tab Bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '0.375rem', padding: '0.375rem',
        background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
        opacity: isConnected ? 1 : 0.4, pointerEvents: isConnected ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}>
        <button onClick={() => setActiveTab('chat')} style={tabBtn('chat')}>
          💬 Chat
        </button>
        <button onClick={() => setActiveTab('video')} style={tabBtn('video')}>
          📹 Video Call
          {callActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />}
        </button>
        <button onClick={() => setActiveTab('screen')} style={tabBtn('screen')}>
          📺 Screen Share
          {screenActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />}
        </button>
      </div>

      {/* ── Content Area ─────────────────────────────────────── */}
      <div style={{
        transition: 'opacity 0.3s, filter 0.3s',
        opacity: isConnected ? 1 : 0.4,
        filter: isConnected ? 'none' : 'grayscale(0.6)',
        pointerEvents: isConnected ? 'auto' : 'none',
      }}>

        {/* ─── CHAT TAB ─────────────────────────────────────── */}
        {activeTab === 'chat' && (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', height: '480px' }}>
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
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Secure P2P Channel</p>
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

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', opacity: 0.4 }}>📡</div>
                  <p style={{ fontSize: '0.8125rem', textAlign: 'center', maxWidth: '260px', lineHeight: 1.5 }}>
                    {isConnected ? 'Connection established! Send your first message.' : 'Connect to a peer to begin chatting.'}
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start' }}>
                    {msg.sender === 'system' ? (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>{msg.text}</span>
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

            {/* Typing Indicator */}
            {isPeerTyping && (
              <div style={{ padding: '0 1.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <style>{`
                  @keyframes typingBlink { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
                  .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted); animation: typingBlink 1.4s infinite both; }
                  .typing-dot:nth-child(1) { animation-delay: 0s; }
                  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                `}</style>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>Peer is typing...</span>
              </div>
            )}

            {/* Input */}
            <form onSubmit={send} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={sendFile} />
              <button type="button" onClick={() => fileRef.current?.click()} style={{
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
              <input type="text" value={input} placeholder="Type a message..."
                onChange={(e) => {
                  setInput(e.target.value);
                  if (connRef.current) {
                    if (!typingTimeoutRef.current) {
                      connRef.current.send({ type: 'typing', isTyping: true });
                    } else {
                      clearTimeout(typingTimeoutRef.current);
                    }
                    typingTimeoutRef.current = setTimeout(() => {
                      connRef.current?.send({ type: 'typing', isTyping: false });
                      typingTimeoutRef.current = null;
                    }, 1500);
                  }
                }}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button type="submit" disabled={!input.trim()} style={{
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
        )}

        {/* ─── VIDEO CALL TAB ────────────────────────────────── */}
        {activeTab === 'video' && (
          <div style={{ ...card, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Video Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: callActive ? '1fr 1fr' : '1fr', gap: '1rem', minHeight: '320px' }}>
              {/* Remote Video (Main) */}
              <div style={{
                position: 'relative', borderRadius: '12px', overflow: 'hidden',
                background: '#000', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px',
              }}>
                <video ref={remoteVideoRef} autoPlay playsInline style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  display: callActive ? 'block' : 'none',
                }} />
                {!callActive && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                    }}>📹</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                      Start a video call to see your peer here
                    </p>
                    <button onClick={startVideoCall} style={{
                      ...btnPrimary,
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      padding: '0.75rem 2rem', fontSize: '0.875rem',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      📞 Start Video Call
                    </button>
                  </div>
                )}
                {callActive && (
                  <div style={{
                    position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                    padding: '0.25rem 0.625rem', borderRadius: '6px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    fontSize: '0.6875rem', color: '#fff', fontWeight: 500,
                  }}>Remote</div>
                )}
              </div>

              {/* Local Video (PiP) */}
              {callActive && (
                <div style={{
                  position: 'relative', borderRadius: '12px', overflow: 'hidden',
                  background: '#000', border: '1px solid var(--border)',
                }}>
                  <video ref={localVideoRef} autoPlay playsInline muted style={{
                    width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                    padding: '0.25rem 0.625rem', borderRadius: '6px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    fontSize: '0.6875rem', color: '#fff', fontWeight: 500,
                  }}>You</div>
                </div>
              )}
            </div>

            {/* Controls */}
            {callActive && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button onClick={toggleMic} style={mediaCtrlBtn(micMuted, 'var(--text-secondary)')} title={micMuted ? 'Unmute' : 'Mute'}>
                  {micMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .54-.06 1.07-.18 1.57"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  )}
                </button>
                <button onClick={toggleCam} style={mediaCtrlBtn(camOff, 'var(--text-secondary)')} title={camOff ? 'Turn On Camera' : 'Turn Off Camera'}>
                  {camOff ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  )}
                </button>
                <button onClick={stopAllMedia} style={{
                  ...mediaCtrlBtn(true, '#f43f5e'),
                  width: 'auto', borderRadius: '999px', padding: '0 1.25rem', gap: '0.375rem',
                  background: '#f43f5e', color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }} title="End Call">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
                  End
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── SCREEN SHARE TAB ──────────────────────────────── */}
        {activeTab === 'screen' && (
          <div style={{ ...card, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Screen Preview */}
            <div style={{
              position: 'relative', borderRadius: '12px', overflow: 'hidden',
              background: '#000', border: '1px solid var(--border)',
              minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* We show remoteVideoRef here for an incoming screen share */}
              <video ref={screenActive ? localVideoRef : remoteVideoRef} autoPlay playsInline muted={screenActive} style={{
                width: '100%', height: '100%', objectFit: 'contain',
                display: screenActive ? 'block' : 'none',
              }} />
              {!screenActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                  }}>📺</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', maxWidth: '300px' }}>
                    Share your screen with the connected peer. They'll see everything in real-time.
                  </p>
                  <button onClick={startScreenShare} style={{
                    ...btnPrimary,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.25)',
                    padding: '0.75rem 2rem', fontSize: '0.875rem',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    📺 Start Screen Share
                  </button>
                </div>
              )}
              {screenActive && (
                <div style={{
                  position: 'absolute', top: '0.75rem', left: '0.75rem',
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.375rem 0.75rem', borderRadius: '8px',
                  background: 'rgba(244,63,94,0.9)', backdropFilter: 'blur(4px)',
                  fontSize: '0.6875rem', color: '#fff', fontWeight: 600,
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />
                  LIVE — Sharing
                </div>
              )}
            </div>

            {/* Stop Button */}
            {screenActive && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={stopAllMedia} style={{
                  ...btnDanger, padding: '0.75rem 2rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
                  Stop Sharing
                </button>
              </div>
            )}
          </div>
        )}
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
            All data, video, and screen streams travel directly between browsers via WebRTC. Nothing is stored or relayed through any server.
          </p>
        </div>
      </div>

      {/* Animations + Responsive */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
