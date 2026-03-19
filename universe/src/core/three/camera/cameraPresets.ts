export const universeCameraPreset = {
  position: [0, 24, 28] as [number, number, number],
  fov: 42,
};

export const universeOrbitPreset = {
  minDistance: 2.5,
  maxDistance: 36,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: Math.PI / 2,
  target: [0, 0, 0] as [number, number, number],
  autoRotate: true,
  autoRotateSpeed: 0.25,
};
