import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IpData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  currency: string;
  currency_name: string;
  languages: string;
  asn: string;
  org: string;
}

export default function IpInfo() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    setUserAgent(navigator.userAgent);

    const fetchIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError('Unable to retrieve IP information. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchIp();
  }, []);

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch {}
  };

  const getBrowserInfo = () => {
    const ua = userAgent;
    if (ua.includes('Firefox')) return '🦊 Firefox';
    if (ua.includes('Edg')) return '🌐 Microsoft Edge';
    if (ua.includes('Chrome')) return '🌐 Google Chrome';
    if (ua.includes('Safari')) return '🍎 Safari';
    if (ua.includes('Opera') || ua.includes('OPR')) return '🔴 Opera';
    return '🌐 Unknown';
  };

  const getOsInfo = () => {
    const ua = userAgent;
    if (ua.includes('Windows NT 10')) return '🪟 Windows 10/11';
    if (ua.includes('Windows')) return '🪟 Windows';
    if (ua.includes('Mac OS X')) return '🍎 macOS';
    if (ua.includes('Android')) return '🤖 Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return '📱 iOS';
    if (ua.includes('Linux')) return '🐧 Linux';
    return '💻 Unknown';
  };

  const getDeviceType = () => {
    const ua = userAgent;
    if (ua.includes('Mobile') || ua.includes('Android')) return '📱 Mobile';
    if (ua.includes('Tablet') || ua.includes('iPad')) return '📱 Tablet';
    return '💻 Desktop';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#8b5cf6', borderRadius: '50%' }}
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Detecting your network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(239,68,68,0.05)', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.15)' }}>
        <p style={{ color: '#f87171', fontSize: '1.125rem', fontWeight: 600 }}>⚠️ {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const sections = [
    {
      title: '🌐 Network',
      color: '#3b82f6',
      items: [
        { label: 'IP Address', value: data.ip, highlight: true },
        { label: 'ISP / Organization', value: data.org || 'N/A' },
        { label: 'ASN', value: data.asn || 'N/A' },
      ]
    },
    {
      title: '📍 Location',
      color: '#10b981',
      items: [
        { label: 'City', value: data.city || 'N/A' },
        { label: 'Region', value: data.region || 'N/A' },
        { label: 'Country', value: `${data.country_name || 'N/A'} (${data.country_code || ''})` },
        { label: 'Postal Code', value: data.postal || 'N/A' },
        { label: 'Coordinates', value: `${data.latitude?.toFixed(4)}, ${data.longitude?.toFixed(4)}` },
      ]
    },
    {
      title: '🕐 Time & Currency',
      color: '#f59e0b',
      items: [
        { label: 'Timezone', value: data.timezone || 'N/A' },
        { label: 'UTC Offset', value: data.utc_offset || 'N/A' },
        { label: 'Currency', value: `${data.currency_name || 'N/A'} (${data.currency || ''})` },
        { label: 'Languages', value: data.languages || 'N/A' },
      ]
    },
    {
      title: '💻 Device',
      color: '#8b5cf6',
      items: [
        { label: 'Browser', value: getBrowserInfo() },
        { label: 'Operating System', value: getOsInfo() },
        { label: 'Device Type', value: getDeviceType() },
        { label: 'Screen', value: typeof window !== 'undefined' ? `${window.screen.width}×${window.screen.height}` : 'N/A' },
      ]
    },
  ];

  return (
    <div>
      {/* Big IP Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.08))',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Your Public IP Address</p>
        <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          onClick={() => copyValue('IP', data.ip)}
          style={{
            fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.75rem 0', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >{data.ip}</motion.h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          {copied === 'IP' ? '✓ Copied!' : 'Click to copy'}
        </p>
        {data.city && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.75rem' }}>
            📍 {data.city}, {data.region}, {data.country_name}
          </p>
        )}
      </motion.div>

      {/* Map */}
      {data.latitude && data.longitude && (
        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '2rem', height: '250px' }}>
          <iframe
            title="Your Location"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.longitude - 0.05}%2C${data.latitude - 0.05}%2C${data.longitude + 0.05}%2C${data.latitude + 0.05}&layer=mapnik&marker=${data.latitude}%2C${data.longitude}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      )}

      {/* Info Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {sections.map((section, si) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}
          >
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: section.color, fontFamily: "'Outfit', sans-serif" }}>
                {section.title}
              </h3>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {section.items.map((item, i) => (
                <div key={item.label}
                  onClick={() => copyValue(item.label, item.value)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.625rem 1.25rem', cursor: 'pointer',
                    borderBottom: i < section.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{item.label}</span>
                  <span style={{
                    color: item.highlight ? '#a78bfa' : '#fff', fontSize: '0.875rem',
                    fontWeight: item.highlight ? 700 : 500,
                    fontFamily: item.highlight ? "'JetBrains Mono', monospace" : 'inherit',
                  }}>
                    {copied === item.label ? '✓ Copied' : item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
