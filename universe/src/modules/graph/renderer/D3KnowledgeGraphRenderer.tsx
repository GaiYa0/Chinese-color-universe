"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

import type { PathResult } from "@/modules/graph/lib/graphView";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: string;
  radius: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3KnowledgeGraphRendererProps {
  graphNodes: GraphNode[];
  graphLinks: { source: GraphNode; target: GraphNode }[];
  colorMap: Map<string, string>;
  highlightedNodes: Set<string>;
  pathResult: PathResult | null;
  onColorNodeSelect: (nodeId: string) => void;
  onNodeSelect: (nodeId: string) => void;
}

const NODE_COLORS: Record<string, string> = {
  color: "inherit",
  relic: "#26A69A",
  dynasty: "#FFD54F",
  location: "#9C27B0",
  poet: "#64B5F6",
};

export default function D3KnowledgeGraphRenderer({
  graphNodes,
  graphLinks,
  colorMap,
  highlightedNodes,
  pathResult,
  onColorNodeSelect,
  onNodeSelect,
}: D3KnowledgeGraphRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const hasPathFilter = pathResult != null;

    const simulation = d3
      .forceSimulation<GraphNode>(graphNodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, { source: GraphNode; target: GraphNode }>(graphLinks)
          .id((d) => d.id)
          .distance(hasPathFilter ? 100 : 80)
      )
      .force("charge", d3.forceManyBody().strength(hasPathFilter ? -150 : -200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<GraphNode>().radius((d) => d.radius + 12)
      );

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);
    // 禁用默认双击缩放，改为双击颜色节点进入详情
    svg.on("dblclick.zoom", null);

    const link = g
      .append("g")
      .selectAll("line")
      .data(graphLinks)
      .join("line")
      .attr("stroke", "rgba(139,207,240,0.25)")
      .attr("stroke-width", 1.5);

    const node = g
      .append("g")
      .selectAll("g")
      .data(graphNodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (_, d) => {
        onNodeSelect(d.id);
      })
      .on("dblclick", (e, d) => {
        e.stopPropagation();
        if (d.type === "color") onColorNodeSelect(d.id);
      })
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x!;
            d.fy = d.y!;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as never
      );

    node
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => {
        if (d.type === "color") return colorMap.get(d.id) ?? "#666";
        return NODE_COLORS[d.type] ?? "#888";
      })
      .attr("stroke", (d) => {
        if (d.type === "color") {
          return colorMap.get(d.id) ?? "#666";
        }
        return "#fff";
      })
      .attr("stroke-width", (d) => (highlightedNodes.has(d.id) ? 3 : 1))
      .attr("stroke-opacity", (d) => (d.type === "color" ? 0.8 : 0.5))
      .style("filter", (d) => {
        const hex = d.type === "color" ? colorMap.get(d.id) : null;
        return hex ? `drop-shadow(0 0 8px ${hex})` : "drop-shadow(0 0 6px currentColor)";
      });

    node
      .append("text")
      .text((d) => d.id)
      .attr("font-size", hasPathFilter ? 12 : 10)
      .attr("dx", (d) => d.radius + 5)
      .attr("dy", "0.35em")
      .attr("fill", "#fff");

    let tickCount = 0;
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x!)
        .attr("y1", (d) => d.source.y!)
        .attr("x2", (d) => d.target.x!)
        .attr("y2", (d) => d.target.y!);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      tickCount++;
      if (hasPathFilter && tickCount === 100) {
        const padding = 80;
        const xs = graphNodes.map((n) => n.x ?? 0);
        const ys = graphNodes.map((n) => n.y ?? 0);
        const minX = Math.min(...xs) - padding;
        const maxX = Math.max(...xs) + padding;
        const minY = Math.min(...ys) - padding;
        const maxY = Math.max(...ys) + padding;
        const w = Math.max(maxX - minX, 1);
        const h = Math.max(maxY - minY, 1);
        const scale = Math.min(width / w, height / h) * 0.95;
        const tx = width / 2 - ((minX + maxX) / 2) * scale;
        const ty = height / 2 - ((minY + maxY) / 2) * scale;
        svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
      }
    });

    return () => {
      simulation.stop();
    };
  }, [
    colorMap,
    graphLinks,
    graphNodes,
    highlightedNodes,
    onColorNodeSelect,
    onNodeSelect,
    pathResult,
  ]);

  return (
    <div
      ref={containerRef}
      className="h-[500px] overflow-hidden rounded-2xl border border-white/10"
    >
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}
