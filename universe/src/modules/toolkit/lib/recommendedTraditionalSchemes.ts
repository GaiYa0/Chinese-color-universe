/**
 * 色工具「配色方案」默认推荐：每组色名均应对项目 colors 数据源中的条目。
 * 主题与分类立足中国传统审美，供一键载入为基准色并配合下方算法生成。
 */

export interface RecommendedTraditionalScheme {
  id: string;
  name: string;
  description: string;
  /** 展示用分类标签 */
  tags: string[];
  /** 与色谱 name 一致，顺序即推荐搭配顺序 */
  colorNames: string[];
}

export const RECOMMENDED_TRADITIONAL_SCHEMES: RecommendedTraditionalScheme[] = [
  {
    id: "spring-blossom",
    name: "春日花信",
    description: "嫩粉新绿与鹅黄，如春园初绽。",
    tags: ["四季"],
    colorNames: ["樱草", "桃红", "柳绿", "鹅黄"],
  },
  {
    id: "jiangnan-water",
    name: "江南水乡",
    description: "天水映月、石青点染，如水墨江南。",
    tags: ["山水"],
    colorNames: ["天水碧", "月白", "石青", "蟹青"],
  },
  {
    id: "forbidden-city",
    name: "宫墙朱韵",
    description: "宫红、杏黄与玄色，庄重华贵。",
    tags: ["建筑"],
    colorNames: ["朱红", "杏黄", "玄色", "琥珀"],
  },
  {
    id: "blue-white-porcelain",
    name: "青花瓷韵",
    description: "天青为底，月白与靛青相生，如青花瓷器。",
    tags: ["文化"],
    colorNames: ["天青", "月白", "靛青", "秘色"],
  },
  {
    id: "rouge-dressing",
    name: "胭脂妆台",
    description: "胭脂、妃色与藕荷，柔媚典雅。",
    tags: ["花卉"],
    colorNames: ["胭脂", "妃色", "藕荷", "丁香"],
  },
  {
    id: "lotus-pond",
    name: "荷塘月色",
    description: "碧绿、藕荷与月白，夏夜清荷。",
    tags: ["自然"],
    colorNames: ["碧绿", "藕荷", "月白", "松石绿"],
  },
  {
    id: "bamboo-grove",
    name: "竹林清韵",
    description: "竹青、艾绿与茶绿，疏朗清幽。",
    tags: ["自然"],
    colorNames: ["竹青", "艾绿", "月白", "茶绿"],
  },
  {
    id: "mid-autumn",
    name: "中秋月夜",
    description: "月白、秋香与黛蓝，秋夜澄明。",
    tags: ["节日"],
    colorNames: ["月白", "秋香", "黛蓝", "琥珀"],
  },
  {
    id: "dragon-auspicious",
    name: "龙腾瑞气",
    description: "朱红、藤黄与玄色，节庆祥瑞。",
    tags: ["文化"],
    colorNames: ["朱红", "藤黄", "玄色", "琥珀黄"],
  },
  {
    id: "ink-wash",
    name: "水墨丹青",
    description: "墨色、赭石与蟹青，书画意境。",
    tags: ["文化"],
    colorNames: ["墨色", "月白", "赭石", "蟹青"],
  },
];

export const RECOMMENDED_SCHEME_TAGS = [
  "全部",
  "四季",
  "山水",
  "建筑",
  "文化",
  "花卉",
  "自然",
  "节日",
] as const;

export function getRecommendedSchemeById(
  id: string
): RecommendedTraditionalScheme | undefined {
  return RECOMMENDED_TRADITIONAL_SCHEMES.find((s) => s.id === id);
}

/** 取方案前四色 HEX（用于纹饰四层叠放），不足补灰 */
export function resolveSchemePaletteHex(
  scheme: RecommendedTraditionalScheme,
  colors: { name: string; hex: string }[]
): [string, string, string, string] {
  const map = new Map(colors.map((c) => [c.name, c.hex]));
  const hexes = scheme.colorNames.map((n) => map.get(n)).filter(Boolean) as string[];
  const out = [...hexes];
  while (out.length < 4) out.push("#6B7280");
  return [out[0], out[1], out[2], out[3]];
}
