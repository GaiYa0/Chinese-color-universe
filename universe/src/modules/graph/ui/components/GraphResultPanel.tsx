"use client";

import type { PathResult } from "@/modules/graph/lib/graphView";

interface GraphResultPanelProps {
  pathResult: PathResult | null;
  colorMap: Map<string, string>;
}

export default function GraphResultPanel({
  pathResult,
  colorMap,
}: GraphResultPanelProps) {
  if (!pathResult) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="glass-card rounded-xl p-4">
        <h3 className="mb-3 font-semibold text-emerald-400">BFS 广度探索</h3>
        <div className="flex flex-wrap gap-2">
          {pathResult.bfs.map((name) => {
            const hex = colorMap.get(name);
            return (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm text-white"
              >
                {hex && (
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: hex }}
                  />
                )}
                {name}
              </span>
            );
          })}
        </div>
      </div>
      <div className="glass-card rounded-xl p-4">
        <h3 className="mb-3 font-semibold text-blue-400">DFS 深度探索</h3>
        <div className="flex flex-wrap gap-2">
          {pathResult.dfs.map((name) => {
            const hex = colorMap.get(name);
            return (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm text-white"
              >
                {hex && (
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: hex }}
                  />
                )}
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
