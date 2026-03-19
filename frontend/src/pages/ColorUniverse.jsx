/**
 * 中国色宇宙 - AdventureX 美学 · 面向未知的探索
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';

export default function ColorUniverse() {
  const [colors, setColors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(API_BASE + '/colors')
      .then((r) => r.json())
      .then((data) => {
        setColors(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(false));
  }, []);

  const groups = [
    { name: '青系' },
    { name: '红系' },
    { name: '黄系' },
    { name: '绿系' },
    { name: '白系' },
    { name: '紫系' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">COLOR UNIVERSE</p>
      <h1 className="page-title">中国色宇宙</h1>
      <p className="page-subtitle">三维文化探索 · 传统色星图 · 面向未知的信号</p>

      {!loaded ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</p>
      ) : (
        <div
          style={{
            perspective: '1000px',
            minHeight: '60vh',
            background: 'linear-gradient(180deg, var(--void-deep) 0%, var(--surface) 50%, var(--void-deep) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(0,212,170,0.04) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: 1,
                  height: 1,
                  background: 'var(--signal)',
                  borderRadius: '50%',
                  opacity: 0.2 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '1.25rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {colors.slice(0, 80).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    opacity: { delay: Math.min(i * 0.015, 0.6), duration: 0.2 },
                    scale: { delay: 0, duration: 0.2 },
                  },
                }}
                whileHover={{
                  scale: 1.08,
                  zIndex: 10,
                  transition: { duration: 0.06, delay: 0 },
                }}
                whileTap={{ scale: 1.02 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link to={`/color/${encodeURIComponent(c.name)}`}>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      background: c.hex || `rgb(${c.rgb?.join(',')})`,
                      boxShadow: selected === c.id
                        ? `0 0 24px ${c.hex}60`
                        : '0 4px 20px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={() => setSelected(c.id)}
                    onMouseLeave={() => setSelected(null)}
                  >
                    <span
                      style={{
                        color: 'white',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {c.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {groups.map((g) => (
              <span
                key={g.name}
                style={{
                  padding: '0.4rem 0.9rem',
                  background: 'rgba(0,212,170,0.08)',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '20px',
                  color: 'var(--signal)',
                  fontSize: '0.85rem',
                }}
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
