/**
 * 星座式不规则位置生成
 * 模拟星空分布：有聚有散
 */
export function getConstellationPositions(count) {
  const positions = [];
  const used = new Set();

  const clusters = [
    { cx: 0.2, cy: 0.2, r: 0.15, n: 8 },
    { cx: 0.7, cy: 0.25, r: 0.12, n: 6 },
    { cx: 0.5, cy: 0.5, r: 0.2, n: 12 },
    { cx: 0.15, cy: 0.7, r: 0.1, n: 5 },
    { cx: 0.8, cy: 0.75, r: 0.12, n: 6 },
  ];

  let idx = 0;
  for (const c of clusters) {
    for (let i = 0; i < c.n && idx < count; i++) {
      const angle = (i / c.n) * Math.PI * 2 + Math.random() * 0.5;
      const r = c.r * (0.6 + Math.random() * 0.8);
      const x = Math.min(0.95, Math.max(0.05, c.cx + Math.cos(angle) * r));
      const y = Math.min(0.95, Math.max(0.05, c.cy + Math.sin(angle) * r));
      const key = `${Math.floor(x*20)}_${Math.floor(y*20)}`;
      if (!used.has(key)) {
        used.add(key);
        positions.push({ x: `${x * 100}%`, y: `${y * 100}%` });
        idx++;
      }
    }
  }

  while (positions.length < count) {
    const x = 0.05 + Math.random() * 0.9;
    const y = 0.05 + Math.random() * 0.9;
    const key = `${Math.floor(x*20)}_${Math.floor(y*20)}`;
    if (!used.has(key)) {
      used.add(key);
      positions.push({ x: `${x * 100}%`, y: `${y * 100}%` });
    }
  }

  return positions;
}
