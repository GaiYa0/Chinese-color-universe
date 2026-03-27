import type { ChineseColor } from "@/shared/types";
import type { CulturalRelationNode, CulturalRelationEdge } from "@/shared/types";

/**
 * 从 colors 数据构建完整的知识图谱节点与边
 * 每个颜色关联：朝代、文物、产地、诗人/典籍
 */
export function buildKnowledgeGraphFromColors(
  colors: ChineseColor[]
): { nodes: CulturalRelationNode[]; edges: CulturalRelationEdge[] } {
  const nodeMap = new Map<string, CulturalRelationNode>();
  const edgeSet = new Set<string>();
  const edges: CulturalRelationEdge[] = [];

  const addNode = (id: string, type: CulturalRelationNode["type"]) => {
    if (!id || id.trim() === "" || id === "佚名") return;
    if (!nodeMap.has(id)) {
      nodeMap.set(id, { id, type });
    }
  };

  const addEdge = (from: string, to: string) => {
    if (!from || !to || from === to) return;
    const key = `${from}->${to}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from, to, weight: 1 });
    }
  };

  // 按名称去重
  const seenNames = new Set<string>();
  const uniqueColors = colors.filter((c) => {
    if (seenNames.has(c.name)) return false;
    seenNames.add(c.name);
    return true;
  });

  for (const color of uniqueColors) {
    addNode(color.name, "color");

    if (color.dynasty) {
      addNode(color.dynasty, "dynasty");
      addEdge(color.name, color.dynasty);
    }
    if (color.relic) {
      const relicId = simplifyRelicName(color.relic);
      addNode(relicId, "relic");
      addEdge(color.name, relicId);
    }
    if (color.location) {
      addNode(color.location, "location");
      addEdge(color.name, color.location);
    }
    if (color.poet) {
      addNode(color.poet, "poet");
      addEdge(color.name, color.poet);
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}

/** 简化文物名称，提取关键标识（如 汝窑、故宫、敦煌壁画） */
function simplifyRelicName(relic: string): string {
  const s = relic.trim();
  if (!s) return "";

  // 常见窑口：汝窑、越窑、钧窑、建窑、定窑 等
  const kilnMatch = s.match(/([^\s]{1,3}窑)/);
  if (kilnMatch) return kilnMatch[1];

  // 故宫、敦煌、景德镇 等
  if (s.startsWith("故宫")) return "故宫";
  if (s.startsWith("敦煌")) return s.length <= 6 ? s : "敦煌壁画";
  if (s.startsWith("景德镇")) return "景德镇";

  // 蓝印花布、素纱襌衣 等
  if (s.includes("蓝印花布")) return "蓝印花布";
  if (s.includes("素纱")) return "素纱襌衣";

  // 通用：取前 4 字（中文习惯）
  return s.length > 4 ? s.slice(0, 4) : s;
}
