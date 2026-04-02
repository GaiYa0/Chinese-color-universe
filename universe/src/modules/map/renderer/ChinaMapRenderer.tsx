"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

import type { CityData } from "@/shared/types";
import type { RegionData } from "@/modules/map/lib/regionHeatmap";
import { buildRegionHeatmapData } from "@/modules/map/lib/regionHeatmap";
import { createChinaHeatmapOption } from "@/modules/map/lib/mapOptionBuilder";

interface ChinaMapRendererProps {
  cities: CityData[];
  mapReady: boolean;
  setMapReady: (ready: boolean) => void;
  onRegionSelect: (region: RegionData | null) => void;
}

const CHINA_MAP_SOURCES = [
  "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
  "https://geo.datav.aliyun.com/areas_v3/bound/100000.json",
  // 境外/Vercel 访问时阿里云偶发失败，用 jsDelivr 上的 GeoJSON 作兜底（标准 FeatureCollection）
  "https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json",
];

export default function ChinaMapRenderer({
  cities,
  mapReady,
  setMapReady,
  onRegionSelect,
}: ChinaMapRendererProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, "dark");
    let cancelled = false;

    const loadMap = async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoadError(null);
      setMapReady(false);

      let registered = false;
      for (const url of CHINA_MAP_SOURCES) {
        if (cancelled) return;
        try {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) continue;
          const geoJson = await res.json();
          if (!geoJson || typeof geoJson !== "object") continue;
          echarts.registerMap("china", geoJson as never);
          registered = true;
          break;
        } catch {
          continue;
        }
      }

      if (cancelled) return;

      if (registered) {
        setMapReady(true);
      } else {
        setLoadError("地图轮廓加载失败（多为网络或跨域限制）。请换网络或稍后重试。");
        setMapReady(false);
      }
    };

    loadMap();
    return () => {
      cancelled = true;
      chart.dispose();
    };
  }, [setMapReady]);

  useEffect(() => {
    if (!chartRef.current || !mapReady) return;
    const chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) return;

    const regionData = buildRegionHeatmapData(cities);
    const option = createChinaHeatmapOption({ regionData });
    try {
      chart.setOption(option, { replaceMerge: ["series"] });
    } catch (e) {
      console.error("[ChinaMapRenderer] setOption failed", e);
      queueMicrotask(() => {
        setLoadError("地图渲染失败，请刷新页面重试。");
      });
      return;
    }

    const handleClick = (params: unknown) => {
      const p = params as { name?: string; data?: { regionKey?: string } };
      const regionKey = p?.data?.regionKey ?? p?.name;
      if (!regionKey) {
        onRegionSelect(null);
        return;
      }
      const region = regionData.find(
        (r) => r.name === regionKey || r.name === p?.name
      );
      onRegionSelect(region ?? null);
    };

    chart.off("click");
    chart.on("click", handleClick);
  }, [cities, mapReady, onRegionSelect]);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-white/10">
      <div ref={chartRef} className="h-full w-full" />
      {!mapReady && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050510]/80">
          <p className="text-white/60">加载地图中...</p>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050510]/90 px-6">
          <p className="text-center text-sm text-white/70">{loadError}</p>
        </div>
      )}
    </div>
  );
}
