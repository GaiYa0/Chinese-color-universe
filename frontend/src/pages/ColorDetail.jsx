/**
 * 颜色详情 - 沉浸式 · 页面背景=该颜色渐变
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '../App';

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ColorDetail() {
  const { name } = useParams();
  const [color, setColor] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    Promise.all([
      fetch(API_BASE + `/colors/${encodeURIComponent(name)}`).then((r) => r.json()),
      fetch(API_BASE + `/colors/${encodeURIComponent(name)}/recommend?k=6`).then((r) => r.json()),
      fetch(API_BASE + `/colors/${encodeURIComponent(name)}/group`).then((r) => r.json()),
    ])
      .then(([c, rec, grp]) => {
        setColor(c);
        setRecommendations(rec);
        setGroup(grp.group || []);
        fetch(API_BASE + `/history?name=${encodeURIComponent(name)}`, { method: 'POST' }).catch(() => {});
      })
      .catch(() => setColor(null))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <div className="container"><p>加载中...</p></div>;
  if (!color) return <div className="container"><p>未找到颜色</p></div>;

  const lightGradient = hexToRgba(color.hex, 0.15);
  const darkGradient = hexToRgba(color.hex, 0.4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${lightGradient} 0%, var(--void) 30%, var(--void) 100%)`,
        paddingTop: '6rem',
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 240px) 1fr', gap: '3rem', alignItems: 'start', marginBottom: '2.5rem' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              aspectRatio: '1',
              borderRadius: '24px',
              background: color.hex || `rgb(${color.rgb?.join(',')})`,
              boxShadow: `0 0 80px ${color.hex}60`,
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          />
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{color.name}</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>{color.hex} · RGB({color.rgb?.join(', ')})</p>
            <p style={{ fontSize: '1.15rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>{color.meaning}</p>
            {color.poem && (
              <blockquote style={{ padding: '1.5rem', borderLeft: '4px solid var(--signal)', background: 'rgba(0,0,0,0.3)', borderRadius: '0 12px 12px 0', marginBottom: '1.5rem' }}>
                {color.poem}
                <br />
                <span style={{ color: 'var(--signal)' }}>—— {color.poet}</span>
              </blockquote>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px' }}>文物：{color.relic}</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px' }}>朝代：{color.dynasty}</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px' }}>产地：{color.location}</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '10px' }}>节气：{color.solar_term}</span>
            </div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{color.story}</p>
          </div>
        </div>

        {group.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p className="section-label">文化群组</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {group.map((g) => (
                <Link key={g} to={`/color/${encodeURIComponent(g)}`}>
                  <span style={{ padding: '0.4rem 1rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--signal)' }}>{g}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <p className="section-label">相关颜色</p>
            <h3 style={{ marginBottom: '1rem' }}>更多星球</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {recommendations.map((r) => (
                <Link key={r.name} to={`/color/${encodeURIComponent(r.name)}`}>
                  <motion.div whileHover={{ scale: 1.05 }} style={{ width: 120, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: 80, background: r.hex || `rgb(${r.rgb?.join(',')})` }} />
                    <div style={{ padding: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>{r.name}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
