/**
 * ApiTester.tsx — Mini Postman for REST API Testing
 * Features: Methods, URL, Headers, Body, Response, Status, Latency
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoSave } from '../../hooks/useAutoSave';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HeaderItem {
  key: string;
  value: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  data: string;
  headers: Record<string, string>;
}

export default function ApiTester() {
  const [method, setMethod] = useAutoSave<HttpMethod>('api-tester-method', 'GET');
  const [url, setUrl] = useAutoSave('api-tester-url', 'https://jsonplaceholder.typicode.com/todos/1');
  const [headers, setHeaders] = useAutoSave<HeaderItem[]>('api-tester-headers', [{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useAutoSave('api-tester-body', '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  
  const [activeReqTab, setActiveReqTab] = useState<'Headers' | 'Body'>('Headers');
  const [activeResTab, setActiveResTab] = useState<'Body' | 'Headers'>('Body');
  
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendRequest = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse(null);

    const startTime = performance.now();

    try {
      // Build Headers object from array
      const reqHeaders: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key.trim()) {
          reqHeaders[h.key.trim()] = h.value.trim();
        }
      });

      const fetchOptions: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        fetchOptions.body = body;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = performance.now();

      // Read response body as text
      const textData = await res.text();
      
      // Try formatting if JSON
      let formattedData = textData;
      try {
        const json = JSON.parse(textData);
        formattedData = JSON.stringify(json, null, 2);
      } catch (e) {
        // Not JSON, keep raw text
      }

      // Read response headers
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        timeMs: Math.round(endTime - startTime),
        data: formattedData,
        headers: resHeaders
      });

    } catch (err: any) {
      setError(err.message || 'Failed to fetch. Network error or CORS issue.');
    } finally {
      setIsLoading(false);
    }
  }, [url, method, headers, body]);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  
  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    setHeaders(newHeaders);
  };
  
  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const statusColor = response ? (response.status < 300 ? '#10b981' : response.status < 400 ? '#3b82f6' : response.status < 500 ? '#f59e0b' : '#ef4444') : 'var(--text-muted)';

  const leftPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
        {['Headers', 'Body'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveReqTab(tab as any)}
            style={{
              padding: '0.75rem 1.5rem', background: 'transparent', border: 'none',
              color: activeReqTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeReqTab === tab ? 'var(--accent-blue)' : 'transparent'}`,
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {tab}
            {tab === 'Headers' && <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.375rem', borderRadius: '12px', fontSize: '0.6875rem' }}>{headers.length}</span>}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {activeReqTab === 'Headers' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <AnimatePresence>
              {headers.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input value={h.key} onChange={(e) => updateHeader(i, 'key', e.target.value)} placeholder="Key" style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none' }} />
                  <input value={h.value} onChange={(e) => updateHeader(i, 'value', e.target.value)} placeholder="Value" style={{ flex: 2, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none' }} />
                  <button onClick={() => removeHeader(i)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px' }} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={addHeader} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Header
            </button>
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="{\n  // Request JSON payload\n}"
            spellCheck={false}
            style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'none' }}
            disabled={['GET', 'DELETE'].includes(method)}
          />
        )}
      </div>
    </div>
  );

  const rightPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
      {error ? (
        <div style={{ padding: '2rem', color: '#ef4444', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(239, 68, 68, 0.05)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {error}
        </div>
      ) : !response ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Hit Send to get a response
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
            {['Body', 'Headers'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveResTab(tab as any)}
                style={{
                  padding: '0.75rem 1.5rem', background: 'transparent', border: 'none',
                  color: activeResTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${activeResTab === tab ? 'var(--accent-purple)' : 'transparent'}`,
                  fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {tab}
                {tab === 'Headers' && <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.375rem', borderRadius: '12px', fontSize: '0.6875rem' }}>{Object.keys(response.headers).length}</span>}
              </button>
            ))}
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {activeResTab === 'Body' ? (
              <textarea
                readOnly
                value={response.data}
                spellCheck={false}
                style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none', resize: 'none' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>{key}:</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace", flex: 2, wordBreak: 'break-all' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      
      {/* Top Bar: Method + URL + Send */}
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'stretch' }}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          style={{
            padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)', color: method === 'GET' ? '#10b981' : method === 'POST' ? '#3b82f6' : method === 'DELETE' ? '#ef4444' : '#f59e0b',
            fontSize: '0.875rem', fontWeight: 700, outline: 'none', appearance: 'none', cursor: 'pointer',
            minWidth: '100px', textAlign: 'center'
          }}
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/v1/users"
          style={{
            flex: 1, padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
            fontSize: '0.9375rem', fontFamily: "'JetBrains Mono', monospace", outline: 'none', transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--text-secondary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
          onKeyDown={e => e.key === 'Enter' && sendRequest()}
        />
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={sendRequest}
          disabled={isLoading}
          style={{
            padding: '0 1.5rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            color: '#fff', fontSize: '0.9375rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          {isLoading ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
          Send
        </motion.button>
      </div>

      <SplitView
        leftTitle="Request"
        rightTitle="Response"
        leftContent={leftPanel}
        rightContent={rightPanel}
        rightActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {response && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: statusColor, fontWeight: 700 }}>{response.status} {response.statusText}</span>
                <span style={{ color: 'var(--text-muted)' }}>{response.timeMs} ms</span>
              </div>
            )}
            {response?.data && <CopyButton text={response.data} />}
          </div>
        }
      />
    </div>
  );
}
