/**
 * 中国色宇宙 - 共享类型定义
 */

import type { ColorEntity } from "@/entities/color/model/color.types";

export type ChineseColor = ColorEntity;

export interface CulturalRelationNode {
  id: string;
  type: "color" | "relic" | "dynasty" | "location" | "poet";
}

export interface CulturalRelationEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface CulturalRelations {
  nodes: CulturalRelationNode[];
  edges: CulturalRelationEdge[];
  color_evolution?: { from: string; to: string }[];
}

export interface CityData {
  id: string;
  name: string;
  x: number;
  y: number;
  colors: string[];
  culture: string;
}

export interface CulturalMap {
  cities: CityData[];
  routes?: { from: string; to: string; distance: number; culture_score: number }[];
}

export interface ColorGroup {
  name: string;
  colors: string[];
}

/** 朝代时间轴条目：色名与 paletteHex 与 public/data/colors.json 一致 */
export interface DynastyTimelineEntry {
  id: string;
  name: string;
  start: number;
  end: number;
  /** 该朝代表色名称（与色谱数据 name 一致） */
  colors: string[];
  /** 主色 HEX（通常取 colors[0] 在文档中的值） */
  themeHex: string;
  /** 与 colors[] 一一对应的文档内 HEX（与 colors.json 同步） */
  paletteHex: string[];
}

/**
 * 朝代时间轴（色值来自项目 colors 数据源）
 * paletteHex 顺序与 colors[] 严格对应，便于离线展示与校验
 */
export const DYNASTY_TIMELINE: DynastyTimelineEntry[] = [
  {
    id: "xia",
    name: "夏商周",
    start: -2070,
    end: -256,
    colors: ["玄色", "皂色"],
    themeHex: "#212121",
    paletteHex: ["#212121", "#1A237E"],
  },
  {
    id: "qinhan",
    name: "秦汉",
    start: -221,
    end: 220,
    colors: ["绛红", "玄色", "赭石"],
    themeHex: "#8B0000",
    paletteHex: ["#8B0000", "#212121", "#795548"],
  },
  {
    id: "tang",
    name: "唐",
    start: 618,
    end: 907,
    colors: ["胭脂", "石青", "秘色", "藤黄"],
    themeHex: "#9D2933",
    paletteHex: ["#9D2933", "#1565C0", "#80CBC4", "#FFD54F"],
  },
  {
    id: "song",
    name: "宋",
    start: 960,
    end: 1279,
    colors: ["天青", "月白", "影青", "豆绿"],
    themeHex: "#4A5568",
    paletteHex: ["#4A5568", "#E8F4F8", "#B2DFDB", "#66BB6A"],
  },
  {
    id: "yuan",
    name: "元",
    start: 1271,
    end: 1368,
    colors: ["鸦青", "孔雀绿"],
    themeHex: "#455A64",
    paletteHex: ["#455A64", "#009688"],
  },
  {
    id: "ming",
    name: "明",
    start: 1368,
    end: 1644,
    colors: ["朱红", "黛蓝", "官绿"],
    themeHex: "#C62828",
    paletteHex: ["#C62828", "#37474F", "#388E3C"],
  },
  {
    id: "qing",
    name: "清",
    start: 1644,
    end: 1912,
    colors: ["杏黄", "雪青", "瓜皮绿"],
    themeHex: "#FFA726",
    paletteHex: ["#FFA726", "#B39DDB", "#43A047"],
  },
];
