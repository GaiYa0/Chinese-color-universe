/**
 * 中国色宇宙 · 行星级渲染工具
 * 文化材质映射、地形几何、纹理生成
 */

import * as THREE from "three";
import { createNoise2D, createNoise3D } from "simplex-noise";

export type CultureType =
  | "celadon" // 青瓷釉面
  | "palace" // 宫墙岩石
  | "ink" // 水墨云雾
  | "jade" // 玉石晶体
  | "mineral" // 岩彩矿物
  | "ink_stone"; // 墨石行星

/** 根据颜色名/relic 映射文化材质类型 */
export function getCultureType(name: string, relic?: string): CultureType {
  const s = `${name}${relic ?? ""}`;
  if (/天青|青瓷|秘色|豆绿|影青|釉|瓷/.test(s)) return "celadon";
  if (/朱红|宫墙|绛|胭脂|中国红|银朱|丹砂|红墙/.test(s)) return "palace";
  if (/黛|墨|鸦|皂|玄|乌金|苍黑|水墨/.test(s)) return "ink";
  if (/月白|玉色|霜白|象牙|翡翠|碧玉|玉石/.test(s)) return "jade";
  if (/石青|藤黄|赭石|敦煌|壁画|矿物|岩/.test(s)) return "mineral";
  return "celadon"; // 默认青瓷感
}

/** 创建带程序化地形的球体几何体（使用 SphereGeometry 避免低模多面体黑线） */
export function createPlanetGeometry(
  radius: number,
  widthSegments: number,
  displacement: number,
  seed: number
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, widthSegments, widthSegments);
  geo.computeVertexNormals();

  const noise3 = createNoise3D(() => seed);
  const pos = geo.attributes.position;
  const normals = geo.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = normals.getX(i);
    const ny = normals.getY(i);
    const nz = normals.getZ(i);

    const f = 2.5;
    const n0 = noise3(x * f, y * f, z * f) * 0.5 + 0.5;
    const n1 = noise3(x * f * 1.3 + 100, y * f * 1.3, z * f * 1.3) * 0.5 + 0.5;
    const n2 = noise3(x * f * 2 + 200, y * f * 2, z * f * 2) * 0.5 + 0.5;

    const combined = n0 * 0.6 + n1 * 0.3 + n2 * 0.1;
    const disp = combined * displacement;

    pos.setXYZ(i, x + nx * disp, y + ny * disp, z + nz * disp);
  }

  geo.computeVertexNormals();
  return geo;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** 根据文化类型创建程序化颜色纹理 */
export function createCultureTexture(
  hex: string,
  cultureType: CultureType,
  size = 128
): THREE.DataTexture {
  const c = new THREE.Color(hex);
  const data = new Uint8Array(size * size * 4);
  const noise2 = createNoise2D(() => 42);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const i = (y * size + x) * 4;

      let r = c.r,
        g = c.g,
        b = c.b;

      // 统一使用极细微的噪点，避免强烈花纹/墨晕/裂纹带来的「感染感」
      const n = (noise2(u * 3, v * 3) * 0.5 + 0.5 - 0.5) * 0.05;
      const n2 = (seededRandom(x * 7 + y * 11) - 0.5) * 0.03;
      r = Math.max(0, Math.min(1, r + n + n2));
      g = Math.max(0, Math.min(1, g + n + n2));
      b = Math.max(0, Math.min(1, b + n + n2));

      data[i] = Math.floor(r * 255);
      data[i + 1] = Math.floor(g * 255);
      data[i + 2] = Math.floor(b * 255);
      data[i + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** 创建粗糙度纹理 */
export function createRoughnessTexture(size = 64, seed = 11): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = Math.floor(seededRandom(i * seed) * 180 + 75);
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** 创建云层噪声纹理 (Perlin/Simplex 分形) */
export function createCloudTexture(size = 128): THREE.DataTexture {
  const noise2 = createNoise2D(() => 123);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n =
        (noise2(u * 6, v * 6) * 0.5 + 0.5) * 0.5 +
        (noise2(u * 12, v * 12) * 0.5 + 0.5) * 0.3 +
        (noise2(u * 24, v * 24) * 0.5 + 0.5) * 0.2;
      const a = n > 0.4 ? (n - 0.4) * 1.2 : 0;
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.floor(a * 200);
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
