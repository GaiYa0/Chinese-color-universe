/**
 * 颜色工具：色系、聚类、热度
 */

import type { ChineseColor } from "@/shared/types";

export type ColorFamily = "红" | "橙" | "黄" | "绿" | "青" | "蓝" | "紫" | "黑白灰";

export type SourceType = "瓷器" | "织物" | "建筑" | "书画" | "其他";

const PRIORITY_COLORS = new Set([
  "中国红", "天青", "朱红", "月白", "石青", "影青", "秘色", "青瓷",
  "胭脂", "杏黄", "藤黄", "苍绿", "靛青", "黛蓝",
]);

export function getColorFamily(hex: string): ColorFamily {
  const [r, g, b] = hexToRgb(hex);
  const [h] = rgbToHsv(r, g, b);
  if (h <= 15 || h >= 345) return "红";
  if (h < 45) return "橙";
  if (h < 75) return "黄";
  if (h < 150) return "绿";
  if (h < 195) return "青";
  if (h < 255) return "蓝";
  if (h < 330) return "紫";
  return "黑白灰";
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const s = max === 0 ? 0 : (max - min) / max;
  const v = max;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s, v];
}

export function getHue(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsv(r, g, b)[0];
}

export function getLightness(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
}

export function getSaturation(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsv(r, g, b)[1];
}

export function getSource(relic?: string): SourceType {
  if (!relic) return "其他";
  if (/瓷|窑|釉/i.test(relic)) return "瓷器";
  if (/绢|帛|锦|绣|布|染|服|饰/i.test(relic)) return "织物";
  if (/墙|建筑|宫|殿|楼/i.test(relic)) return "建筑";
  if (/画|书法|墨|笔/i.test(relic)) return "书画";
  return "其他";
}

export function getCulturalHeat(color: ChineseColor): number {
  let heat = 0.5;
  if (PRIORITY_COLORS.has(color.name)) heat += 0.4;
  if (color.relic && /故宫|敦煌|汝窑|景德镇/i.test(color.relic)) heat += 0.2;
  if (color.dynasty && /宋|唐|明|清/i.test(color.dynasty)) heat += 0.1;
  return Math.min(1, heat);
}

export function searchColors(colors: ChineseColor[], query: string): ChineseColor[] {
  const q = query.trim().toLowerCase();
  if (!q) return colors;
  const hexMatch = q.match(/#?([a-f0-9]{6})/i);
  const rgbMatch = q.match(/rgb?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  return colors.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.hex.toLowerCase().includes(q)) return true;
    if (hexMatch && c.hex.toLowerCase().includes(hexMatch[1])) return true;
    if (rgbMatch && c.rgb[0] === +rgbMatch[1] && c.rgb[1] === +rgbMatch[2] && c.rgb[2] === +rgbMatch[3]) return true;
    if (c.meaning?.toLowerCase().includes(q)) return true;
    if (c.relic?.toLowerCase().includes(q)) return true;
    if (c.story?.toLowerCase().includes(q)) return true;
    return false;
  });
}
