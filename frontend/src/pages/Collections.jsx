/**
 * 我的收藏 / 浏览历史
 * Stack: 浏览历史  Queue: 收藏列表
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '../App';

export default function Collections() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(API_BASE + '/history')
      .then((r) => r.json())
      .then((d) => setHistory((d.history || []).slice(0, 20)))
      .catch(() => setHistory([]));
  }, []);

  const [saved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chinese_colors_favorites') || '[]');
    } catch { return []; }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <p className="section-label">COLLECTIONS</p>
      <h1 className="page-title">收藏与历史</h1>
      <p className="page-subtitle">Stack 浏览历史 · 探索足迹</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--signal)' }}>浏览历史</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>暂无浏览记录</p>
            ) : (
              history.map((name) => (
                <Link key={name} to={`/color/${encodeURIComponent(name)}`}>
                  <span style={{ padding: '0.4rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.9rem' }}>{name}</span>
                </Link>
              ))
            )}
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>收藏</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>收藏功能需在颜色详情页点击收藏按钮</p>
        </div>
      </div>
    </motion.div>
  );
}
