/**
 * 中国色宇宙 - 3D 首页
 * 颜色=星球 · 文化=星系 · 诗词=信号
 */
import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../App';
import { useEffect } from 'react';

function ColorPlanet({ color, position, name, culture, onColorClick }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };
  const [r, g, b] = hexToRgb(color.hex || '#6fa3b7');

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onColorClick?.(color.name)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={[r, g, b]}
          emissive={[r * 0.8, g * 0.8, b * 0.8]}
          emissiveIntensity={hovered ? 0.6 : 0.4}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {hovered && (
        <Html center distanceFactor={8}>
          <Link to={`/color/${encodeURIComponent(color.name)}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(0,0,0,0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(0,212,170,0.4)',
                whiteSpace: 'nowrap',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ fontWeight: 600, color: '#00d4aa' }}>{color.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{culture}</div>
            </div>
          </Link>
        </Html>
      )}
    </group>
  );
}

function UniverseScene({ colors, onColorClick }) {
  const featured = colors.slice(0, 12);
  const positions = [
    [0, 1.2, 0],
    [-1, 0.5, 0.8],
    [1, 0.5, 0.8],
    [-1.2, -0.2, -0.5],
    [1.2, -0.2, -0.5],
    [0, -0.8, 0.6],
    [-0.6, 0.8, -0.4],
    [0.6, 0.8, -0.4],
    [-0.8, -0.6, 0.3],
    [0.8, -0.6, 0.3],
    [0, 0.2, -1],
    [-0.5, -0.9, -0.2],
  ];

  return (
    <>
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4aa" />
      {featured.map((c, i) => (
        <ColorPlanet
          key={c.id}
          color={c}
          position={positions[i] || [0, 0, 0]}
          name={c.name}
          culture={c.relic || c.dynasty || ''}
          onColorClick={onColorClick}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [colors, setColors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_BASE + '/colors')
      .then((r) => r.json())
      .then(setColors)
      .catch(() => setColors([]));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ height: '100vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 0 40px rgba(0,212,170,0.5)',
            marginBottom: '0.5rem',
          }}
        >
          中国色宇宙
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ color: '#8b949e', fontSize: '1rem' }}
        >
          颜色即星球 · 文化即星系 · 进入探索
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ color: '#6e7681', fontSize: '0.85rem', marginTop: '1rem' }}
        >
          拖动旋转 · 悬停查看 · 点击进入
        </motion.p>
      </div>

      <div style={{ height: '100%', background: '#06060a' }}>
        <Suspense
          fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b949e' }}>
              加载宇宙...
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <UniverseScene colors={colors} onColorClick={(name) => navigate(`/color/${encodeURIComponent(name)}`)} />
            <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={8} />
          </Canvas>
        </Suspense>
      </div>

      <Link
        to="/exploration"
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '0.75rem 2rem',
          background: 'rgba(0,212,170,0.2)',
          border: '1px solid rgba(0,212,170,0.5)',
          borderRadius: '12px',
          color: '#00d4aa',
          fontWeight: 600,
          textDecoration: 'none',
          pointerEvents: 'auto',
        }}
      >
        进入颜色探索 →
      </Link>
    </motion.div>
  );
}
