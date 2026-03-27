/**
 * 国风推荐渐变：起点/终点 HEX + 角度
 * 色值贴近项目 colors.json 中常见中国色意象
 */
export interface GradientPreset {
  id: string;
  name: string;
  /** 文化意象短说明 */
  note: string;
  from: string;
  to: string;
  angle: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "qing-zi",
    name: "青绿映紫",
    note: "青瓷釉色过渡到紫藤，国风界面常用",
    from: "#26A69A",
    to: "#7C4DFF",
    angle: 135,
  },
  {
    id: "gongqiang",
    name: "宫墙夕照",
    note: "朱红宫墙与暖杏黄",
    from: "#C62828",
    to: "#FFA726",
    angle: 120,
  },
  {
    id: "dunhuang",
    name: "敦煌印象",
    note: "石青矿物色与藤黄",
    from: "#1565C0",
    to: "#FFD54F",
    angle: 145,
  },
  {
    id: "tianqing",
    name: "雨过天青",
    note: "月白到天缥，汝窑意象",
    from: "#E8F4F8",
    to: "#B8E0E8",
    angle: 180,
  },
  {
    id: "shuimo",
    name: "水墨氤氲",
    note: "黛蓝渐入月白，纸本水墨",
    from: "#37474F",
    to: "#ECEFF1",
    angle: 160,
  },
  {
    id: "chunshan",
    name: "春山如黛",
    note: "柳绿与天缥，远山如黛",
    from: "#81C784",
    to: "#B8E0E8",
    angle: 125,
  },
  {
    id: "yelan",
    name: "夜读灯暖",
    note: "玄青夜色到琥珀灯晕",
    from: "#212121",
    to: "#FF8F00",
    angle: 35,
  },
  {
    id: "fencai",
    name: "粉彩瓷韵",
    note: "桃粉到湖蓝，粉彩瓷盘感",
    from: "#F48FB1",
    to: "#0288D1",
    angle: 115,
  },
];
