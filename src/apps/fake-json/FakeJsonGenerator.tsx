import React, { useState, useEffect, useCallback } from 'react';
import SplitView from '../../components/SplitView';
import CopyButton from '../../components/CopyButton';

// --- Data Dictionaries ---
const FIRST_NAMES = ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Budi", "Siti", "Agus", "Ayu", "Putra"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Saputra", "Wijaya", "Kusuma", "Lestari", "Setiawan"];
const DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com", "company.net", "tech.io", "startup.co"];
const JOB_TITLES = ["Software Engineer", "Product Manager", "Data Scientist", "UI/UX Designer", "Marketing Director", "Sales Representative", "HR Manager", "Financial Analyst", "DevOps Engineer", "Customer Support", "CEO", "CTO"];
const COMPANIES = ["TechNova", "GlobalCorp", "InnoSystems", "Alpha Solutions", "Beta Technologies", "CyberDyne", "MegaCorp", "Stark Industries", "Wayne Enterprises", "Acme Corp"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Brazil", "India", "Indonesia", "Singapore", "Netherlands"];
const STREETS = ["Main St", "Oak Ave", "Pine Ln", "Maple Blvd", "Cedar Rd", "Elm St", "Washington St", "Lakeview Dr"];
const CITIES = ["New York", "London", "Tokyo", "Jakarta", "Sydney", "Berlin", "Paris", "Toronto", "Mumbai", "Singapore"];

// --- Helpers ---
const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randBool = () => Math.random() > 0.5;
const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);return v.toString(16);});
const randDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

interface GeneratorOptions {
  id: boolean;
  firstName: boolean;
  lastName: boolean;
  fullName: boolean;
  email: boolean;
  phone: boolean;
  jobTitle: boolean;
  company: boolean;
  address: boolean;
  country: boolean;
  avatarUrl: boolean;
  createdAt: boolean;
  isActive: boolean;
  price: boolean;
}

const DEFAULT_OPTIONS: GeneratorOptions = {
  id: true,
  firstName: true,
  lastName: true,
  fullName: false,
  email: true,
  phone: false,
  jobTitle: true,
  company: false,
  address: false,
  country: false,
  avatarUrl: false,
  createdAt: false,
  isActive: false,
  price: false
};

const FIELD_LABELS: Record<keyof GeneratorOptions, string> = {
  id: "ID (UUIDv4)",
  firstName: "First Name",
  lastName: "Last Name",
  fullName: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  jobTitle: "Job Title",
  company: "Company Name",
  address: "Address",
  country: "Country",
  avatarUrl: "Avatar URL",
  createdAt: "Created At (ISO Date)",
  isActive: "Is Active (Boolean)",
  price: "Price (Number)"
};

export default function FakeJsonGenerator() {
  const [rowCount, setRowCount] = useState(50);
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateData = useCallback(() => {
    setIsGenerating(true);
    
    // Use setTimeout to allow UI to show loading state if massive rowCount
    setTimeout(() => {
      const data = [];
      const count = Math.min(Math.max(1, rowCount), 10000); // hard limit 10k

      for (let i = 0; i < count; i++) {
        const item: Record<string, any> = {};
        
        const fName = rand(FIRST_NAMES);
        const lName = rand(LAST_NAMES);

        if (options.id) item.id = uuidv4();
        if (options.firstName) item.firstName = fName;
        if (options.lastName) item.lastName = lName;
        if (options.fullName) item.fullName = `${fName} ${lName}`;
        
        if (options.email) {
          const cleanF = fName.toLowerCase().replace(/[^a-z]/g, '');
          const cleanL = lName.toLowerCase().replace(/[^a-z]/g, '');
          item.email = `${cleanF}.${cleanL}${randInt(1, 99)}@${rand(DOMAINS)}`;
        }
        
        if (options.phone) item.phone = `+1-${randInt(200, 999)}-${randInt(200, 999)}-${randInt(1000, 9999)}`;
        if (options.jobTitle) item.jobTitle = rand(JOB_TITLES);
        if (options.company) item.company = rand(COMPANIES);
        if (options.address) item.address = `${randInt(10, 9999)} ${rand(STREETS)}, ${rand(CITIES)}`;
        if (options.country) item.country = rand(COUNTRIES);
        if (options.avatarUrl) item.avatarUrl = `https://i.pravatar.cc/150?u=${item.id || uuidv4()}`;
        if (options.createdAt) item.createdAt = randDate(new Date(2020, 0, 1), new Date()).toISOString();
        if (options.isActive) item.isActive = randBool();
        if (options.price) item.price = Number((Math.random() * 1000).toFixed(2));

        data.push(item);
      }

      setOutput(JSON.stringify(data, null, 2));
      setIsGenerating(false);
    }, 10);
  }, [rowCount, options]);

  // Initial generation
  useEffect(() => {
    generateData();
  }, []); // Run once on mount

  const downloadJson = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_data_${rowCount}_rows${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggle = (key: keyof GeneratorOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Select all or none
  const setAll = (val: boolean) => {
    const newOpts = { ...options };
    (Object.keys(newOpts) as Array<keyof GeneratorOptions>).forEach(k => {
      newOpts[k] = val;
    });
    setOptions(newOpts);
  };

  return (
    <SplitView
      leftTitle="Data Schema"
      rightTitle="Output"
      leftActions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setAll(true)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif"
            }}
          >All</button>
          <button
            onClick={() => setAll(false)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif"
            }}
          >None</button>
        </div>
      }
      rightActions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={downloadJson}
            disabled={!output}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600,
              cursor: output ? 'pointer' : 'not-allowed', opacity: output ? 1 : 0.5,
              display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s'
            }}
          >
           💾 Download
          </button>
          <CopyButton text={output} />
        </div>
      }
      leftContent={
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
              Row Count (Items)
            </label>
            <input 
              type="number" 
              min={1} 
              max={10000} 
              value={rowCount}
              onChange={(e) => setRowCount(Number(e.target.value))}
              style={{
                padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
                outline: 'none', width: '100%'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Maximum 10,000 rows.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
              Include Fields
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {(Object.keys(options) as Array<keyof GeneratorOptions>).map((key) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.875rem', borderRadius: '10px',
                  border: `1px solid ${options[key] ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`,
                  background: options[key] ? 'rgba(16,185,129,0.05)' : 'var(--bg-elevated)',
                  cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none'
                }}>
                  <input 
                    type="checkbox" 
                    checked={options[key]} 
                    onChange={() => handleToggle(key)}
                    style={{
                      width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: options[key] ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: options[key] ? 500 : 400 }}>
                    {FIELD_LABELS[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateData}
            disabled={isGenerating}
            style={{
              marginTop: 'auto',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: isGenerating ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.25)'; }}
          >
            {isGenerating ? 'Generating...' : `Generate ${rowCount} Rows`}
            {!isGenerating && <span style={{ fontSize: '1.2rem' }}>✨</span>}
          </button>

        </div>
      }
      rightContent={
        <div style={{ height: '100%', position: 'relative' }}>
          <pre
            style={{
              padding: '1.25rem',
              margin: 0,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              height: '100%',
              overflow: 'auto',
            }}
          >
            {output || <span style={{ color: 'var(--text-muted)' }}>Generating JSON...</span>}
          </pre>
        </div>
      }
    />
  );
}
