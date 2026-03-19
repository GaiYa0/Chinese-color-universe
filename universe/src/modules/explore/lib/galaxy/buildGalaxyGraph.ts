import type { ChineseColor } from "@/shared/types";
import {
  getCulturalHeat,
  getHue,
  getLightness,
  getSaturation,
  getSource,
  getColorFamily,
  type ColorFamily,
  type SourceType,
} from "@/modules/explore/lib/colorUtils";
import { simpleKMeans } from "@/modules/explore/lib/galaxy/simpleKMeans";

export interface GalaxyNodeData extends ChineseColor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  clusterId: number;
}

export interface GalaxyFilterState {
  filterFamily: ColorFamily | "";
  filterDynasty: string;
  filterSource: SourceType | "";
  lightnessRange: [number, number];
  saturationRange: [number, number];
}

export function getDynasties(colors: ChineseColor[]) {
  const set = new Set<string>();
  colors.forEach((c) => {
    if (c.dynasty) set.add(c.dynasty);
  });
  return Array.from(set).sort();
}

export function getFilteredColors(
  colors: ChineseColor[],
  filters: GalaxyFilterState
) {
  let result = colors;
  const {
    filterFamily,
    filterDynasty,
    filterSource,
    lightnessRange,
    saturationRange,
  } = filters;

  if (filterFamily) {
    result = result.filter((c) => getColorFamily(c.hex) === filterFamily);
  }
  if (filterDynasty) {
    result = result.filter((c) => c.dynasty === filterDynasty);
  }
  if (filterSource) {
    result = result.filter((c) => getSource(c.relic) === filterSource);
  }

  result = result.filter((c) => {
    const lightness = getLightness(c.hex);
    const saturation = getSaturation(c.hex);
    return (
      lightness >= lightnessRange[0] &&
      lightness <= lightnessRange[1] &&
      saturation >= saturationRange[0] &&
      saturation <= saturationRange[1]
    );
  });

  return result.slice(0, 120);
}

export function buildGalaxyNodes(filteredColors: ChineseColor[]): GalaxyNodeData[] {
  const hues = filteredColors.map((c) => getHue(c.hex));
  const k = Math.min(8, Math.ceil(filteredColors.length / 6));
  const clusters = simpleKMeans(hues, k);
  const byCluster = new Map<number, number[]>();

  clusters.forEach((cid, i) => {
    const arr = byCluster.get(cid) ?? [];
    arr.push(i);
    byCluster.set(cid, arr);
  });

  return filteredColors.map((c, i) => {
    const heat = getCulturalHeat(c);
    const radius = 14 + heat * 16;
    const clusterId = clusters[i] ?? 0;
    const idxInCluster = byCluster.get(clusterId)?.indexOf(i) ?? 0;
    const sizeOfCluster = byCluster.get(clusterId)?.length ?? 1;
    const angle =
      (clusterId / Math.max(k, 1)) * Math.PI * 2 +
      (idxInCluster / Math.max(sizeOfCluster, 1)) * 0.8;
    const distance = 180 + clusterId * 50 + (idxInCluster % 3) * 25;

    return {
      ...c,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      vx: 0,
      vy: 0,
      radius,
      hue: getHue(c.hex),
      clusterId,
    };
  });
}

export function buildGalaxyLinks(nodes: GalaxyNodeData[]) {
  const result: { source: GalaxyNodeData; target: GalaxyNodeData }[] = [];
  const byDynasty = new Map<string, GalaxyNodeData[]>();

  nodes.forEach((node) => {
    if (!node.dynasty) return;
    const arr = byDynasty.get(node.dynasty) ?? [];
    arr.push(node);
    byDynasty.set(node.dynasty, arr);
  });

  byDynasty.forEach((arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      result.push({ source: arr[i], target: arr[i + 1] });
    }
  });

  const byCluster = new Map<number, GalaxyNodeData[]>();
  nodes.forEach((node) => {
    const arr = byCluster.get(node.clusterId) ?? [];
    arr.push(node);
    byCluster.set(node.clusterId, arr);
  });

  byCluster.forEach((arr) => {
    for (let i = 0; i < Math.min(arr.length - 1, 3); i++) {
      result.push({ source: arr[i], target: arr[i + 1] });
    }
  });

  return result;
}
