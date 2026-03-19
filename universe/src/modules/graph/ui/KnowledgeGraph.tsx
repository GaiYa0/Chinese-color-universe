"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildRenderableGraph,
  generatePathResult,
  type PathResult,
} from "@/modules/graph/lib/graphView";
import D3KnowledgeGraphRenderer from "@/modules/graph/renderer/D3KnowledgeGraphRenderer";
import GraphResultPanel from "@/modules/graph/ui/components/GraphResultPanel";
import GraphToolbar from "@/modules/graph/ui/components/GraphToolbar";
import { useSelectionStore } from "@/store/selection.store";

interface Node {
  id: string;
  type: string;
}

interface Edge {
  from: string;
  to: string;
}

interface KnowledgeGraphProps {
  nodes: Node[];
  edges: Edge[];
  colors: { name: string; hex: string }[];
}

export default function KnowledgeGraph({
  nodes,
  edges,
  colors,
}: KnowledgeGraphProps) {
  const [inputValue, setInputValue] = useState("天青");
  const [manualPathResult, setManualPathResult] = useState<PathResult | null>(null);
  const router = useRouter();
  const selectedColorName = useSelectionStore((state) => state.selectedColorName);
  const setSelectedColor = useSelectionStore((state) => state.setSelectedColor);
  const setSelectedNodeId = useSelectionStore((state) => state.setSelectedNodeId);

  const colorMap = useMemo(
    () => new Map(colors.map((c) => [c.name, c.hex])),
    [colors]
  );

  const syncedPathResult = useMemo(
    () =>
      selectedColorName ? generatePathResult(edges, selectedColorName) : null,
    [edges, selectedColorName]
  );
  const pathResult = manualPathResult ?? syncedPathResult;
  const highlightedNodes = useMemo(
    () => new Set([...(pathResult?.bfs ?? []), ...(pathResult?.dfs ?? [])]),
    [pathResult]
  );

  const { graphNodes, graphLinks } = useMemo(
    () => buildRenderableGraph(nodes, edges, pathResult),
    [nodes, edges, pathResult]
  );

  const handleGenerate = () => {
    const result = generatePathResult(edges, inputValue);
    setManualPathResult(result);
    setSelectedColor({ id: null, name: inputValue });
  };
  const handleColorNodeSelect = useCallback((nodeId: string) => {
    setSelectedColor({ id: null, name: nodeId });
    router.push(`/color/${encodeURIComponent(nodeId)}`);
  }, [router, setSelectedColor]);
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, [setSelectedNodeId]);

  return (
    <div className="space-y-6">
      <GraphToolbar
        inputValue={inputValue}
        setInputValue={setInputValue}
        onGenerate={handleGenerate}
      />

      <GraphResultPanel pathResult={pathResult} colorMap={colorMap} />

      <D3KnowledgeGraphRenderer
        graphNodes={graphNodes}
        graphLinks={graphLinks}
        colorMap={colorMap}
        highlightedNodes={highlightedNodes}
        pathResult={pathResult}
        onColorNodeSelect={handleColorNodeSelect}
        onNodeSelect={handleNodeSelect}
      />
    </div>
  );
}
