/**
 * 今日中国色 - 随机算法选择
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';

export default function TodayColor() {
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE + '/colors')
      .then((r) => r.json())
      .then((colors) => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const idx = dayOfYear % colors.length;
        setColor(colors[idx]);
      })
      .catch(() => setColor(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>加载中...</p></div>;
  if (!color) return <div className="container"><p>暂无数据</p></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <p className="section-label">TODAY'S COLOR</p>
      <h1 className="page-title">今日中国色</h1>
      <p className="page-subtitle">按日期种子随机 · 每天一颗独特星球</p>

      <Link to={`/color/${encodeURIComponent(color.name)}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            marginTop: '2rem',
            padding: '3rem',
            background: `linear-gradient(135deg, ${color.hex}20 0%, var(--surface) 50%)`,
            border: '1px solid var(--border)',
            borderRadius: '24px',
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              aspectRatio: '1',
              borderRadius: '50%',
              background: color.hex || `rgb(${color.rgb?.join(',')})`,
              boxShadow: `0 0 60px ${color.hex}80`,
            }}
          />
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{color.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{color.meaning}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{color.relic} · {color.dynasty}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
