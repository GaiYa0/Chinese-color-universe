/**
 * 知识图谱 BFS/DFS 路径生成
 */

interface Edge {
  from: string;
  to: string;
}

export function buildGraph(edges: Edge[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const e of edges) {
    const from = graph.get(e.from) ?? [];
    if (!from.includes(e.to)) from.push(e.to);
    graph.set(e.from, from);
    const to = graph.get(e.to) ?? [];
    if (!to.includes(e.from)) to.push(e.from);
    graph.set(e.to, to);
  }
  return graph;
}

export function bfsPath(
  graph: Map<string, string[]>,
  start: string,
  maxSteps = 12
): string[] {
  const visited = new Set<string>();
  const queue: string[] = [start];
  visited.add(start);
  const path: string[] = [];
  let steps = 0;
  while (queue.length > 0 && steps < maxSteps) {
    const node = queue.shift()!;
    path.push(node);
    steps++;
    const neighbors = graph.get(node) ?? [];
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  return path;
}

export function dfsPath(
  graph: Map<string, string[]>,
  start: string,
  maxSteps = 12
): string[] {
  const visited = new Set<string>();
  const path: string[] = [];
  function dfs(node: string) {
    if (path.length >= maxSteps) return;
    visited.add(node);
    path.push(node);
    const neighbors = graph.get(node) ?? [];
    for (const n of neighbors) {
      if (!visited.has(n)) dfs(n);
      if (path.length >= maxSteps) return;
    }
  }
  dfs(start);
  return path;
}
