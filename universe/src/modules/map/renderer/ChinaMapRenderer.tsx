"use client";

import { useEffect, useRef } from "react";
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

export default function ChinaMapRenderer({
  cities,
  mapReady,
  setMapReady,
  onRegionSelect,
}: ChinaMapRendererProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, "dark");

    const loadMap = async () => {
      const urls = [
        "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
        "https://geo.datav.aliyun.com/areas_v3/bound/100000.json",
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url, { mode: "cors" });
          if (res.ok) {
            const geoJson = await res.json();
            echarts.registerMap("china", geoJson);
            break;
          }
        } catch {
          continue;
        }
      }
      setMapReady(true);
    };

    loadMap();
    return () => chart.dispose();
  }, [setMapReady]);

  useEffect(() => {
    if (!chartRef.current || !mapReady) return;
    const chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) return;

    const regionData = buildRegionHeatmapData(cities);
    const option = createChinaHeatmapOption({ regionData });
    chart.setOption(option, { replaceMerge: ["series"] });

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
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050510]/80">
          <p className="text-white/60">加载地图中...</p>
        </div>
      )}
    </div>
  );
}
