import type { RegionData } from "./regionHeatmap";

/** GeoJSON 省份名称的可能格式（datav.aliyun 等） */
const PROVINCE_NAMES: Record<string, string[]> = {
  北京: ["北京", "北京市"],
  上海: ["上海", "上海市"],
  天津: ["天津", "天津市"],
  重庆: ["重庆", "重庆市"],
  河北: ["河北", "河北省"],
  山西: ["山西", "山西省"],
  内蒙古: ["内蒙古", "内蒙古自治区"],
  辽宁: ["辽宁", "辽宁省"],
  吉林: ["吉林", "吉林省"],
  黑龙江: ["黑龙江", "黑龙江省"],
  江苏: ["江苏", "江苏省"],
  浙江: ["浙江", "浙江省"],
  安徽: ["安徽", "安徽省"],
  福建: ["福建", "福建省"],
  江西: ["江西", "江西省"],
  山东: ["山东", "山东省"],
  河南: ["河南", "河南省"],
  湖北: ["湖北", "湖北省"],
  湖南: ["湖南", "湖南省"],
  广东: ["广东", "广东省"],
  广西: ["广西", "广西壮族自治区"],
  海南: ["海南", "海南省"],
  四川: ["四川", "四川省"],
  贵州: ["贵州", "贵州省"],
  云南: ["云南", "云南省"],
  西藏: ["西藏", "西藏自治区"],
  陕西: ["陕西", "陕西省"],
  甘肃: ["甘肃", "甘肃省"],
  青海: ["青海", "青海省"],
  宁夏: ["宁夏", "宁夏回族自治区"],
  新疆: ["新疆", "新疆维吾尔自治区"],
};

/** 为每个省份生成地图数据；多名称以兼容不同 GeoJSON（北京/北京市 等） */
function buildMapData(regionData: RegionData[]): { name: string; value: number; regionKey: string }[] {
  const out: { name: string; value: number; regionKey: string }[] = [];
  for (const r of regionData) {
    const names = PROVINCE_NAMES[r.name] ?? [r.name];
    for (const n of names) {
      out.push({ name: n, value: r.value, regionKey: r.name });
    }
  }
  return out;
}

export function createChinaHeatmapOption(params: { regionData: RegionData[] }) {
  const { regionData } = params;
  const maxVal = Math.max(1, ...regionData.map((r) => r.value));
  const minVal = Math.min(...regionData.map((r) => r.value), 1);

  // 每个省份多条 name 以兼容不同 GeoJSON 命名（北京/北京市 等）
  const mapData = buildMapData(regionData);

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: (params: { data?: { name?: string; value?: number; regionKey?: string } }) => {
        const d = params?.data;
        if (!d) return "";
        const region = regionData.find((r) => r.name === d.regionKey || r.name === d.name);
        const cityCount = region?.cities?.length ?? 0;
        const colorCount = d.value ?? 0;
        return `<div style="padding:8px 12px">
          <strong style="color:#26A69A">${d.name}</strong><br/>
          <span style="color:rgba(255,255,255,0.85)">${cityCount} 座城市 · ${colorCount} 种文化色</span>
        </div>`;
      },
      backgroundColor: "rgba(10,20,35,0.95)",
      borderColor: "rgba(38, 166, 154, 0.4)",
      textStyle: { color: "#e6edf3", fontSize: 12 },
    },
    visualMap: {
      type: "continuous",
      min: minVal,
      max: maxVal,
      calculable: true,
      inRange: {
        color: [
          "rgba(30, 60, 90, 0.4)",  // 低
          "rgba(38, 166, 154, 0.5)", // 中
          "rgba(0, 150, 136, 0.75)", // 高
          "rgba(0, 121, 107, 0.9)",  // 最高
        ],
      },
      text: ["高", "低"],
      textStyle: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
      left: "left",
      bottom: 24,
      itemWidth: 12,
      itemHeight: 80,
    },
    series: [
      {
        type: "map",
        map: "china",
        roam: true,
        zoom: 1.15,
        label: { show: false },
        data: mapData,
        itemStyle: {
          areaColor: "rgba(30, 60, 90, 0.5)",
          borderColor: "rgba(100, 150, 200, 0.45)",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgba(50, 120, 160, 0.7)",
            borderColor: "rgba(38, 166, 154, 0.85)",
            borderWidth: 2,
          },
          label: { show: true, color: "#fff", fontSize: 12 },
        },
      },
    ],
  };
}
