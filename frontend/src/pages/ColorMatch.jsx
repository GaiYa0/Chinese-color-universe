import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';

export default function ColorMatch() {
  const [rgb, setRgb] = useState({ r: 150, g: 180, b: 220 });
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const doMatch = (r, g, b) => {
    fetch(API_BASE + '/colors/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ r, g, b }),
    })
      .then((res) => res.json())
      .then(setResult)
      .catch(() => setResult(null));
  };

  const handleManualMatch = () => doMatch(rgb.r, rgb.g, rgb.b);

  const handleFile = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(API_BASE + '/upload/match', { method: 'POST', body: form });
      const data = await res.json();
      setResult(data);
      if (data.image_rgb) setRgb({ r: data.image_rgb[0], g: data.image_rgb[1], b: data.image_rgb[2] });
    } catch { setResult(null); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">AI MATCH</p>
      <h1 className="page-title">AI 识色</h1>
      <p className="page-subtitle">KD-Tree 最近邻搜索 · O(log n) 颜色匹配</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>手动输入 RGB</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {['r', 'g', 'b'].map((k) => (
              <label key={k} style={{ display: 'block' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{k.toUpperCase()}</span>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb[k]}
                  onChange={(e) => setRgb((prev) => ({ ...prev, [k]: +e.target.value }))}
                  style={{
                    display: 'block',
                    width: '80px',
                    padding: '0.6rem',
                    marginTop: '0.25rem',
                    background: 'var(--void)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                  }}
                />
              </label>
            ))}
          </div>
          <div
            style={{
              width: '100%',
              height: '80px',
              borderRadius: '10px',
              background: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
              marginBottom: '1rem',
              border: '1px solid var(--border)',
            }}
          />
          <button className="btn btn-primary" onClick={handleManualMatch}>
            匹配中国色
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.type.startsWith('image/')) handleFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          style={{
            padding: '2rem',
            border: `1px dashed ${dragOver ? 'var(--signal)' : 'var(--border)'}`,
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(0,212,170,0.05)' : 'var(--surface)',
            transition: 'all 0.2s',
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          <span style={{ color: 'var(--text-muted)' }}>点击或拖拽图片到此处</span>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            maxWidth: '400px',
            margin: '2rem auto 0',
          }}
        >
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>MATCH RESULT</p>
          {result.color ? (
            <>
              <div
                style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '10px',
                  background: result.color.hex || `rgb(${result.color.rgb?.join(',')})`,
                  margin: '1rem 0',
                  border: '1px solid var(--border)',
                }}
              />
              <Link to={`/color/${encodeURIComponent(result.name)}`}>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--signal)', marginBottom: '0.5rem' }}>
                  {result.name}
                </p>
              </Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{result.color.meaning}</p>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>未找到匹配颜色</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
