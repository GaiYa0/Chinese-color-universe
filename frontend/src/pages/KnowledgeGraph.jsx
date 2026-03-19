import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../App';

export default function KnowledgeGraph() {
  const [bfs, setBfs] = useState([]);
  const [dfs, setDfs] = useState([]);
  const [topo, setTopo] = useState([]);
  const [start, setStart] = useState('天青');

  useEffect(() => {
    const load = () => {
      fetch(API_BASE + `/graph/bfs?start=${encodeURIComponent(start)}`)
        .then((r) => r.json())
        .then((d) => setBfs(d.result || []))
        .catch(() => setBfs([]));
      fetch(API_BASE + `/graph/dfs?start=${encodeURIComponent(start)}`)
        .then((r) => r.json())
        .then((d) => setDfs(d.result || []))
        .catch(() => setDfs([]));
      fetch(API_BASE + '/graph/topological')
        .then((r) => r.json())
        .then((d) => setTopo(d.result || []))
        .catch(() => setTopo([]));
    };
    load();
  }, [start]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
    >
      <p className="section-label">KNOWLEDGE GRAPH</p>
      <h1 className="page-title">知识图谱</h1>
      <p className="page-subtitle">图算法 · BFS / DFS / 拓扑排序</p>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>起点节点：</label>
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{
            marginLeft: '0.5rem',
            padding: '0.6rem 1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--signal)', fontSize: '1rem' }}>BFS 广度优先</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>从 {start} 出发的文化关系探索</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {bfs.map((n, i) => (
              <span key={n} style={{ padding: '0.3rem 0.6rem', background: 'var(--void)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {n}{i < bfs.length - 1 ? ' →' : ''}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--signal)', fontSize: '1rem' }}>DFS 深度优先</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>从 {start} 出发的深度遍历</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {dfs.map((n, i) => (
              <span key={n} style={{ padding: '0.3rem 0.6rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {n}{i < dfs.length - 1 ? ' →' : ''}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--gold)', fontSize: '1rem' }}>拓扑排序 · 颜色历史演化时间线</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Kahn 算法 · 有向无环图排序</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {topo.map((n, i) => (
              <span key={n} style={{ padding: '0.3rem 0.6rem', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {n}{i < topo.length - 1 ? ' →' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
