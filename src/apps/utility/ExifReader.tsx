import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExifReader from 'exifreader';

interface ExifData {
  [key: string]: { description: string; value?: any };
}

interface GpsCoords {
  lat: number;
  lng: number;
}

const categoryLabels: Record<string, string> = {
  camera: '📷 Camera Info',
  image: '🖼️ Image Details',
  gps: '📍 GPS / Location',
  other: '📋 Other Metadata',
};

const cameraKeys = ['Make', 'Model', 'LensMake', 'LensModel', 'Software', 'FNumber', 'ExposureTime', 'ISOSpeedRatings', 'FocalLength', 'Flash', 'WhiteBalance', 'MeteringMode', 'ExposureProgram', 'ExposureBiasValue'];
const imageKeys = ['ImageWidth', 'ImageLength', 'PixelXDimension', 'PixelYDimension', 'Orientation', 'ColorSpace', 'BitsPerSample', 'Compression', 'DateTime', 'DateTimeOriginal', 'DateTimeDigitized', 'XResolution', 'YResolution'];
const gpsKeys = ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSTimeStamp', 'GPSDateStamp', 'GPSImgDirection', 'GPSSpeed'];

function categorize(key: string): string {
  if (cameraKeys.includes(key)) return 'camera';
  if (imageKeys.includes(key)) return 'image';
  if (gpsKeys.includes(key)) return 'gps';
  return 'other';
}

export default function ExifReaderApp() {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [gps, setGps] = useState<GpsCoords | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const processFile = async (file: File) => {
    setError('');
    setExifData(null);
    setGps(null);
    setCleanedBlob(null);
    setFileName(file.name);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const tags = await ExifReader.load(file, { expanded: false });
      if (!tags || Object.keys(tags).length === 0) {
        setError('No EXIF metadata found in this image. The file might have been stripped already.');
        return;
      }

      const cleaned: ExifData = {};
      for (const [key, val] of Object.entries(tags)) {
        if (key === 'MakerNote' || key === 'UserComment' || key.startsWith('undefined')) continue;
        const v = val as any;
        if (v && v.description !== undefined) {
          cleaned[key] = { description: String(v.description), value: v.value };
        }
      }
      setExifData(cleaned);

      // Extract GPS
      const latTag = tags['GPSLatitude'] as any;
      const lngTag = tags['GPSLongitude'] as any;
      const latRef = tags['GPSLatitudeRef'] as any;
      const lngRef = tags['GPSLongitudeRef'] as any;

      if (latTag && lngTag) {
        let lat = parseFloat(latTag.description);
        let lng = parseFloat(lngTag.description);
        if (latRef && latRef.value && latRef.value[0] === 'S') lat = -lat;
        if (lngRef && lngRef.value && lngRef.value[0] === 'W') lng = -lng;
        if (!isNaN(lat) && !isNaN(lng)) {
          setGps({ lat, lng });
        }
      }
    } catch (err: any) {
      setError('Could not read EXIF data. Make sure the file is a valid JPEG/TIFF image.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleCleanExif = async () => {
    if (!preview) return;
    try {
      // Draw image to canvas (strips EXIF) then export
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setCleanedBlob(blob);
            toast('EXIF data stripped! Download your clean image below.');
          }
        }, 'image/jpeg', 0.95);
      };
      img.src = preview;
    } catch {
      toast('Failed to clean EXIF data.');
    }
  };

  const handleDownloadClean = () => {
    if (!cleanedBlob) return;
    const url = URL.createObjectURL(cleanedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Clean image downloaded!');
  };

  // Group data by category
  const grouped: Record<string, [string, { description: string }][]> = { camera: [], image: [], gps: [], other: [] };
  if (exifData) {
    for (const [key, val] of Object.entries(exifData)) {
      const cat = categorize(key);
      grouped[cat].push([key, val]);
    }
  }

  return (
    <div>
      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        animate={{ borderColor: isDragging ? '#8b5cf6' : 'rgba(255,255,255,0.1)', scale: isDragging ? 1.01 : 1 }}
        style={{
          border: '2px dashed', borderRadius: '20px', padding: '3rem 2rem',
          textAlign: 'center', cursor: 'pointer', marginBottom: '2rem',
          background: isDragging ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'background 0.3s',
        }}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/tiff,image/png,image/webp" hidden onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕵️</div>
        <p style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Drop an image here or click to upload
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Supports JPEG, TIFF, PNG, WebP
        </p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', marginBottom: '2rem', fontSize: '0.9375rem' }}>
          ⚠️ {error}
        </motion.div>
      )}

      {preview && exifData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Image Preview + GPS Map Row */}
          <div style={{ display: 'grid', gridTemplateColumns: gps ? '1fr 1fr' : '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={preview} alt="Uploaded" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            </div>
            {gps && (
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                <iframe
                  title="GPS Location"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${gps.lng - 0.01}%2C${gps.lat - 0.01}%2C${gps.lng + 0.01}%2C${gps.lat + 0.01}&layer=mapnik&marker=${gps.lat}%2C${gps.lng}`}
                  style={{ width: '100%', height: '300px', border: 'none' }}
                />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                  🚨 GPS FOUND: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCleanExif}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
                fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
              }}
            >
              🛡️ Strip All EXIF Data (Clean Image)
            </motion.button>

            {cleanedBlob && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadClean}
                style={{
                  padding: '0.75rem 1.5rem', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                  fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                }}
              >
                💾 Download Clean Image
              </motion.button>
            )}
          </div>

          {/* EXIF Data Grid */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {(['camera', 'image', 'gps', 'other'] as const).map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              return (
                <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: cat === 'gps' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: cat === 'gps' ? '#f87171' : '#fff' }}>
                      {categoryLabels[cat]}
                    </h3>
                  </div>
                  <div style={{ padding: '0.5rem 0' }}>
                    {items.map(([key, val], i) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace" }}>{key}</span>
                        <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{val.description}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(16, 185, 129, 0.9)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 8px 32px rgba(16,185,129,0.3)', zIndex: 50 }}>
            ✓ {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
