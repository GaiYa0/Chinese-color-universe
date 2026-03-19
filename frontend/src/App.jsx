import { Routes, Route, NavLink } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import ColorExploration from './pages/ColorExploration';
import ColorDetail from './pages/ColorDetail';
import CulturalGraph from './pages/CulturalGraph';
import ColorMap from './pages/ColorMap';
import TodayColor from './pages/TodayColor';
import DataDashboard from './pages/DataDashboard';
import Collections from './pages/Collections';

const API_BASE = '/api';
export { API_BASE };

function Nav() {
  const links = [
    { to: '/', label: '宇宙' },
    { to: '/exploration', label: '颜色探索' },
    { to: '/graph', label: '文化关系图' },
    { to: '/map', label: '中国色地图' },
    { to: '/today', label: '今日中国色' },
    { to: '/dashboard', label: '数据' },
    { to: '/collections', label: '收藏' },
  ];
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-title">🌌 中国色宇宙</NavLink>
      <div className="nav-links">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exploration" element={<ColorExploration />} />
          <Route path="/color/:name" element={<ColorDetail />} />
          <Route path="/graph" element={<CulturalGraph />} />
          <Route path="/map" element={<ColorMap />} />
          <Route path="/today" element={<TodayColor />} />
          <Route path="/dashboard" element={<DataDashboard />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
