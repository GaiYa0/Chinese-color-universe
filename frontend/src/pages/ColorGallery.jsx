import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';

export default function ColorGallery() {
  const [colors, setColors] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_BASE + '/colors')
      .then((r) => r.json())
      .then((data) => {
        setColors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults(colors);
      return;
    }
    const timer = setTimeout(() => {
      fetch(API_BASE + `/colors/search?q=${encodeURIComponent(search)}`)
        .then((r) => r.json())
        .then(setResults)
        .catch(() => setResults([]));
    }, 200);
    return () => clearTimeout(timer);
  }, [search, colors]);

  const displayColors = search ? results : colors;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">COLOR GALLERY</p>
      <h1 className="page-title">色览</h1>
      <p className="page-subtitle">Trie 前缀搜索 · 输入颜色名称自动补全</p>

      <input
        type="text"
        className="search-box"
        placeholder="输入颜色名称搜索，如：天"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>加载中...</p>
      ) : (
        <div className="color-grid">
          {displayColors.map((c, i) => (
            <Link key={c.id} to={`/color/${encodeURIComponent(c.name)}`}>
              <motion.div
                className="color-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.5), duration: 0.2 }}
              >
                <div
                  className="color-swatch"
                  style={{ background: c.hex || `rgb(${c.rgb?.join(',')})` }}
                />
                <div className="color-card-info">
                  <div className="color-card-name">{c.name}</div>
                  <div className="color-card-hex">{c.hex}</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {!loading && displayColors.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>暂无匹配结果</p>
      )}
    </motion.div>
  );
}
