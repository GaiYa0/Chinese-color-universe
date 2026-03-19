import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../App';

export default function CulturalMap() {
  const [mapData, setMapData] = useState(null);
  const [path, setPath] = useState(null);
  const [start, setStart] = useState('北京');
  const [goal, setGoal] = useState('景德镇');

  useEffect(() => {
    fetch(API_BASE + '/map')
      .then((r) => r.json())
      .then(setMapData)
      .catch(() => setMapData(null));
  }, []);

  const runAStar = () => {
    fetch(API_BASE + '/tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, goal }),
    })
      .then((r) => r.json())
      .then((d) => setPath(d.path))
      .catch(() => setPath(null));
  };

  if (!mapData) return <div className="container"><p style={{ color: 'var(--text-muted)' }}>加载中...</p></div>;

  const { cities, routes } = mapData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">CULTURAL MAP</p>
      <h1 className="page-title">文化地图</h1>
      <p className="page-subtitle">A* 搜索 · 最优文化导览路线</p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={runAStar}>规划路线</button>
      </div>

      {path && path.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '1.5rem',
            background: 'var(--surface)',
            border: '1px solid var(--signal)',
            borderRadius: '12px',
            marginBottom: '2rem',
          }}
        >
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>RECOMMENDED ROUTE</p>
          <p style={{ fontSize: '1.1rem' }}>{path.join(' → ')}</p>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {cities.map((city) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
            }}
          >
            <h3 style={{ color: 'var(--signal)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{city.name}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{city.culture}</p>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {city.colors?.map((c) => (
                <span
                  key={c}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: 'var(--void)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p className="section-label" style={{ marginBottom: '0.5rem' }}>CITY ROUTES</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {routes?.map((r, i) => (
            <span
              key={i}
              style={{
                padding: '0.4rem 0.9rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              {r.from} — {r.to} ({r.distance}km)
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
