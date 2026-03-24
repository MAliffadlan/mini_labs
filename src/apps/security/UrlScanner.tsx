import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHORTENER_DOMAINS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'j.mp', 'rb.gy', 'cutt.ly', 'shorturl.at', 's.id', 'rebrand.ly', 'bl.ink', 'short.io', 'linktr.ee', 'clck.ru', 'lnkd.in', 'youtu.be'];
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.work', '.gq', '.ml', '.cf', '.ga', '.tk', '.buzz', '.monster', '.icu', '.cam', '.surf', '.rest'];
const PHISHING_PATTERNS = ['login', 'signin', 'verify', 'secure', 'update', 'confirm', 'account', 'banking', 'password', 'credential', 'wallet', 'suspend', 'urgent', 'alert', 'blocked'];
const LEGIT_DOMAINS_OFTEN_SPOOFED = ['google', 'facebook', 'apple', 'microsoft', 'paypal', 'amazon', 'netflix', 'instagram', 'whatsapp', 'telegram', 'bank', 'bca', 'bni', 'bri', 'mandiri', 'dana', 'gopay', 'ovo', 'shopee', 'tokopedia', 'bukalapak'];

interface AnalysisResult {
  url: string;
  parsedUrl: URL;
  isShortened: boolean;
  riskLevel: 'safe' | 'caution' | 'danger';
  riskScore: number;
  warnings: { icon: string; text: string; severity: 'info' | 'warn' | 'danger' }[];
  details: { label: string; value: string }[];
  resolvedUrl: string | null;
}

