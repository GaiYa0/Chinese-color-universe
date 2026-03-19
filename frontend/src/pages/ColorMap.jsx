/**
 * 中国色文化地图 - ECharts
 * 景德镇→天青瓷 敦煌→石青 北京→朱红
 */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { API_BASE } from '../App';

export default function ColorMap() {
  const [mapData, setMapData] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(API_BASE + '/map')
      .then((r) => r.json())
      .then(setMapData)
      .catch(() => setMapData(null));
  }, []);

  if (!mapData) return <div className="container"><p>加载中...</p></div>;

  const { cities } = mapData;
  const scatterData = cities.map((c) => ({ name: c.name, value: [c.x, c.y], colors: c.colors, culture: c.culture }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const d = p.data;
        return `<div style="padding:8px">
          <strong>${d.name}</strong><br/>
          ${d.colors?.join('、') || ''}<br/>
          <span style="color:#8b949e">${d.culture}</span>
        </div>`;
      },
      backgroundColor: 'rgba(18,18,26,0.95)',
      borderColor: 'rgba(0,212,170,0.3)',
      textStyle: { color: '#e6edf3' },
    },
    grid: { left: 60, right: 40, top: 40, bottom: 40 },
    xAxis: { type: 'value', min: 90, max: 125, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#8b949e' } },
    yAxis: { type: 'value', min: 25, max: 45, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#8b949e' } },
    series: [{
      type: 'scatter',
      data: scatterData,
      symbolSize: 20,
      itemStyle: { color: '#00d4aa', borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1 },
      emphasis: { scale: 1.3 },
      label: { show: true, formatter: '{b}', color: '#e6edf3', fontSize: 12 },
    }],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <p className="section-label">CHINA COLOR MAP</p>
      <h1 className="page-title">中国色地图</h1>
      <p className="page-subtitle">点击城市查看文化色彩 · 景德镇·敦煌·北京</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', height: 500 }}>
        <ReactECharts option={option} style={{ height: '100%' }} opts={{ renderer: 'canvas' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        {cities.map((c) => (
          <div key={c.id} style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--signal)', marginBottom: '0.5rem' }}>{c.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.culture}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {c.colors?.map((co) => (
                <span key={co} style={{ padding: '0.2rem 0.5rem', background: 'var(--void)', borderRadius: '6px', fontSize: '0.8rem' }}>{co}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
