/**
 * 数据加载工具
 * 服务端使用文件系统读取，避免 fetch 相对路径在 static export 时失败
 */

import { readFileSync } from "fs";
import path from "path";

import { normalizeColors } from "@/entities/color/model/color.mapper";
import type { RawColorEntity } from "@/entities/color/model/color.types";
import type {
  ChineseColor,
  CulturalRelations,
  CulturalMap,
  ColorGroup,
} from "@/shared/types";

function readJson<T>(filename: string): T {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    filename
  );
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export async function fetchColors(): Promise<ChineseColor[]> {
  const data = readJson<{ colors: RawColorEntity[] }>("colors.json");
  return normalizeColors(data.colors ?? []);
}

export async function fetchCulturalRelations(): Promise<CulturalRelations> {
  return readJson<CulturalRelations>("cultural_relations.json");
}

export async function fetchCulturalMap(): Promise<CulturalMap> {
  return readJson<CulturalMap>("cultural_map.json");
}

export async function fetchColorGroups(): Promise<ColorGroup[]> {
  const data = readJson<{ groups: ColorGroup[] }>("color_groups.json");
  return data.groups ?? [];
}

/** 根据 day of year 获取今日中国色（ deterministic） */
export function getTodayColor(colors: ChineseColor[]): ChineseColor {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % colors.length;
  return colors[index];
}
