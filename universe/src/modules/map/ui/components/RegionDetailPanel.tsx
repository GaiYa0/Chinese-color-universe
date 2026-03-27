"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChineseColor } from "@/shared/types";
import type { RegionData } from "@/modules/map/lib/regionHeatmap";

const PREVIEW_COUNT = 12;

interface RegionDetailPanelProps {
  selectedRegion: RegionData | null;
  colorMap: Map<string, ChineseColor>;
}

export default function RegionDetailPanel({
  selectedRegion,
  colorMap,
}: RegionDetailPanelProps) {
  const router = useRouter();
  /** 已展开全部颜色的城市 id */
  const [expandedCityIds, setExpandedCityIds] = useState<Set<string>>(() => new Set());

  const toggleCityExpanded = (cityId: string) => {
    setExpandedCityIds((prev) => {
      const next = new Set(prev);
      if (next.has(cityId)) next.delete(cityId);
      else next.add(cityId);
      return next;
    });
  };

  if (!selectedRegion) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-center text-white/50">
          点击地图省份，查看该区域的城市与文化色彩
        </p>
      </div>
    );
  }

  const { name, cities, colorCount } = selectedRegion;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-1 text-xl font-semibold text-white">{name} · 区域文化色彩</h3>
      <p className="mb-4 text-sm text-white/60">
        {cities.length} 座城市 · {colorCount} 种文化色
      </p>
      <div className="space-y-4">
        {cities.map((city) => {
          const expanded = expandedCityIds.has(city.id);
          const total = city.colors.length;
          const hasMore = total > PREVIEW_COUNT;
          const visibleColors =
            expanded || !hasMore ? city.colors : city.colors.slice(0, PREVIEW_COUNT);
          const rest = hasMore ? total - PREVIEW_COUNT : 0;

          return (
          <div
            key={city.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/8"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-white">{city.name}</h4>
              <span className="text-xs text-white/50">{city.colors.length} 色</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleColors.map((colorName) => {
                const color = colorMap.get(colorName);
                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/color/${encodeURIComponent(colorName)}`);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-left transition hover:border-white/25 hover:bg-white/10"
                  >
                    <div
                      className="h-6 w-6 shrink-0 rounded"
                      style={{ backgroundColor: color?.hex ?? "#666" }}
                    />
                    <span className="text-sm text-white/90">{colorName}</span>
                  </button>
                );
              })}
              {hasMore && !expanded && (
                <button
                  type="button"
                  onClick={() => toggleCityExpanded(city.id)}
                  className="self-center rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-[#26A69A] transition hover:border-[#26A69A]/50 hover:bg-white/15"
                >
                  +{rest} 展开
                </button>
              )}
              {hasMore && expanded && (
                <button
                  type="button"
                  onClick={() => toggleCityExpanded(city.id)}
                  className="self-center rounded-lg border border-white/15 bg-transparent px-3 py-1.5 text-xs text-white/50 transition hover:text-white/80"
                >
                  收起
                </button>
              )}
            </div>
            {city.culture && (
              <p className="mt-2 text-xs text-white/50">{city.culture}</p>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
