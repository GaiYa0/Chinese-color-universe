"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DYNASTY_TIMELINE } from "@/shared/types";
import type { ChineseColor } from "@/shared/types";

interface ColorTimelineProps {
  colors: ChineseColor[];
}

export default function ColorTimeline({ colors }: ColorTimelineProps) {
  const router = useRouter();
  const colorMap = useMemo(
    () => new Map(colors.map((c) => [c.name, c])),
    [colors]
  );
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>("song");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDynasty && scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-dynasty="${selectedDynasty}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDynasty]);

  return (
    <div className="space-y-10">
      <p className="text-sm text-white/50">
        横向滑动探索 · 点击朝代展开代表颜色
      </p>
      {/* 流动时间轴 */}
      <div
        ref={scrollRef}
        className="relative flex gap-0 overflow-x-auto pb-6 scrollbar-hide md:gap-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {/* 背景渐变连接线 */}
        <div
          className="pointer-events-none absolute bottom-14 left-0 right-0 h-1 opacity-30"
          style={{
            background: `linear-gradient(90deg, ${DYNASTY_TIMELINE.map((d, i) => {
              const theme =
                colorMap.get(d.colors[0])?.hex ?? d.themeHex;
              return `${theme} ${(i / (DYNASTY_TIMELINE.length - 1)) * 100}%`;
            }).join(", ")})`,
            borderRadius: 2,
          }}
        />
        {DYNASTY_TIMELINE.map((d) => {
          const isSelected = selectedDynasty === d.id;
          const primaryColor = colorMap.get(d.colors[0])?.hex ?? d.themeHex;
          return (
            <button
              key={d.id}
              type="button"
              data-dynasty={d.id}
              onClick={() => setSelectedDynasty(isSelected ? null : d.id)}
              className="relative flex shrink-0 flex-col items-center transition-all duration-300 hover:scale-105"
              style={{ scrollSnapAlign: "center" }}
            >
              {/* 时间节点圆点 */}
              <div
                className="relative z-10 mb-2 h-4 w-4 rounded-full shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: isSelected ? `0 0 20px ${primaryColor}` : "0 2px 8px rgba(0,0,0,0.3)",
                  transform: isSelected ? "scale(1.3)" : "scale(1)",
                }}
              />
              {/* 朝代卡片 */}
              <div
                className={`flex flex-col items-center rounded-2xl px-5 py-4 transition-all duration-300 ${
                  isSelected ? "ring-2 ring-white/40" : ""
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}10)`
                    : "rgba(255,255,255,0.05)",
                  borderColor: isSelected ? primaryColor : "transparent",
                  minWidth: 140,
                }}
              >
                <p className="font-semibold text-white">{d.name}</p>
                <p
                  className="mt-0.5 font-mono text-[10px] text-white/40"
                  title="文档内主色 HEX（colors 数据）"
                >
                  {colorMap.get(d.colors[0])?.hex ?? d.themeHex}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {d.start > 0 ? d.start : `${Math.abs(d.start)} BC`} —{" "}
                  {d.end > 0 ? d.end : `${Math.abs(d.end)} BC`}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 展开的颜色卡片 - 带过渡动画 */}
      {selectedDynasty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const dynasty = DYNASTY_TIMELINE.find((d) => d.id === selectedDynasty);
            if (!dynasty) return null;
            return dynasty.colors.map((colorName, i) => {
              const c = colorMap.get(colorName);
              const hex =
                c?.hex ?? dynasty.paletteHex[i] ?? "#333";
              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => router.push(`/color/${encodeURIComponent(colorName)}`)}
                  className="glass-card overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    animation: "fadeInUp 0.4s ease-out forwards",
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    className="relative h-28 overflow-hidden"
                    style={{ backgroundColor: hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <p className="absolute bottom-2 left-3 text-lg font-bold text-white drop-shadow-lg">
                      {colorName}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-sm text-white/60">{hex}</p>
                    {c?.meaning && (
                      <p className="mt-2 text-sm text-white/80">{c.meaning}</p>
                    )}
                    {c?.relic && (
                      <p className="mt-1 text-xs text-white/50">代表文物：{c.relic}</p>
                    )}
                  </div>
                </button>
              );
            });
          })()}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
