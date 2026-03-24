import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Known databases ── */
const SHORTENER_DOMAINS = ['bit.ly','tinyurl.com','goo.gl','t.co','ow.ly','is.gd','buff.ly','j.mp','rb.gy','cutt.ly','shorturl.at','s.id','rebrand.ly','bl.ink','short.io','linktr.ee','clck.ru','lnkd.in','youtu.be','v.gd','soo.gd','tny.im'];
const SUSPICIOUS_TLDS = ['.xyz','.top','.club','.work','.gq','.ml','.cf','.ga','.tk','.buzz','.monster','.icu','.cam','.surf','.rest','.uno','.best','.sbs','.cfd','.autos','.boats'];
const PHISHING_KEYWORDS = ['login','signin','sign-in','verify','secure','update','confirm','account','banking','password','credential','wallet','suspend','urgent','alert','blocked','expire','renew','invoice','payment','refund','prize','winner','lucky','claim'];
const SPOOFABLE_BRANDS = ['google','facebook','apple','microsoft','paypal','amazon','netflix','instagram','whatsapp','telegram','twitter','linkedin','youtube','tiktok','shopee','tokopedia','bukalapak','gojek','grab','dana','gopay','ovo','bca','bni','bri','mandiri','cimb','permata','jenius'];
const MALWARE_EXTENSIONS = ['.exe','.bat','.cmd','.scr','.pif','.msi','.jar','.vbs','.js','.ps1','.apk','.dmg','.iso'];

interface Finding {
  id: string;
  icon: string;
  title: string;
  detail: string;
  severity: 'clean' | 'info' | 'warning' | 'danger';
  points: number;
}

interface ScanResult {
  url: string;
  parsed: URL;
  score: number;
  findings: Finding[];
  urlParts: { label: string; value: string; color?: string }[];
  stats: { clean: number; info: number; warning: number; danger: number };
  resolvedUrl: string | null;
  httpInfo: { label: string; value: string }[] | null;
}

type Tab = 'detection' | 'details' | 'community';

/* ── Circular Gauge SVG ── */
function RiskGauge({ score, size = 180 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  const offset = circumference * (1 - pct);
  const color = score >= 60 ? '#ef4444' : score >= 30 ? '#f59e0b' : '#10b981';
  const label = score >= 60 ? 'HIGH RISK' : score >= 30 ? 'SUSPICIOUS' : 'CLEAN';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
          style={{ fontSize: '2.5rem', fontWeight: 900, color, fontFamily: "'Outfit', sans-serif" }}
        >{score}</motion.span>
        <span style={{ fontSize: '0.625rem', fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '2px' }}>/100</span>
      </div>
    </div>
  );
}

