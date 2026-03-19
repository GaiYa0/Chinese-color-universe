"use client";

import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import type { ChineseColor } from "@/shared/types";
import { universeOrbitPreset } from "@/core/three/camera/cameraPresets";
import { universeBloomPreset } from "@/core/three/effects/postprocessingPresets";
import {
  universeAmbientLightPreset,
  universeDirectionalLightPreset,
  UniverseEnvironment,
  universePointLightPreset,
} from "@/core/three/lights/universeLights";
import CentralStar from "@/modules/universe/scene/objects/CentralStar";
import ColorPlanet from "@/modules/universe/scene/objects/ColorPlanet";
import StarParticles from "@/modules/universe/scene/objects/StarParticles";

interface UniverseContentProps {
  colors: ChineseColor[];
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}

export default function UniverseContent({
  colors,
  onHover,
  onSelect,
}: UniverseContentProps) {
  const displayColors = (colors ?? []).slice(0, 45);

  return (
    <>
      <ambientLight intensity={universeAmbientLightPreset.intensity} />
      <directionalLight
        position={universeDirectionalLightPreset.position}
        intensity={universeDirectionalLightPreset.intensity}
        castShadow
        shadow-mapSize={universeDirectionalLightPreset.shadowMapSize}
        shadow-camera-far={universeDirectionalLightPreset.shadowFar}
        shadow-camera-left={universeDirectionalLightPreset.shadowLeft}
        shadow-camera-right={universeDirectionalLightPreset.shadowRight}
        shadow-camera-top={universeDirectionalLightPreset.shadowTop}
        shadow-camera-bottom={universeDirectionalLightPreset.shadowBottom}
      />
      <pointLight
        position={universePointLightPreset.position}
        intensity={universePointLightPreset.intensity}
        color={universePointLightPreset.color}
      />
      <UniverseEnvironment />
      <StarParticles />
      <Stars
        radius={100}
        depth={50}
        count={1200}
        factor={2}
        saturation={0.25}
        fade
        speed={0.2}
      />
      <Sparkles
        count={80}
        scale={30}
        size={0.7}
        speed={0.08}
        color="#a8d0f0"
        opacity={0.3}
      />
      <CentralStar onHover={onHover} onSelect={onSelect} />
      {displayColors.map((color, i) => (
        <ColorPlanet
          key={color.id ?? `${color.name}-${i}`}
          color={color}
          index={i}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={universeOrbitPreset.minDistance}
        maxDistance={universeOrbitPreset.maxDistance}
        minPolarAngle={universeOrbitPreset.minPolarAngle}
        maxPolarAngle={universeOrbitPreset.maxPolarAngle}
        target={universeOrbitPreset.target}
        autoRotate={universeOrbitPreset.autoRotate}
        autoRotateSpeed={universeOrbitPreset.autoRotateSpeed}
      />
      <EffectComposer>
        <Bloom {...universeBloomPreset} />
      </EffectComposer>
    </>
  );
}
