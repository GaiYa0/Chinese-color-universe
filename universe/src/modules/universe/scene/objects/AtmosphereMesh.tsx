"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
} from "@/core/three/shaders/atmosphereShader";

interface AtmosphereMeshProps {
  size: number;
  baseColor: string;
}

export default function AtmosphereMesh({
  size,
  baseColor,
}: AtmosphereMeshProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const brighterColor = useMemo(() => {
    const c = new THREE.Color(baseColor);
    c.multiplyScalar(1.3);
    return c;
  }, [baseColor]);

  return (
    <mesh scale={1.05}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={{
          atmosphereColor: { value: new THREE.Color(brighterColor) },
          atmosphereIntensity: { value: 0.35 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
