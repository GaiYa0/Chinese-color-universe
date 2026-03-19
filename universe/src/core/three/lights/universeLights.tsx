"use client";

import { Suspense } from "react";
import { Environment } from "@react-three/drei";

export const universeDirectionalLightPreset = {
  position: [30, 20, 10] as [number, number, number],
  intensity: 2.5,
  shadowMapSize: [2048, 2048] as [number, number],
  shadowFar: 80,
  shadowLeft: -30,
  shadowRight: 30,
  shadowTop: 30,
  shadowBottom: -30,
};

export const universeAmbientLightPreset = {
  intensity: 0.25,
};

export const universePointLightPreset = {
  position: [-20, 10, -10] as [number, number, number],
  intensity: 0.9,
  color: "#ffffff",
};

export function UniverseEnvironment() {
  return (
    <Suspense fallback={null}>
      <Environment preset="sunset" />
    </Suspense>
  );
}
