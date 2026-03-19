"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  createCultureTexture,
  createPlanetGeometry,
  createRoughnessTexture,
} from "@/modules/universe/lib/planetUtils";
import AtmosphereMesh from "@/modules/universe/scene/objects/AtmosphereMesh";

const CENTRAL_STAR_NAME = "朱红";

interface CentralStarProps {
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}

export default function CentralStar({ onHover, onSelect }: CentralStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  const starGeo = useMemo(
    () => createPlanetGeometry(1, 48, 1 * 0.1, 0),
    []
  );
  const colorTex = useMemo(
    () => createCultureTexture("#c62828", "palace"),
    []
  );
  const roughnessTex = useMemo(() => createRoughnessTexture(64, 0), []);

  return (
    <group ref={groupRef}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(CENTRAL_STAR_NAME);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(CENTRAL_STAR_NAME);
        }}
      >
        <primitive object={starGeo} attach="geometry" />
        <meshPhysicalMaterial
          map={colorTex}
          roughnessMap={roughnessTex}
          roughness={0.5}
          metalness={0.1}
          envMapIntensity={1.4}
          emissive="#c62828"
          emissiveIntensity={hovered ? 0.5 : 0.35}
        />
      </mesh>
      <AtmosphereMesh size={1} baseColor="#c62828" />
    </group>
  );
}
