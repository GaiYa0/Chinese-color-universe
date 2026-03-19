/**
 * 文化关系图 - D3 Force Graph
 * 诗人 | 文物 — 颜色 — 朝代 | 节气
 * 探索模式: DFS/BFS 生成文化探索路径
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { API_BASE } from '../App';

export default function CulturalGraph() {
  const svgRef = useRef();
  const [data, setData] = useState({ nodes: [], links: [] });
  const [bfsPath, setBfsPath] = useState([]);
  const [dfsPath, setDfsPath] = useState([]);
  const [exploreStart, setExploreStart] = useState('天青');

  useEffect(() => {
    Promise.all([
      fetch(API_BASE + '/colors').then((r) => r.json()),
      fetch(API_BASE + '/graph/bfs?start=天青').then((r) => r.json()),
    ])
      .then(([colors, bfs]) => {
        const nodes = [];
        const links = [];
        const seen = new Set();

        const addNode = (id, type = 'node') => {
          if (!seen.has(id)) {
            seen.add(id);
            nodes.push({ id, type });
          }
        };

        addNode('天青', 'color');
        addNode('汝窑', 'relic');
        addNode('宋代', 'dynasty');
        addNode('朱红', 'color');
        addNode('故宫', 'relic');
        addNode('明代', 'dynasty');
        addNode('石青', 'color');
        addNode('敦煌', 'location');
        addNode('月白', 'color');
        addNode('宋徽宗', 'poet');
        addNode('苏轼', 'poet');

        links.push({ source: '天青', target: '汝窑' });
        links.push({ source: '汝窑', target: '宋代' });
        links.push({ source: '天青', target: '宋徽宗' });
        links.push({ source: '朱红', target: '故宫' });
        links.push({ source: '故宫', target: '明代' });
        links.push({ source: '石青', target: '敦煌' });
        links.push({ source: '天青', target: '月白' });
        links.push({ source: '月白', target: '苏轼' });

        setData({ nodes, links });
      })
      .catch(() => setData({ nodes: [], links: [] }));
  }, []);

  const runExploration = () => {
    fetch(API_BASE + `/graph/bfs?start=${encodeURIComponent(exploreStart)}`)
      .then((r) => r.json())
      .then((d) => setBfsPath(d.result || []))
      .catch(() => setBfsPath([]));
    fetch(API_BASE + `/graph/dfs?start=${encodeURIComponent(exploreStart)}`)
      .then((r) => r.json())
      .then((d) => setDfsPath(d.result || []))
      .catch(() => setDfsPath([]));
  };

  useEffect(() => {
    if (data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current?.clientWidth || 800;
    const height = 500;

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'rgba(0,212,170,0.4)')
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (e, d) => {
          e.sourceEvent.stopPropagation();
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append('circle')
      .attr('r', (d) => d.type === 'color' ? 18 : 12)
      .attr('fill', (d) => d.type === 'color' ? '#00d4aa' : '#1a1a24')
      .attr('stroke', 'rgba(0,212,170,0.5)')
      .attr('stroke-width', 1.5);

    node.append('text')
      .text((d) => d.id)
      .attr('x', 0)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e6edf3')
      .attr('font-size', '11px');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  }, [data]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <p className="section-label">CULTURAL GRAPH</p>
      <h1 className="page-title">文化关系图</h1>
      <p className="page-subtitle">Graph 力导向 · 拖拽节点 · DFS/BFS 探索模式</p>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={exploreStart}
          onChange={(e) => setExploreStart(e.target.value)}
          placeholder="起点"
          style={{ padding: '0.6rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
        />
        <button className="btn btn-primary" onClick={runExploration}>生成探索路径</button>
      </div>

      {(bfsPath.length > 0 || dfsPath.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--signal)', marginBottom: '0.5rem' }}>BFS 广度探索</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {bfsPath.map((n, i) => (
                <Link key={n} to={`/color/${encodeURIComponent(n)}`}><span style={{ padding: '0.25rem 0.5rem', background: 'var(--void)', borderRadius: '6px', fontSize: '0.85rem' }}>{n}</span></Link>
              ))}
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>DFS 深度探索</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {dfsPath.map((n) => (
                <Link key={n} to={`/color/${encodeURIComponent(n)}`}><span style={{ padding: '0.25rem 0.5rem', background: 'var(--void)', borderRadius: '6px', fontSize: '0.85rem' }}>{n}</span></Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', marginTop: '1rem' }}>
        <svg ref={svgRef} width="100%" height="500" style={{ display: 'block' }} />
      </div>
    </motion.div>
  );
}
