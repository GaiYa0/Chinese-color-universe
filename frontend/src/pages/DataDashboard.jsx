/**
 * 数据可视化仪表盘 - ECharts
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { API_BASE } from '../App';

export default function DataDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(API_BASE + '/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <div className="container"><p>加载中...</p></div>;

  const { dynasty_count, location_count, total_colors, poem_count } = stats;

  const barOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(18,18,26,0.95)', borderColor: 'rgba(0,212,170,0.3)' },
    grid: { left: 80, right: 40, top: 30, bottom: 50 },
    xAxis: { type: 'category', data: Object.keys(dynasty_count || {}).slice(0, 12), axisLabel: { color: '#8b949e' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    yAxis: { type: 'value', axisLabel: { color: '#8b949e' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
    series: [{ type: 'bar', data: Object.values(dynasty_count || {}).slice(0, 12), itemStyle: { color: '#00d4aa' } }],
  };

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(18,18,26,0.95)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: Object.entries(location_count || {}).slice(0, 10).map(([n, v]) => ({ name: n, value: v })),
      itemStyle: { borderColor: '#0a0a0f', borderWidth: 2 },
      label: { color: '#e6edf3' },
      color: ['#00d4aa', '#eab308', '#8b949e', '#6e7681', '#58a6ff'],
    }],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <p className="section-label">DATA DASHBOARD</p>
      <h1 className="page-title">数据可视化</h1>
      <p className="page-subtitle">朝代·地域·诗词分布</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--signal)' }}>{total_colors}</div>
          <div style={{ color: 'var(--text-muted)' }}>颜色总数</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)' }}>{poem_count}</div>
          <div style={{ color: 'var(--text-muted)' }}>诗词引用</div>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--signal)' }}>{Object.keys(dynasty_count || {}).length}</div>
          <div style={{ color: 'var(--text-muted)' }}>朝代数量</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <h4 style={{ marginBottom: '1rem' }}>朝代颜色分布</h4>
          <ReactECharts option={barOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} />
        </div>
        <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <h4 style={{ marginBottom: '1rem' }}>地域分布</h4>
          <ReactECharts option={pieOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} />
        </div>
      </div>
    </motion.div>
  );
}
