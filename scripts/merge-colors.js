#!/usr/bin/env node
/**
 * 合并 colors 数据：从外部 JSON 导入，与现有数据合并，按名称和 hex 去重
 */

const fs = require("fs");
const path = require("path");

const EXTERNAL_PATH =
  "/Users/developing/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/a56d977205515722d3e397de95e3f119/Message/MessageTemp/ebb7e3d03074049ca4eefa92971077d8/File/colors1.json";
const PROJECT_ROOT = path.join(__dirname, "..");
const UNIVERSE_COLORS = path.join(PROJECT_ROOT, "universe/public/data/colors.json");
const DATA_COLORS = path.join(PROJECT_ROOT, "data/colors.json");

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function mergeAndDeduplicate(externalColors, projectColors) {
  const byName = new Map();

  const add = (c) => {
    const name = (c.name || "").trim();
    const hex = (c.hex || "").toUpperCase().trim();
    if (!name || !hex) return;

    // 同名：保留信息更完整的一条
    const existing = byName.get(name);
    if (existing) {
      const curFields = Object.keys(c).filter((k) => c[k] != null && c[k] !== "").length;
      const existFields = Object.keys(existing).filter(
        (k) => existing[k] != null && existing[k] !== ""
      ).length;
      if (curFields <= existFields) return;
    }

    byName.set(name, { ...c, name, hex: c.hex });
  };

  // 先加项目已有，再加外部新增（同名时保留信息更完整的）
  projectColors.colors.forEach(add);
  externalColors.colors.forEach(add);

  const result = Array.from(byName.values())
    .map((c, i) => ({
      id: i + 1,
      name: c.name,
      hex: c.hex,
      rgb: c.rgb || hexToRgb(c.hex),
      meaning: c.meaning,
      relic: c.relic,
      poem: c.poem,
      poet: c.poet,
      dynasty: c.dynasty,
      solar_term: c.solar_term,
      location: c.location,
      story: c.story,
    }))
    .filter((c) => c.hex);

  return result;
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith("#")) return [128, 128, 128];
  const m = hex.slice(1).match(/([0-9a-f]{2})/gi);
  if (!m || m.length !== 3) return [128, 128, 128];
  return m.map((x) => parseInt(x, 16));
}

function main() {
  const external = loadJson(EXTERNAL_PATH);
  const universe = loadJson(UNIVERSE_COLORS);
  const dataColorsPath = fs.existsSync(DATA_COLORS) ? DATA_COLORS : null;
  const projectData = dataColorsPath ? loadJson(DATA_COLORS) : universe;

  const merged = mergeAndDeduplicate(external, universe);
  const output = { colors: merged };

  fs.writeFileSync(UNIVERSE_COLORS, JSON.stringify(output, null, 2), "utf-8");
  if (dataColorsPath) {
    fs.writeFileSync(DATA_COLORS, JSON.stringify(output, null, 2), "utf-8");
  }

  console.log(`合并完成：共 ${merged.length} 种颜色（已去重）`);
}

main();
