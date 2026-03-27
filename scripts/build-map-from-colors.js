#!/usr/bin/env node
/**
 * 从 data/colors.json 生成中国色地图数据
 * 按 location 分组颜色，匹配到城市，输出 cultural_map.json
 */

const fs = require("fs");
const path = require("path");

// 地点 → 地图城市名（用于合并）
const LOC_TO_CITY = {
  河南汝州: "汝州",
  长安: "西安",
  浙江: "杭州",
  江西: "景德镇",
  大都: "北京",
  全国各地: "北京",
  全国: "北京",
  各地: "北京",
  安吉: "杭州",
  富春: "杭州",
  咸阳: "西安",
  关中: "西安",
  蓝田: "西安",
  江南: "苏州",
  西南: "成都",
  北方: "北京",
  福建: "建阳",
  湖南: "长沙",
  四川: "成都",
  广东: "广州",
  禹州: "禹州",
  昌化: "昌化",
  贵州: "贵阳",
  楚国: "荆州",
  银河: "开封",
};

// 城市坐标 [经度, 纬度]（用于 ECharts）
const CITY_COORDS = {
  北京: [116.4, 39.9],
  景德镇: [117.2, 29.3],
  敦煌: [94.8, 40.1],
  开封: [114.3, 34.8],
  苏州: [120.6, 31.3],
  杭州: [120.2, 30.3],
  西安: [108.9, 34.3],
  南京: [118.8, 32.1],
  南通: [121.0, 32.0],
  汝州: [112.8, 34.2],
  长沙: [112.9, 28.2],
  洛阳: [112.5, 34.7],
  成都: [104.1, 30.7],
  和田: [79.9, 37.1],
  龙泉: [119.1, 28.1],
  德化: [118.2, 25.5],
  建阳: [118.1, 27.3],
  徽州: [118.3, 29.7],
  绍兴: [120.6, 30.0],
  广州: [113.3, 23.1],
  昆明: [102.7, 25.0],
  湖州: [120.1, 30.9],
  上海: [121.5, 31.2],
  龙虎山: [116.9, 28.1],
  定窑: [114.7, 38.6],
  荆州: [112.2, 30.4],
  宣城: [118.8, 30.9],
  邯郸: [114.5, 36.6],
  济南: [117.0, 36.7],
  禹州: [113.5, 34.2],
  昌化: [119.2, 30.2],
  贵阳: [106.7, 26.6],
  扬州: [119.4, 32.4],
  五台山: [113.6, 38.7],
  定州: [115.0, 38.5],
  亳州: [115.8, 33.9],
  合浦: [109.2, 21.7],
  安阳: [114.4, 36.1],
  宜兴: [119.8, 31.4],
  曲阜: [116.99, 35.59],
  西藏: [91.1, 29.6],
};

// 城市文化描述
const CITY_CULTURE = {
  北京: "故宫、天坛、长城，皇家色彩荟萃",
  景德镇: "瓷都、御窑遗址，青白釉色代表",
  敦煌: "莫高窟、壁画，矿物颜料宝库",
  开封: "北宋都城、汝窑文化",
  苏州: "苏绣、园林，江南染织",
  杭州: "南宋都城、丝绸青瓷",
  西安: "十三朝古都，长安色彩",
  南京: "六朝古都，南唐遗韵",
  南通: "蓝印花布之乡",
  汝州: "汝窑发源地，天青釉故乡",
  长沙: "楚文化、马王堆帛画",
  洛阳: "十三朝古都，玄色起源",
  成都: "蜀锦、蜀绣",
  和田: "和田玉，碧绿玉色",
  龙泉: "龙泉青瓷",
  德化: "德化白瓷",
  建阳: "建盏、黑釉瓷",
  徽州: "徽墨、宣纸",
  绍兴: "越窑青瓷、蓝印花布",
  广州: "海上丝路，岭南色彩",
  昆明: "云南民族色彩",
  湖州: "湖州毛笔、茶文化",
  上海: "近代工业色",
  龙虎山: "道教丹砂",
  定窑: "定窑白瓷",
  荆州: "楚漆器",
  宣城: "宣纸、徽墨",
  邯郸: "赵文化",
  济南: "泉城文化",
  禹州: "钧窑故乡",
  昌化: "鸡血石之乡",
  贵阳: "苗族蜡染",
  扬州: "漆器螺钿、玉雕",
  五台山: "佛教圣地",
  定州: "缂丝之乡",
  亳州: "曹操故里、古井贡酒",
  合浦: "南珠文化",
  安阳: "甲骨文、青铜器",
  宜兴: "紫砂壶",
  曲阜: "孔林、儒家文化",
  西藏: "藏传佛教、唐卡",
};

function buildCulturalMap() {
  const colorsPath = path.join(__dirname, "..", "data", "colors.json");
  const data = JSON.parse(fs.readFileSync(colorsPath, "utf8"));

  const cityColors = {}; // cityName -> Set of color names
  const cityColorList = {}; // cityName -> array (preserve order, no dupes)

  for (const c of data.colors) {
    const loc = (c.location || "").trim();
    if (!loc) continue;

    const city = LOC_TO_CITY[loc] || loc;
    if (!CITY_COORDS[city]) continue; // 只保留有坐标的城市

    if (!cityColors[city]) {
      cityColors[city] = new Set();
      cityColorList[city] = [];
    }
    if (!cityColors[city].has(c.name)) {
      cityColors[city].add(c.name);
      cityColorList[city].push(c.name);
    }
  }

  const cities = Object.entries(cityColorList)
    .filter(([, colors]) => colors.length > 0)
    .map(([name, colors]) => ({
      id: name,
      name,
      x: CITY_COORDS[name][0],
      y: CITY_COORDS[name][1],
      colors,
      culture: CITY_CULTURE[name] || "",
    }))
    .sort((a, b) => b.colors.length - a.colors.length);

  const routes = [
    { from: "北京", to: "开封", distance: 650, culture_score: 95 },
    { from: "北京", to: "西安", distance: 1100, culture_score: 98 },
    { from: "开封", to: "景德镇", distance: 800, culture_score: 90 },
    { from: "开封", to: "杭州", distance: 850, culture_score: 92 },
    { from: "景德镇", to: "苏州", distance: 450, culture_score: 88 },
    { from: "景德镇", to: "杭州", distance: 400, culture_score: 85 },
    { from: "敦煌", to: "西安", distance: 1800, culture_score: 99 },
    { from: "苏州", to: "杭州", distance: 150, culture_score: 95 },
    { from: "南京", to: "苏州", distance: 250, culture_score: 82 },
    { from: "南京", to: "南通", distance: 200, culture_score: 80 },
    { from: "开封", to: "汝州", distance: 120, culture_score: 98 },
  ].filter((r) => cities.some((c) => c.name === r.from) && cities.some((c) => c.name === r.to));

  return { cities, routes };
}

const mapData = buildCulturalMap();
const outPath = path.join(__dirname, "..", "data", "cultural_map.json");
fs.writeFileSync(outPath, JSON.stringify(mapData, null, 2), "utf8");
console.log("Generated", outPath, "with", mapData.cities.length, "cities");
