/**
 * 工具页 Tab 与「中国色」主题配置（供发光卡片使用）
 */
export const TOOLKIT_TAB_IDS = [
  "converter",
  "match",
  "picker",
  "gradient",
  "image",
  "scheme",
  "similar",
] as const;

export type ToolkitTabId = (typeof TOOLKIT_TAB_IDS)[number];

export interface ToolkitToolTheme {
  id: ToolkitTabId;
  label: string;
  sub: string;
  /** 中国色名（展示用） */
  pigment: string;
  /** 主色 HEX */
  accent: string;
  /** 辅助高光（渐变边框用） */
  accentSoft: string;
}

export const TOOLKIT_TOOL_THEMES: ToolkitToolTheme[] = [
  {
    id: "converter",
    label: "颜色转换",
    sub: "HEX / RGB / HSL",
    pigment: "天青",
    accent: "#78A0B4",
    accentSoft: "#A8C5D4",
  },
  {
    id: "match",
    label: "中国色匹配",
    sub: "KD-Tree 最近邻",
    pigment: "紫藤",
    accent: "#8B7AB8",
    accentSoft: "#B8A9D4",
  },
  {
    id: "picker",
    label: "调色器",
    sub: "实时选色 · HSL",
    pigment: "珊瑚",
    accent: "#E8A598",
    accentSoft: "#F5C4B8",
  },
  {
    id: "gradient",
    label: "渐变生成",
    sub: "CSS 线性渐变",
    pigment: "松石绿",
    accent: "#26A69A",
    accentSoft: "#4DD0C4",
  },
  {
    id: "image",
    label: "图片取色",
    sub: "K-Means 主色",
    pigment: "杏黄",
    accent: "#E8A84A",
    accentSoft: "#F5C96A",
  },
  {
    id: "scheme",
    label: "配色方案",
    sub: "传统配色库 · Top-K",
    pigment: "藕荷",
    accent: "#C9A7BE",
    accentSoft: "#E1C4D8",
  },
  {
    id: "similar",
    label: "相似推荐",
    sub: "KD-Tree K 近邻",
    pigment: "湖蓝",
    accent: "#3D9BC4",
    accentSoft: "#6BB8D9",
  },
];
