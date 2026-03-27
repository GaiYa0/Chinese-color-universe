"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

import type { ChineseColor } from "@/shared/types";
import type { GalaxyNodeData } from "@/modules/explore/lib/galaxy/buildGalaxyGraph";

interface D3GalaxyRendererProps {
  nodes: GalaxyNodeData[];
  links: { source: GalaxyNodeData; target: GalaxyNodeData }[];
  flyToTarget: ChineseColor | null;
  focusedColor: ChineseColor | null;
  hoveredColor: ChineseColor | null;
  onHoverColor: (color: ChineseColor | null) => void;
  onFocusColor: (color: ChineseColor | null) => void;
  onFlyComplete: () => void;
  onSelectColor: (color: ChineseColor) => void;
  onOpenDetail: (color: ChineseColor) => void;
}

export default function D3GalaxyRenderer({
  nodes,
  links,
  flyToTarget,
  focusedColor,
  hoveredColor,
  onHoverColor,
  onFocusColor,
  onFlyComplete,
  onSelectColor,
  onOpenDetail,
}: D3GalaxyRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const focusedNameRef = useRef<string | null>(null);
  const hoveredNameRef = useRef<string | null>(null);
  const dimsRef = useRef({ width: 400, height: 300 });
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    focusedNameRef.current = focusedColor?.name ?? null;
    hoveredNameRef.current = hoveredColor?.name ?? null;
  }, [focusedColor, hoveredColor]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // 重建时清除悬停状态，防止节点被 remove 后 pointerleave 未触发导致色球卡住放大
    hoveredNameRef.current = null;
    onHoverColor(null);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    dimsRef.current = { width, height };
    const cx = width / 2;
    const cy = height / 2;

    const clusterForce = (alpha: number) => {
      const { width: innerWidth, height: innerHeight } = dimsRef.current;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      nodes.forEach((node) => {
        const clusterCenterAngle = (node.clusterId / 8) * Math.PI * 2;
        const radius = 120 + node.clusterId * 40;
        const targetX = centerX + Math.cos(clusterCenterAngle) * radius;
        const targetY = centerY + Math.sin(clusterCenterAngle) * radius;
        (node as { vx: number }).vx += (targetX - (node.x ?? 0)) * alpha * 0.02;
        (node as { vy: number }).vy += (targetY - (node.y ?? 0)) * alpha * 0.02;
      });
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d: unknown) => String((d as GalaxyNodeData).id)).distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(cx, cy))
      .force(
        "collision",
        d3.forceCollide().radius((d: unknown) => (d as GalaxyNodeData).radius + 8)
      )
      .force("cluster", clusterForce)
      .alpha(0.5);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);
    // 双击用于进入详情，禁用默认双击缩放
    svg.on("dblclick.zoom", null);
    // 鼠标离开整个画布时清除悬停，防止移动过快导致 pointerleave 漏触发
    svg.on("pointerleave", () => {
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
        hoverLeaveTimerRef.current = null;
      }
      hoveredNameRef.current = null;
      onHoverColor(null);
      nodes.forEach((n) => {
        (n as { fx?: number | null }).fx = null;
        (n as { fy?: number | null }).fy = null;
      });
      link.attr("stroke", "rgba(139,207,240,0.15)").attr("stroke-width", 1);
    });

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(139,207,240,0.2)")
      .attr("stroke-width", 1)
      .attr("class", "galaxy-link")
      .style("animation", "galaxy-link-flow 4s ease-in-out infinite");

    const nodeG = g.append("g").attr("class", "galaxy-nodes");
    const node = nodeG
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.hex)
      .attr("stroke", (d) => d.hex)
      .attr("stroke-width", 0)
      .attr("class", (_, i) => `galaxy-node galaxy-node-${i % 5}`)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 0 8px currentColor)")
      .on("pointerenter", function (_, d) {
        if (hoverLeaveTimerRef.current) {
          clearTimeout(hoverLeaveTimerRef.current);
          hoverLeaveTimerRef.current = null;
        }
        // 立即更新 ref，确保下一帧就开始放大（不等 React 状态同步）
        hoveredNameRef.current = d.name;
        // 悬停时临时固定节点，避免抖动导致频繁触发离开/进入
        (d as { fx?: number }).fx = d.x ?? 0;
        (d as { fy?: number }).fy = d.y ?? 0;
        onHoverColor(d);
        link
          .attr("stroke", (l) =>
            (l.source as GalaxyNodeData).name === d.name ||
            (l.target as GalaxyNodeData).name === d.name
              ? "rgba(139,207,240,0.6)"
              : "rgba(139,207,240,0.15)"
          )
          .attr("stroke-width", (l) =>
            (l.source as GalaxyNodeData).name === d.name ||
            (l.target as GalaxyNodeData).name === d.name
              ? 2
              : 1
          );
      })
      .on("pointerleave", function (_, d) {
        hoverLeaveTimerRef.current = setTimeout(() => {
          (d as { fx?: number | null }).fx = null;
          (d as { fy?: number | null }).fy = null;
          if (focusedNameRef.current !== d.name) {
            hoveredNameRef.current = null;
            onHoverColor(null);
            link.attr("stroke", "rgba(139,207,240,0.15)").attr("stroke-width", 1);
          }
          hoverLeaveTimerRef.current = null;
        }, 60);
      })
      .on("dblclick", (e, d) => {
        e.stopPropagation();
        onSelectColor(d);
        onOpenDetail(d);
      })
      .call(
        d3
          .drag<SVGCircleElement, GalaxyNodeData>()
          .on("start", (e, d) => {
            e.sourceEvent?.stopPropagation();
            if (!e.active) simulation.alphaTarget(0.3).restart();
            (d as { fx?: number }).fx = d.x;
            (d as { fy?: number }).fy = d.y;
          })
          .on("drag", (e, d) => {
            (d as { fx?: number }).fx = e.x;
            (d as { fy?: number }).fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            (d as { fx?: number | null }).fx = null;
            (d as { fy?: number | null }).fy = null;
          }) as never
      );

    const doFit = () => {
      const pad = 50;
      const xs = nodes.map((n) => n.x ?? 0);
      const ys = nodes.map((n) => n.y ?? 0);
      const minX = Math.min(...xs) - pad;
      const maxX = Math.max(...xs) + pad;
      const minY = Math.min(...ys) - pad;
      const maxY = Math.max(...ys) + pad;
      const w = Math.max(maxX - minX, 1);
      const h = Math.max(maxY - minY, 1);
      const scale = Math.min(width / w, height / h) * 0.9;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const tx = width / 2 - centerX * scale;
      const ty = height / 2 - centerY * scale - height * 0.06;
      svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    };

    const updatePositions = () => {
      link
        .attr("x1", (d) => (d.source as GalaxyNodeData).x ?? 0)
        .attr("y1", (d) => (d.source as GalaxyNodeData).y ?? 0)
        .attr("x2", (d) => (d.target as GalaxyNodeData).x ?? 0)
        .attr("y2", (d) => (d.target as GalaxyNodeData).y ?? 0);
      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => {
          const animatedNode = d as GalaxyNodeData & { displayRadius?: number };
          if (animatedNode.displayRadius == null) {
            animatedNode.displayRadius = d.radius;
          }
          const isHovered =
            focusedNameRef.current === d.name ||
            hoveredNameRef.current === d.name;
          const targetRadius = isHovered ? d.radius * 1.8 : d.radius;
          // 0.45 插值：更快响应，约 3-4 帧达到 90%，更自然
          const t = 0.45;
          animatedNode.displayRadius += (targetRadius - animatedNode.displayRadius) * t;
          return animatedNode.displayRadius;
        })
        .attr("stroke-width", (d) =>
          focusedNameRef.current === d.name || hoveredNameRef.current === d.name
            ? 2
            : 0
        );
    };

    simulation.on("tick", updatePositions);
    for (let i = 0; i < 120; i++) simulation.tick();
    doFit();
    simulation.alpha(0.02).alphaDecay(0).alphaTarget(0.02);

    if (flyToTarget) {
      const targetNode = nodes.find((n) => n.name === flyToTarget.name);
      if (targetNode) {
        const flyScale = 2;
        const flyTx = width / 2 - (targetNode.x ?? 0) * flyScale;
        const flyTy = height / 2 - (targetNode.y ?? 0) * flyScale;
        svg
          .transition()
          .duration(800)
          .ease(d3.easeCubicInOut)
          .call(
            zoom.transform as () => void,
            d3.zoomIdentity.translate(flyTx, flyTy).scale(flyScale)
          );
        onFocusColor(flyToTarget);
        onSelectColor(flyToTarget);
        onFlyComplete();
      }
    }

    return () => {
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
        hoverLeaveTimerRef.current = null;
      }
      simulation.stop();
      svg.interrupt();
    };
  }, [
    nodes,
    links,
    flyToTarget,
    onFlyComplete,
    onFocusColor,
    onHoverColor,
    onOpenDetail,
    onSelectColor,
  ]);

  return (
    <>
      <svg ref={svgRef} width="100%" height="100%" className="relative z-0 bg-transparent" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${(i * 7 + 13) % 100}%`,
              top: `${(i * 11 + 17) % 100}%`,
              animation: `twinkle ${2 + (i % 5) * 0.4}s ease-in-out infinite`,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      />
    </>
  );
}
