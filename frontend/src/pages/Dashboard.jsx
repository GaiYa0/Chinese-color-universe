import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(API_BASE + '/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <div className="container"><p style={{ color: 'var(--text-muted)' }}>加载中...</p></div>;

  const { total_colors, dynasty_count, location_count, poem_count } = stats;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">DASHBOARD</p>
      <h1 className="page-title">数据看板</h1>
      <p className="page-subtitle">数据可视化仪表盘</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--signal)' }}>{total_colors}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>颜色总数</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--signal)' }}>{Object.keys(dynasty_count || {}).length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>朝代数量</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)' }}>{poem_count}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>诗词引用</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>朝代分布</p>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(dynasty_count || {}).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>地域分布</p>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(location_count || {}).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
