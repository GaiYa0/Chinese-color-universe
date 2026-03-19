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

// 朝代时间轴
export const DYNASTY_TIMELINE = [
  { id: "xia", name: "夏商周", start: -2070, end: -256, colors: ["玄色", "皂色"] },
  { id: "qinhan", name: "秦汉", start: -221, end: 220, colors: ["绛红", "玄色", "赭石"] },
  { id: "tang", name: "唐", start: 618, end: 907, colors: ["胭脂", "石青", "秘色", "藤黄"] },
  { id: "song", name: "宋", start: 960, end: 1279, colors: ["天青", "月白", "影青", "豆绿"] },
  { id: "yuan", name: "元", start: 1271, end: 1368, colors: ["鸦青", "孔雀绿"] },
  { id: "ming", name: "明", start: 1368, end: 1644, colors: ["朱红", "黛蓝", "官绿"] },
  { id: "qing", name: "清", start: 1644, end: 1912, colors: ["杏黄", "雪青", "瓜皮绿"] },
];
