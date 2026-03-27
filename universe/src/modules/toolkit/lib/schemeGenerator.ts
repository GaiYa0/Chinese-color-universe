/**
 * 配色方案：基于 HSL 和谐角 + 优先队列 Top-K 最近中国色
 */

import type { ColorEntity } from "@/entities/color/model/color.types";
import { topKSmallest } from "./binaryHeap";
import { hslToRgb, parseHex, rgbToHsl, type RGB } from "./colorSpace";
import type { KDPoint } from "./kdTree";
import { KDTree } from "./kdTree";

export type HarmonyMode = "analogous" | "complementary" | "triadic" | "split";

function hslTargets(baseH: number, mode: HarmonyMode): number[] {
  const h = ((baseH % 360) + 360) % 360;
  switch (mode) {
    case "analogous":
      return [h, (h + 30) % 360, (h - 30 + 360) % 360];
    case "complementary":
      return [h, (h + 180) % 360];
    case "triadic":
      return [h, (h + 120) % 360, (h + 240) % 360];
    case "split":
      return [h, (h + 150) % 360, (h + 210) % 360];
    default:
      return [h];
  }
}

export interface SchemeCandidate {
  color: ColorEntity;
  distance: number;
  role: string;
}

function rgbToPoint(rgb: RGB): [number, number, number] {
  return [rgb.r, rgb.g, rgb.b];
}

function buildTree(colors: ColorEntity[]): KDTree<ColorEntity> {
  const points: KDPoint<ColorEntity>[] = colors.map((c) => ({
    coords: [c.rgb[0], c.rgb[1], c.rgb[2]] as [number, number, number],
    data: c,
  }));
  return new KDTree(points);
}

/**
 * 生成配色：对每个目标色相找 KD-Tree 最近中国色，再用最小堆按距离取全局最优 Top-K 条（去重名）
 */
export function generateChineseSchemes(
  baseHex: string,
  colors: ColorEntity[],
  mode: HarmonyMode,
  topK: number
): SchemeCandidate[] {
  const rgbParsed = parseHex(baseHex);
  if (!rgbParsed) return [];

  const { h, s, l } = rgbToHsl(rgbParsed);
  const hues = hslTargets(h, mode);
  const tree = buildTree(colors);

  const candidates: { dist: number; color: ColorEntity; role: string }[] = [];

  hues.forEach((hue, idx) => {
    const role = ["主色", "辅色一", "辅色二", "辅色三"][idx] ?? `色${idx + 1}`;
    const targetRgb = hslToRgb({ h: hue, s, l });
    const pt: [number, number, number] = [targetRgb.r, targetRgb.g, targetRgb.b];
    const nearest = tree.nearest(pt);
    if (!nearest) return;
    const d = Math.sqrt(
      (nearest.coords[0] - pt[0]) ** 2 +
        (nearest.coords[1] - pt[1]) ** 2 +
        (nearest.coords[2] - pt[2]) ** 2
    );
    candidates.push({ dist: d, color: nearest.data, role });
  });

  // 扩展候选：同和谐角下轻微调整明度，再用优先队列取 Top-K（距离更小更优）
  const extras: typeof candidates = [];
  hues.forEach((hue, idx) => {
    const role = ["变体·浅", "变体·深"][idx % 2] ?? "变体";
    for (const dl of [-8, 8]) {
      const targetRgb = hslToRgb({ h: hue, s, l: Math.max(5, Math.min(95, l + dl)) });
      const pt: [number, number, number] = [targetRgb.r, targetRgb.g, targetRgb.b];
      const nearest = tree.nearest(pt);
      if (!nearest) return;
      const d = Math.sqrt(
        (nearest.coords[0] - pt[0]) ** 2 +
          (nearest.coords[1] - pt[1]) ** 2 +
          (nearest.coords[2] - pt[2]) ** 2
      );
      extras.push({ dist: d, color: nearest.data, role });
    }
  });

  const merged = [...candidates, ...extras];
  const best = topKSmallest(merged, Math.min(topK * 2, merged.length), (a, b) => a.dist - b.dist);

  const seen = new Set<string>();
  const dedup: SchemeCandidate[] = [];
  for (const r of best) {
    if (seen.has(r.color.name)) continue;
    seen.add(r.color.name);
    dedup.push({ color: r.color, distance: r.dist, role: r.role });
    if (dedup.length >= topK) break;
  }

  return dedup;
}

/**
 * 优先队列 Top-K：从候选中国色中按与目标 RGB 的距离取最小的 K 个
 */
export function topKNearestChinese(
  targetRgb: RGB,
  colors: ColorEntity[],
  k: number
): { color: ColorEntity; distance: number }[] {
  const tree = buildTree(colors);
  const pt = rgbToPoint(targetRgb);
  const nearest = tree.nearestK(pt, Math.min(k, colors.length));
  return nearest.map((p) => ({
    color: p.data,
    distance: Math.sqrt(
      (p.coords[0] - pt[0]) ** 2 +
        (p.coords[1] - pt[1]) ** 2 +
        (p.coords[2] - pt[2]) ** 2
    ),
  }));
}

/** 使用二叉堆从全体颜色中选距离最小的 K 个（与 KD-Tree 结果对照用） */
export function topKNearestByHeap(
  targetRgb: RGB,
  colors: ColorEntity[],
  k: number
): { color: ColorEntity; distance: number }[] {
  const pt = rgbToPoint(targetRgb);
  const scored = colors.map((c) => {
    const p = c.rgb;
    const d = Math.sqrt((p[0] - pt[0]) ** 2 + (p[1] - pt[1]) ** 2 + (p[2] - pt[2]) ** 2);
    return { color: c, distance: d };
  });
  return topKSmallest(scored, k, (a, b) => a.distance - b.distance);
}
