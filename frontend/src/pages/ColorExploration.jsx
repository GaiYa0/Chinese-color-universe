/**
 * 颜色探索 - 星座式不规则布局 · 动态文化卡片
 */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';
import { getConstellationPositions } from '../utils/constellation';

function ColorCard({ color, index, position }) {
  const pos = position;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Link to={`/color/${encodeURIComponent(color.name)}`}>
        <motion.div
          className="color-exploration-card"
          whileHover={{ scale: 1.15, zIndex: 100 }}
          whileTap={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="color-exploration-swatch"
            style={{ background: color.hex || `rgb(${color.rgb?.join(',')})` }}
          />
          <div className="color-exploration-info">
            <div className="color-exploration-name">{color.name}</div>
            <div className="color-exploration-culture">{color.relic || color.dynasty || ''}</div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ColorExploration() {
  const [colors, setColors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(API_BASE + '/colors')
      .then((r) => r.json())
      .then(setColors)
      .catch(() => setColors([]));
  }, []);

  const displayColors = search
    ? colors.filter((c) => c.name.includes(search))
    : colors.slice(0, 60);

  const positions = useMemo(() => getConstellationPositions(displayColors.length), [displayColors.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">COLOR EXPLORATION</p>
      <h1 className="page-title">颜色探索</h1>
      <p className="page-subtitle">星座式布局 · 悬停查看文化信息</p>

      <input
        type="text"
        className="search-box"
        placeholder="搜索颜色名称..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '2rem' }}
      />

      <div
        className="constellation-container"
        style={{
          position: 'relative',
          minHeight: '70vh',
          background: 'radial-gradient(ellipse at center, rgba(0,212,170,0.03) 0%, transparent 70%)',
          borderRadius: '24px',
          border: '1px solid var(--border)',
        }}
      >
        {displayColors.map((c, i) => (
          <ColorCard key={c.id} color={c} index={i} position={positions[i] || { x: '50%', y: '50%' }} />
        ))}
      </div>
    </motion.div>
  );
}