export default function UrlScanner() {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeUrl = async () => {
    setError('');
    setResult(null);
    let url = inputUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    setLoading(true);

    try {
      const parsed = new URL(url);
      const warnings: AnalysisResult['warnings'] = [];
      let riskScore = 0;

      // Check 1: Is it a shortened URL?
      const isShortened = SHORTENER_DOMAINS.some(d => parsed.hostname.includes(d));
      if (isShortened) {
        warnings.push({ icon: '🔗', text: `Shortened URL detected (${parsed.hostname}). The actual destination is hidden.`, severity: 'warn' });
        riskScore += 20;
      }

      // Check 2: Suspicious TLD
      const hasSusTLD = SUSPICIOUS_TLDS.some(tld => parsed.hostname.endsWith(tld));
      if (hasSusTLD) {
        warnings.push({ icon: '⚠️', text: `Suspicious top-level domain detected. These TLDs are commonly used for spam/phishing.`, severity: 'danger' });
        riskScore += 30;
      }

      // Check 3: IP address instead of domain
      const isIpAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname);
      if (isIpAddress) {
        warnings.push({ icon: '🚨', text: 'URL uses raw IP address instead of domain name. This is a major red flag for phishing!', severity: 'danger' });
        riskScore += 40;
      }

      // Check 4: HTTP (no SSL)
      if (parsed.protocol === 'http:') {
        warnings.push({ icon: '🔓', text: 'No SSL encryption (HTTP). Data sent to this site is NOT secure.', severity: 'warn' });
        riskScore += 15;
      }

      // Check 5: Phishing keywords in URL
      const urlLower = url.toLowerCase();
      const foundPhishingWords = PHISHING_PATTERNS.filter(p => urlLower.includes(p));
      if (foundPhishingWords.length > 0) {
        warnings.push({ icon: '🎣', text: `Suspicious keywords found in URL: "${foundPhishingWords.join('", "')}". Common in phishing attempts.`, severity: 'warn' });
        riskScore += foundPhishingWords.length * 10;
      }

      // Check 6: Domain spoofing (looks like legit brand but isn't)
      const hostname = parsed.hostname.toLowerCase();
      const spoofedBrands = LEGIT_DOMAINS_OFTEN_SPOOFED.filter(brand => {
        return hostname.includes(brand) && !hostname.endsWith(`${brand}.com`) && !hostname.endsWith(`${brand}.co.id`) && !hostname.endsWith(`${brand}.id`);
      });
      if (spoofedBrands.length > 0) {
        warnings.push({ icon: '🎭', text: `Possible brand impersonation! Contains "${spoofedBrands.join('", "')}" but domain doesn't match the official site.`, severity: 'danger' });
        riskScore += 35;
      }

      // Check 7: Excessive subdomains
      const subdomainCount = parsed.hostname.split('.').length - 2;
      if (subdomainCount >= 3) {
        warnings.push({ icon: '🌐', text: `Unusually many subdomains (${subdomainCount}). Often used to hide the real domain.`, severity: 'warn' });
        riskScore += 15;
      }

      // Check 8: Very long URL
      if (url.length > 200) {
        warnings.push({ icon: '📏', text: `Extremely long URL (${url.length} chars). Can be used to hide malicious parameters.`, severity: 'info' });
        riskScore += 10;
      }

      // Check 9: @ symbol in URL (credential injection)
      if (url.includes('@')) {
        warnings.push({ icon: '💉', text: 'URL contains "@" symbol. This can be used for credential injection to redirect to a different site!', severity: 'danger' });
        riskScore += 35;
      }

      // Check 10: Encoded characters
      const encodedChars = (url.match(/%[0-9a-fA-F]{2}/g) || []).length;
      if (encodedChars > 5) {
        warnings.push({ icon: '🔣', text: `Heavy URL encoding detected (${encodedChars} encoded characters). Could be obfuscating the real destination.`, severity: 'warn' });
        riskScore += 15;
      }

      riskScore = Math.min(riskScore, 100);

      if (warnings.length === 0) {
        warnings.push({ icon: '✅', text: 'No obvious red flags detected. This URL appears to be clean.', severity: 'info' });
      }

      const riskLevel: AnalysisResult['riskLevel'] = riskScore >= 50 ? 'danger' : riskScore >= 20 ? 'caution' : 'safe';

      // Try to resolve shortened URL
      let resolvedUrl: string | null = null;
      if (isShortened) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
          const res = await fetch(proxyUrl, { method: 'HEAD', redirect: 'follow' });
          if (res.url && res.url !== proxyUrl) {
            resolvedUrl = res.url;
          }
        } catch {
          // Proxy failed, not a big deal
        }
      }

      const details = [
        { label: 'Protocol', value: parsed.protocol.replace(':', '') },
        { label: 'Hostname', value: parsed.hostname },
        { label: 'Port', value: parsed.port || '(default)' },
        { label: 'Path', value: parsed.pathname || '/' },
        { label: 'Query Params', value: parsed.search || '(none)' },
        { label: 'Fragment', value: parsed.hash || '(none)' },
      ];

      setResult({ url, parsedUrl: parsed, isShortened, riskLevel, riskScore, warnings, details, resolvedUrl });
    } catch (err) {
      setError('Invalid URL. Please enter a valid URL (e.g. https://example.com)');
    } finally {
      setLoading(false);
    }
  };

  const riskColors = { safe: '#10b981', caution: '#f59e0b', danger: '#ef4444' };
  const riskLabels = { safe: '✅ LOW RISK', caution: '⚠️ MEDIUM RISK', danger: '🚨 HIGH RISK' };

  return (
    <div>
      {/* Input */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
          placeholder="Paste a suspicious URL here (e.g. bit.ly/xxx...)"
          style={{
            flex: 1, minWidth: '250px', padding: '0.875rem 1.25rem', borderRadius: '14px',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: '#fff', fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace",
            outline: 'none',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={analyzeUrl}
          disabled={loading}
          style={{
            padding: '0.875rem 2rem', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
            fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
          }}
        >{loading ? '🔍 Scanning...' : '🛡️ Scan URL'}</motion.button>
      </div>

      {error && (
        <div style={{ padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Risk Score Card */}
            <div style={{
              textAlign: 'center', padding: '2rem', borderRadius: '20px', marginBottom: '1.5rem',
              background: `linear-gradient(135deg, ${riskColors[result.riskLevel]}15, ${riskColors[result.riskLevel]}08)`,
              border: `1px solid ${riskColors[result.riskLevel]}30`,
            }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: riskColors[result.riskLevel], fontFamily: "'Outfit', sans-serif" }}>
                {result.riskScore}/100
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: riskColors[result.riskLevel], marginTop: '0.25rem' }}>
                {riskLabels[result.riskLevel]}
              </div>
              {result.resolvedUrl && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', display: 'inline-block' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>🔗 Resolved Destination:</p>
                  <p style={{ color: '#fff', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace", margin: 0, wordBreak: 'break-all' }}>{result.resolvedUrl}</p>
                </div>
              )}
            </div>

            {/* Warnings */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                  🔍 Security Analysis ({result.warnings.length} findings)
                </h3>
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                {result.warnings.map((w, i) => (
                  <div key={i} style={{
                    padding: '0.75rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    borderBottom: i < result.warnings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: w.severity === 'danger' ? 'rgba(239,68,68,0.04)' : w.severity === 'warn' ? 'rgba(245,158,11,0.04)' : 'transparent',
                  }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{w.icon}</span>
                    <span style={{
                      color: w.severity === 'danger' ? '#f87171' : w.severity === 'warn' ? '#fbbf24' : 'var(--text-secondary)',
                      fontSize: '0.875rem', lineHeight: 1.5,
                    }}>{w.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* URL Breakdown */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                  📋 URL Breakdown
                </h3>
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                {result.details.map((d, i) => (
                  <div key={d.label} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '0.625rem 1.25rem',
                    borderBottom: i < result.details.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{d.label}</span>
                    <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !error && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Paste any suspicious URL to scan it</p>
          <p style={{ fontSize: '0.875rem' }}>Detects phishing, brand impersonation, URL shortener traps, and 10+ red flags.</p>
        </div>
      )}
    </div>
  );
}
