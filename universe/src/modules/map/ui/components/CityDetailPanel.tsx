"use client";

import { useRouter } from "next/navigation";
import type { ChineseColor, CityData } from "@/shared/types";

interface CityDetailPanelProps {
  selectedCity: CityData | null;
  colorMap: Map<string, ChineseColor>;
}

export default function CityDetailPanel({
  selectedCity,
  colorMap,
}: CityDetailPanelProps) {
  const router = useRouter();
  if (!selectedCity) return null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        {selectedCity.name} · 文化色彩
      </h3>
      <p className="mb-4 text-white/70">{selectedCity.culture}</p>
      <div className="flex flex-wrap gap-3">
        {selectedCity.colors.map((colorName) => {
          const color = colorMap.get(colorName);
          return (
            <button
              key={colorName}
              type="button"
              onClick={() => router.push(`/color/${encodeURIComponent(colorName)}`)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/25 hover:bg-white/10"
            >
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: color?.hex ?? "#666" }}
              />
              <div>
                <p className="font-medium text-white">{colorName}</p>
                <p className="text-sm text-white/60">{color?.hex}</p>
                {color?.meaning && (
                  <p className="text-xs text-white/50">{color.meaning}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
