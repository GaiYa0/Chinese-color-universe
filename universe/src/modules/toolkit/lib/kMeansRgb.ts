/**
 * K-Means 聚类（RGB 三维向量），用于图片主色提取
 */

export type RgbVec = [number, number, number];

function distSq(a: RgbVec, b: RgbVec): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function add(a: RgbVec, b: RgbVec): RgbVec {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: RgbVec, s: number): RgbVec {
  return [v[0] * s, v[1] * s, v[2] * s];
}

/**
 * @param samples RGB 向量列表
 * @param k 簇数量
 * @param maxIter 最大迭代次数
 */
export function kMeansRgb(samples: RgbVec[], k: number, maxIter = 15): RgbVec[] {
  const n = samples.length;
  if (n === 0 || k <= 0) return [];
  k = Math.min(k, n);

  const centroids: RgbVec[] = [];
  const step = Math.max(1, Math.floor(n / k));
  for (let i = 0; i < k; i++) {
    centroids.push([...samples[(i * step) % n]!] as RgbVec);
  }

  const assignments = new Int32Array(n);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;

    for (let i = 0; i < n; i++) {
      const p = samples[i]!;
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < k; j++) {
        const d = distSq(p, centroids[j]!);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }

    const sums: RgbVec[] = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array(k).fill(0);

    for (let i = 0; i < n; i++) {
      const c = assignments[i]!;
      sums[c] = add(sums[c]!, samples[i]!);
      counts[c]++;
    }

    for (let j = 0; j < k; j++) {
      if (counts[j]! > 0) {
        centroids[j] = scale(sums[j]!, 1 / counts[j]!);
      }
    }

    if (!changed && iter > 0) break;
  }

  return centroids;
}

/** 从 ImageData 采样像素为 RGB 向量（可 stride 降采样） */
export function imageDataToSamples(
  data: ImageData,
  stride = 4
): RgbVec[] {
  const { data: buf, width, height } = data;
  const out: RgbVec[] = [];
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const i = (y * width + x) * 4;
      const a = buf[i + 3] ?? 255;
      if (a < 16) continue;
      out.push([buf[i]!, buf[i + 1]!, buf[i + 2]!]);
    }
  }
  return out;
}
