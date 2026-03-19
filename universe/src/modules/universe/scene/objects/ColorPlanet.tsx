"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { ChineseColor } from "@/shared/types";
import {
  createCloudTexture,
  createCultureTexture,
  createPlanetGeometry,
  createRoughnessTexture,
  getCultureType,
} from "@/modules/universe/lib/planetUtils";
import AtmosphereMesh from "@/modules/universe/scene/objects/AtmosphereMesh";

interface ColorPlanetProps {
  color: ChineseColor;
  index: number;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}

export default function ColorPlanet({
  color,
  index,
  onHover,
  onSelect,
}: ColorPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);
  const unhoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (unhoverTimerRef.current) clearTimeout(unhoverTimerRef.current);
  }, []);

  const angle = (index / 45) * Math.PI * 2 + index * 0.25;
  const radius = 4.5 + (index % 4) * 1.8 + (index * 0.07) % 1.2;
  const speed = 0.15 + (index % 5) * 0.02;
  const floatOffset = index * 0.7;

  const [x, z] = useMemo(
    () => [Math.cos(angle) * radius, Math.sin(angle) * radius],
    [angle, radius]
  );

  const size = 0.25 + (index % 3) * 0.08;
  const cultureType = useMemo(
    () => getCultureType(color.name, color.relic),
    [color.name, color.relic]
  );
  const planetGeo = useMemo(
    () => createPlanetGeometry(size, 48, size * 0.18, index + 1),
    [size, index]
  );
  const colorTexture = useMemo(
    () => createCultureTexture(color.hex, cultureType),
    [color.hex, cultureType]
  );
  const roughnessTexture = useMemo(
    () => createRoughnessTexture(64, index + 7),
    [index]
  );
  const cloudTexture = useMemo(() => createCloudTexture(128), []);
  const rotationSpeed = 0.0005 + (index % 7) * 0.0003;
  const targetScale = hovered ? 1.4 : 1;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed;
      groupRef.current.position.x = Math.cos(t + angle) * radius;
      groupRef.current.position.z = Math.sin(t + angle) * radius;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime + floatOffset) * 0.12;
      groupRef.current.rotation.y += rotationSpeed;
      scaleRef.current +=
        (targetScale - scaleRef.current) * Math.min(delta * 8, 1);
      groupRef.current.scale.setScalar(scaleRef.current);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0005;
    }
  });

  const handlePointerOver = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (unhoverTimerRef.current) {
      clearTimeout(unhoverTimerRef.current);
      unhoverTimerRef.current = null;
    }
    setHovered(true);
    onHover(color.name);
  };

  const handlePointerOut = () => {
    unhoverTimerRef.current = setTimeout(() => {
      setHovered(false);
      onHover(null);
      unhoverTimerRef.current = null;
    }, 80);
  };

  return (
    <group ref={groupRef} position={[x, 0, z]} scale={1}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(color.name);
        }}
      >
        <primitive object={planetGeo} attach="geometry" />
        <meshPhysicalMaterial
          map={colorTexture}
          roughnessMap={roughnessTexture}
          roughness={0.55}
          metalness={
            cultureType === "jade" ? 0.15 : cultureType === "celadon" ? 0.12 : 0.06
          }
          clearcoat={cultureType === "celadon" ? 0.35 : 0.2}
          clearcoatRoughness={0.3}
          envMapIntensity={1.4}
          emissive={new THREE.Color(color.hex)}
          emissiveIntensity={hovered ? 0.12 : 0.04}
        />
      </mesh>

      <mesh ref={cloudRef} scale={1.02}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshBasicMaterial
          map={cloudTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <AtmosphereMesh size={size} baseColor={color.hex} />
    </group>
  );
}
