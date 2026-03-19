import type { SimulationNodeDatum } from "d3";

import { bfsPath, buildGraph, dfsPath } from "@/modules/graph/lib/graph";

interface Edge {
  from: string;
  to: string;
}

interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: string;
}

export interface PathResult {
  bfs: string[];
  dfs: string[];
}

export function generatePathResult(edges: Edge[], colorName: string): PathResult {
  const graph = buildGraph(edges);
  return {
    bfs: bfsPath(graph, colorName),
    dfs: dfsPath(graph, colorName),
  };
}

export function buildRenderableGraph(
  nodes: GraphNode[],
  edges: Edge[],
  pathResult: PathResult | null
) {
  const allGraphNodes = nodes.map((node) => ({
    ...node,
    radius: node.type === "color" ? 18 : 12,
  }));

  const pathNodeIds = pathResult
    ? new Set([...pathResult.bfs, ...pathResult.dfs])
    : null;

  const graphNodes = pathNodeIds
    ? allGraphNodes.filter((node) => pathNodeIds.has(node.id))
    : allGraphNodes;

  const nodeMap = new Map(graphNodes.map((node) => [node.id, node]));
  const pathIds = pathNodeIds ?? new Set(graphNodes.map((node) => node.id));

  const graphLinks = edges
    .filter((edge) => pathIds.has(edge.from) && pathIds.has(edge.to))
    .map((edge) => {
      const source = nodeMap.get(edge.from);
      const target = nodeMap.get(edge.to);
      return source && target ? { source, target } : null;
    })
    .filter(Boolean) as { source: (typeof graphNodes)[0]; target: (typeof graphNodes)[0] }[];

  return {
    graphNodes,
    graphLinks,
    pathNodeIds,
  };
}