export default function UrlScanner() {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('detection');

  const scan = async () => {
    setError(''); setResult(null);
    let url = inputUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    setLoading(true);

    try {
      const parsed = new URL(url);
      const findings: Finding[] = [];
      let totalPoints = 0;

      const addFinding = (f: Omit<Finding, 'id'>) => {
        findings.push({ ...f, id: `f${findings.length}` });
        totalPoints += f.points;
      };

      const hostname = parsed.hostname.toLowerCase();
      const fullUrl = url.toLowerCase();
      const path = parsed.pathname.toLowerCase();

      // ═══════════ SECURITY CHECKS ═══════════

      // 1. Protocol
      if (parsed.protocol === 'http:') {
        addFinding({ icon: '🔓', title: 'No SSL/TLS Encryption', detail: 'This URL uses HTTP instead of HTTPS. All data sent to this site (including passwords) can be intercepted by attackers on the same network.', severity: 'danger', points: 20 });
      } else {
        addFinding({ icon: '🔒', title: 'SSL/TLS Encrypted', detail: 'This URL uses HTTPS with SSL/TLS encryption. Data in transit is encrypted.', severity: 'clean', points: 0 });
      }

      // 2. URL Shortener
      const isShortened = SHORTENER_DOMAINS.some(d => hostname.includes(d));
      if (isShortened) {
        addFinding({ icon: '🔗', title: 'URL Shortener Detected', detail: `This URL uses a shortening service (${hostname}). The actual destination is hidden and could lead anywhere — including malicious sites. Never enter credentials after clicking shortened links.`, severity: 'warning', points: 20 });
      }

      // 3. Suspicious TLD
      const matchedTLD = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
      if (matchedTLD) {
        addFinding({ icon: '🌐', title: `Suspicious TLD: ${matchedTLD}`, detail: `The top-level domain "${matchedTLD}" is statistically associated with high volumes of spam, phishing, and malware distribution. Legitimate businesses rarely use these domains.`, severity: 'danger', points: 25 });
      }

      // 4. Raw IP Address
      const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
      if (isIp) {
        addFinding({ icon: '🖥️', title: 'Raw IP Address (No Domain)', detail: 'This URL points to a raw IP address instead of a domain name. Legitimate websites almost always use domain names. This is a strong indicator of phishing, temporary malware hosting, or C2 server.', severity: 'danger', points: 35 });
      }

      // 5. Phishing keywords
      const foundKeywords = PHISHING_KEYWORDS.filter(kw => fullUrl.includes(kw));
      if (foundKeywords.length >= 3) {
        addFinding({ icon: '🎣', title: `Multiple Phishing Keywords (${foundKeywords.length})`, detail: `Found suspicious keywords: "${foundKeywords.slice(0, 5).join('", "')}". Having multiple credential/urgency keywords in one URL is a hallmark of phishing campaigns.`, severity: 'danger', points: 30 });
      } else if (foundKeywords.length > 0) {
        addFinding({ icon: '🎣', title: `Phishing Keywords Found`, detail: `Contains keywords commonly used in phishing: "${foundKeywords.join('", "')}".`, severity: 'warning', points: 10 * foundKeywords.length });
      }

      // 6. Brand impersonation
      const spoofed = SPOOFABLE_BRANDS.filter(brand => {
        if (!hostname.includes(brand)) return false;
        const officialSuffixes = [`${brand}.com`, `${brand}.co.id`, `${brand}.id`, `${brand}.org`, `${brand}.net`];
        return !officialSuffixes.some(s => hostname === s || hostname.endsWith(`.${s}`));
      });
      if (spoofed.length > 0) {
        addFinding({ icon: '🎭', title: `Brand Impersonation: ${spoofed.join(', ')}`, detail: `This URL contains the name of well-known brand(s) but uses a different domain. This is a classic technique to trick users into thinking they're on the official site. Examples: "google-verify.tk", "paypal-secure.xyz".`, severity: 'danger', points: 35 });
      }

      // 7. @ sign (URL authority confusion)
      if (url.includes('@') && url.indexOf('@') < url.indexOf('/', 8)) {
        addFinding({ icon: '💉', title: 'Credential Injection (@)', detail: 'This URL contains an "@" symbol before the domain path. In URLs, everything before @ is treated as user credentials, meaning the ACTUAL destination is what comes AFTER the @. Example: "https://google.com@evil.com" actually goes to evil.com!', severity: 'danger', points: 40 });
      }

      // 8. Subdomain abuse
      const subdomainCount = hostname.split('.').length - 2;
      if (subdomainCount >= 4) {
        addFinding({ icon: '📡', title: `Excessive Subdomains (${subdomainCount} levels)`, detail: 'An unusually high number of subdomains is often used to push the real domain out of the visible address bar area, hiding the actual destination from users.', severity: 'danger', points: 20 });
      } else if (subdomainCount >= 3) {
        addFinding({ icon: '📡', title: `Many Subdomains (${subdomainCount} levels)`, detail: 'Multiple subdomains can be used to obfuscate the real domain. Check the last two segments carefully.', severity: 'warning', points: 10 });
      }

      // 9. Encoded characters
      const encodedCount = (url.match(/%[0-9a-fA-F]{2}/g) || []).length;
      if (encodedCount > 8) {
        addFinding({ icon: '🔣', title: `Heavy URL Encoding (${encodedCount} encoded chars)`, detail: 'Excessive URL encoding (percent-encoding) is used to obfuscate the real content of the URL, hiding malicious paths or parameters from casual inspection.', severity: 'warning', points: 15 });
      }

      // 10. Extremely long URL
      if (url.length > 300) {
        addFinding({ icon: '📏', title: `Extremely Long URL (${url.length} chars)`, detail: 'Very long URLs are commonly used to hide malicious payloads or confuse users. Legitimate URLs rarely exceed 200 characters.', severity: 'warning', points: 10 });
      } else if (url.length > 150) {
        addFinding({ icon: '📏', title: `Long URL (${url.length} chars)`, detail: 'This URL is longer than typical URLs. While not necessarily dangerous, it warrants closer inspection.', severity: 'info', points: 5 });
      }

      // 11. Suspicious file extension
      const matchedExt = MALWARE_EXTENSIONS.find(ext => path.endsWith(ext));
      if (matchedExt) {
        addFinding({ icon: '☠️', title: `Executable File: ${matchedExt}`, detail: `This URL points directly to an executable/installer file (${matchedExt}). Downloading and running files from unknown sources is extremely dangerous and can install malware on your device.`, severity: 'danger', points: 40 });
      }

      // 12. Data URI
      if (url.startsWith('data:')) {
        addFinding({ icon: '⚠️', title: 'Data URI Scheme', detail: 'Data URIs embed content directly in the URL. They can be used to deliver malicious payloads without making a network request, bypassing some security filters.', severity: 'danger', points: 35 });
      }

      // 13. Port number
      if (parsed.port && !['80', '443', '8080'].includes(parsed.port)) {
        addFinding({ icon: '🚪', title: `Non-Standard Port: ${parsed.port}`, detail: `This URL uses port ${parsed.port}, which is unusual for web traffic. Legitimate websites typically use port 80 (HTTP) or 443 (HTTPS). Custom ports may indicate a temporary/test server.`, severity: 'warning', points: 10 });
      }

      // 14. Punycode / IDN homograph
      if (hostname.startsWith('xn--')) {
        addFinding({ icon: '🔤', title: 'Internationalized Domain (Punycode/IDN)', detail: 'This domain uses internationalized characters (Punycode). Attackers use lookalike characters from different alphabets (e.g., Cyrillic "а" vs Latin "a") to create domains that appear identical to legitimate ones.', severity: 'danger', points: 30 });
      }

      // 15. Double extensions
      if (/\.[a-z]{2,4}\.[a-z]{2,4}$/.test(path) && !path.endsWith('.co.id') && !path.endsWith('.com.br')) {
        addFinding({ icon: '📎', title: 'Double File Extension', detail: 'This URL path contains what appears to be a double file extension (e.g., "document.pdf.exe"). This technique is used to disguise executable files as harmless documents.', severity: 'warning', points: 15 });
      }

      // If nothing bad found
      if (findings.every(f => f.severity === 'clean' || f.severity === 'info')) {
        addFinding({ icon: '✅', title: 'No Major Threats Detected', detail: 'This URL passed all heuristic checks. However, this does not guarantee the site is safe — always exercise caution with unfamiliar websites.', severity: 'clean', points: 0 });
      }

      const score = Math.min(totalPoints, 100);
      const stats = {
        clean: findings.filter(f => f.severity === 'clean').length,
        info: findings.filter(f => f.severity === 'info').length,
        warning: findings.filter(f => f.severity === 'warning').length,
        danger: findings.filter(f => f.severity === 'danger').length,
      };

      // Resolve shortened URLs
      let resolvedUrl: string | null = null;
      if (isShortened) {
        try {
          const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
          const res = await fetch(proxy, { method: 'HEAD', redirect: 'follow' });
          if (res.url && res.url !== proxy) resolvedUrl = res.url;
        } catch {}
      }

      // Fetch HTTP headers
      let httpInfo: ScanResult['httpInfo'] = null;
      try {
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxy);
        if (res.ok) {
          const data = await res.json();
          httpInfo = [
            { label: 'Status Code', value: String(data.status?.http_code || 'N/A') },
            { label: 'Content Type', value: data.status?.content_type || 'N/A' },
            { label: 'Content Length', value: data.status?.content_length ? `${(data.status.content_length / 1024).toFixed(1)} KB` : 'N/A' },
            { label: 'Response URL', value: data.status?.url || url },
          ];
        }
      } catch {}

      const urlParts = [
        { label: 'Protocol', value: parsed.protocol.replace(':', '').toUpperCase(), color: parsed.protocol === 'https:' ? '#10b981' : '#ef4444' },
        { label: 'Hostname', value: parsed.hostname },
        { label: 'Port', value: parsed.port || (parsed.protocol === 'https:' ? '443' : '80') },
        { label: 'Path', value: parsed.pathname || '/' },
        { label: 'Query', value: parsed.search || '(none)' },
        { label: 'Fragment', value: parsed.hash || '(none)' },
      ];

      setResult({ url, parsed, score, findings, urlParts, stats, resolvedUrl, httpInfo });
    } catch {
      setError('Invalid URL format. Please enter a valid URL.');
    } finally {
      setLoading(false);
    }
  };

  const sevColors = { clean: '#10b981', info: '#3b82f6', warning: '#f59e0b', danger: '#ef4444' };
  const sevIcons = { clean: '✓', info: 'ℹ', warning: '!', danger: '✕' };

  return (
    <div>
      {/* Search Bar */}
      <div style={{
        display: 'flex', gap: '0', marginBottom: '2rem',
        background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '1.25rem' }}>🔍</div>
        <input value={inputUrl} onChange={e => setInputUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && scan()}
          placeholder="Search or scan a URL (e.g. bit.ly/suspicious-link)"
          style={{
            flex: 1, padding: '1rem 0', border: 'none', background: 'transparent',
            color: '#fff', fontSize: '1rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none',
          }}
        />
        <motion.button whileHover={{ backgroundColor: 'rgba(59,130,246,0.9)' }} whileTap={{ scale: 0.97 }}
          onClick={scan} disabled={loading}
          style={{
            padding: '1rem 2rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: '#3b82f6', color: '#fff', fontSize: '0.9375rem', fontWeight: 700,
          }}
        >{loading ? 'Scanning...' : 'Scan'}</motion.button>
      </div>

      {error && <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', marginBottom: '1.5rem' }}>⚠️ {error}</div>}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* ── Top Stats Row ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem',
              padding: '2rem', borderRadius: '20px', marginBottom: '1.5rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <RiskGauge score={result.score} />
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Scanned URL</p>
                <p style={{ color: '#fff', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all', marginBottom: '1.25rem', lineHeight: 1.5 }}>{result.url}</p>

                {result.resolvedUrl && (
                  <div style={{ padding: '0.625rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', marginBottom: '1rem' }}>
                    <span style={{ color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>🔗 Resolved Destination: </span>
                    <span style={{ color: '#fff', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all' }}>{result.resolvedUrl}</span>
                  </div>
                )}

                {/* Detection Summary Chips */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {(['danger', 'warning', 'info', 'clean'] as const).map(sev => (
                    result.stats[sev] > 0 && (
                      <div key={sev} style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                        background: `${sevColors[sev]}15`, color: sevColors[sev], border: `1px solid ${sevColors[sev]}30`,
                      }}>
                        <span>{sevIcons[sev]}</span>
                        <span>{result.stats[sev]} {sev === 'clean' ? 'Clean' : sev === 'info' ? 'Info' : sev === 'warning' ? 'Warning' : 'Danger'}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {([
                { key: 'detection' as Tab, label: '🛡️ Detection', count: result.findings.length },
                { key: 'details' as Tab, label: '📋 Details', count: result.urlParts.length },
                { key: 'community' as Tab, label: '🌐 HTTP Info', count: result.httpInfo?.length || 0 },
              ]).map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{
                    flex: 1, padding: '0.875rem', border: 'none', cursor: 'pointer',
                    fontSize: '0.8125rem', fontWeight: 600,
                    background: tab === t.key ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: tab === t.key ? '#60a5fa' : 'var(--text-secondary)',
                    borderBottom: tab === t.key ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >{t.label} <span style={{ opacity: 0.6 }}>({t.count})</span></button>
              ))}
            </div>

            {/* ── Tab Content: Detection ── */}
            {tab === 'detection' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {result.findings.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '14px',
                      background: `${sevColors[f.severity]}06`, border: `1px solid ${sevColors[f.severity]}15`,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: `${sevColors[f.severity]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.875rem', color: sevColors[f.severity], fontWeight: 800,
                    }}>{sevIcons[f.severity]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 700 }}>{f.icon} {f.title}</span>
                        {f.points > 0 && <span style={{ color: sevColors[f.severity], fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: `${sevColors[f.severity]}15` }}>+{f.points} pts</span>}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6, margin: 0 }}>{f.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Tab Content: Details ── */}
            {tab === 'details' && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                {result.urlParts.map((p, i) => (
                  <div key={p.label} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1.25rem',
                    borderBottom: i < result.urlParts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>{p.label}</span>
                    <span style={{ color: p.color || '#fff', fontSize: '0.875rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', maxWidth: '65%', wordBreak: 'break-all' }}>{p.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab Content: HTTP Info ── */}
            {tab === 'community' && (
              result.httpInfo ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                  {result.httpInfo.map((h, i) => (
                    <div key={h.label} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1.25rem',
                      borderBottom: i < result.httpInfo!.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>{h.label}</span>
                      <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', maxWidth: '65%', wordBreak: 'break-all' }}>{h.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <p>HTTP information could not be retrieved for this URL.</p>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !error && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Analyse suspicious URLs</p>
          <p style={{ fontSize: '0.9375rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Paste any link to scan it against <strong>15 security heuristics</strong> including phishing detection, brand impersonation, malware extensions, IDN homograph attacks, and more.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            {['URL', 'Domain', 'IP Address'].map(type => (
              <div key={type} style={{ padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                {type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
