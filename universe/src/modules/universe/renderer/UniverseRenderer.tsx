"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import type { ChineseColor } from "@/shared/types";
import { universeCameraPreset } from "@/core/three/camera/cameraPresets";
import { universeCanvasPreset } from "@/core/three/effects/postprocessingPresets";
import UniverseContent from "@/modules/universe/scene/UniverseContent";

interface UniverseRendererProps {
  colors: ChineseColor[];
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}

export default function UniverseRenderer({
  colors,
  onHover,
  onSelect,
}: UniverseRendererProps) {
  return (
    <Canvas
      camera={universeCameraPreset}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      onCreated={({ gl }) => gl.setClearColor(universeCanvasPreset.clearColor)}
      dpr={universeCanvasPreset.dpr}
      shadows
    >
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        }
      >
        <UniverseContent colors={colors} onHover={onHover} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
