"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

import type { CityData } from "@/shared/types";
import { createChinaMapOption } from "@/modules/map/lib/mapOptionBuilder";
import { buildScatterData } from "@/modules/map/lib/mapTransform";

interface ChinaMapRendererProps {
  cities: CityData[];
  mapReady: boolean;
  setMapReady: (ready: boolean) => void;
  onCitySelect: (cityName: string) => void;
}

export default function ChinaMapRenderer({
  cities,
  mapReady,
  setMapReady,
  onCitySelect,
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

    const scatterData = buildScatterData(cities);
    chart.setOption(createChinaMapOption(scatterData));

    chart.off("click");
    chart.on("click", (params: unknown) => {
      const p = params as { data?: { name?: string } };
      const name = p?.data?.name;
      if (name) onCitySelect(name);
    });
  }, [cities, mapReady, onCitySelect]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{ height: 500 }}>
      <div ref={chartRef} className="h-full w-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050510]/80">
          <p className="text-white/60">加载地图中...</p>
        </div>
      )}
    </div>
  );
}
