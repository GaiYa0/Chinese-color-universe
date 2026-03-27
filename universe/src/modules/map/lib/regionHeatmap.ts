/**
 * 城市→省份映射，用于区域热力图
 * 省份名需与 GeoJSON 中 properties.name 一致（datav.aliyun 格式）
 */
import type { CityData } from "@/shared/types";

const CITY_TO_PROVINCE: Record<string, string> = {
  北京: "北京",
  上海: "上海",
  天津: "天津",
  重庆: "重庆",
  西安: "陕西",
  咸阳: "陕西",
  蓝田: "陕西",
  洛阳: "河南",
  开封: "河南",
  汝州: "河南",
  郑州: "河南",
  安阳: "河南",
  禹州: "河南",
  定州: "河北",
  定窑: "河北",
  邯郸: "河北",
  济南: "山东",
  曲阜: "山东",
  南京: "江苏",
  苏州: "江苏",
  南通: "江苏",
  扬州: "江苏",
  宜兴: "江苏",
  杭州: "浙江",
  绍兴: "浙江",
  湖州: "浙江",
  龙泉: "浙江",
  昌化: "浙江",
  安吉: "浙江",
  富春: "浙江",
  景德镇: "江西",
  龙虎山: "江西",
  德化: "福建",
  建阳: "福建",
  徽州: "安徽",
  宣城: "安徽",
  亳州: "安徽",
  荆州: "湖北",
  长沙: "湖南",
  广州: "广东",
  合浦: "广西",
  成都: "四川",
  贵阳: "贵州",
  昆明: "云南",
  拉萨: "西藏",
  敦煌: "甘肃",
  和田: "新疆",
  呼和浩特: "内蒙古",
  五台山: "山西",
};

// 部分 GeoJSON 使用简称，统一映射
const PROVINCE_ALIAS: Record<string, string> = {
  内蒙古自治区: "内蒙古",
  广西壮族自治区: "广西",
  西藏自治区: "西藏",
  新疆维吾尔自治区: "新疆",
  宁夏回族自治区: "宁夏",
};

export interface RegionData {
  name: string; // 省份名
  value: number; // 文化色彩密度（颜色总数）
  cities: CityData[];
  colorCount: number;
}

/**
 * 按省份聚合城市，计算文化色彩密度
 */
export function buildRegionHeatmapData(cities: CityData[]): RegionData[] {
  const byProvince = new Map<string, { cities: CityData[]; colorCount: number }>();

  for (const city of cities) {
    const province = CITY_TO_PROVINCE[city.name] ?? inferProvinceByCoords(city);
    if (!province) continue;

    const key = PROVINCE_ALIAS[province] ?? province;
    const cur = byProvince.get(key) ?? { cities: [], colorCount: 0 };
    cur.cities.push(city);
    cur.colorCount += city.colors?.length ?? 0;
    byProvince.set(key, cur);
  }

  return Array.from(byProvince.entries())
    .map(([name, { cities: regCities, colorCount }]) => ({
      name,
      value: colorCount,
      cities: regCities,
      colorCount,
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** 根据经纬度推断省份（简化版，按区域） */
function inferProvinceByCoords(city: CityData): string | null {
  const x = city.x ?? 0;
  const y = city.y ?? 0;
  // 按中国行政区大致范围
  if (x >= 115 && x <= 118 && y >= 28 && y <= 32) return "江西";
  if (x >= 118 && x <= 123 && y >= 27 && y <= 35) return "江苏";
  if (x >= 118 && x <= 123 && y >= 26 && y <= 31) return "浙江";
  if (x >= 113 && x <= 119 && y >= 31 && y <= 37) return "河南";
  if (x >= 116 && x <= 119 && y >= 36 && y <= 42) return "河北";
  if (x >= 116 && x <= 123 && y >= 35 && y <= 38) return "山东";
  if (x >= 117 && x <= 120 && y >= 24 && y <= 28) return "福建";
  if (x >= 112 && x <= 115 && y >= 28 && y <= 31) return "湖南";
  if (x >= 112 && x <= 118 && y >= 29 && y <= 34) return "湖北";
  if (x >= 110 && x <= 115 && y >= 30 && y <= 35) return "陕西";
  if (x >= 103 && x <= 110 && y >= 28 && y <= 33) return "四川";
  if (x >= 102 && x <= 107 && y >= 24 && y <= 27) return "云南";
  if (x >= 88 && x <= 97 && y >= 28 && y <= 36) return "西藏";
  if (x >= 73 && x <= 97 && y >= 35 && y <= 50) return "新疆";
  if (x >= 93 && x <= 99 && y >= 38 && y <= 43) return "甘肃";
  if (x >= 105 && x <= 109 && y >= 25 && y <= 29) return "贵州";
  if (x >= 108 && x <= 115 && y >= 18 && y <= 26) return "广西";
  if (x >= 112 && x <= 118 && y >= 21 && y <= 26) return "广东";
  return null;
}
