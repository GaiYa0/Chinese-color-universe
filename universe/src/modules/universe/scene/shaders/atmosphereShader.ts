export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  uniform vec3 atmosphereColor;
  uniform float atmosphereIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 4.0);
    float alpha = fresnel * atmosphereIntensity;
    gl_FragColor = vec4(atmosphereColor, alpha);
  }
`;
