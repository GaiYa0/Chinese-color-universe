"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ChineseColor } from "@/shared/types";
import UniverseRenderer from "@/modules/universe/renderer/UniverseRenderer";
import { useSelectionStore } from "@/store/selection.store";

interface UniverseSceneProps {
  colors: ChineseColor[];
}

export default function UniverseScene({ colors }: UniverseSceneProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const router = useRouter();
  const setSelectedColor = useSelectionStore((state) => state.setSelectedColor);

  const handleSelect = (name: string) => {
    const color = colors.find((c) => c.name === name);
    if (!color) return;
    setSelectedColor({ id: color.id, name: color.name });
    router.push(`/color/${encodeURIComponent(name)}`);
  };

  return (
    <div className="fixed inset-0" style={{ background: "#050510" }}>
      <UniverseRenderer colors={colors} onHover={setHoveredColor} onSelect={handleSelect} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-4xl font-bold tracking-[0.3em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] md:text-5xl"
            style={{ textShadow: "0 0 40px rgba(198,40,40,0.6)" }}
          >
            中国色宇宙
          </h1>
          <p className="mt-4 text-sm text-white/70 md:text-base">
            颜色即星球 · 文化即星系 · 进入探索
          </p>
          <p className="mt-2 text-xs text-white/50 md:text-sm">
            拖动旋转 · 悬停查看 · 点击进入
          </p>
        </div>
      </div>
      {hoveredColor && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full glass-card px-6 py-3">
          <span className="text-white/90">{hoveredColor}</span>
        </div>
      )}
    </div>
  );
}
