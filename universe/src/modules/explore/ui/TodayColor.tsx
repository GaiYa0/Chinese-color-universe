"use client";

import { useState } from "react";
import type { ChineseColor } from "@/shared/types";

interface TodayColorProps {
  color: ChineseColor;
}

export default function TodayColor({ color }: TodayColorProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* 大面积渐变背景 */}
      <div
        className="relative h-64 md:h-80"
        style={{
          background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}88 50%, transparent 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
          <p className="text-sm uppercase tracking-widest text-white/60">
            今日中国色
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            {color.name}
          </h1>
          <p className="mt-2 text-lg text-white/80">
            {color.hex}
          </p>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="mt-6 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur transition hover:bg-white/20"
          >
            {saved ? "✓ 已收藏" : "☆ 收藏"}
          </button>
        </div>
      </div>
      <div className="space-y-6 p-8">
        {color.meaning && (
          <div>
            <h3 className="text-sm font-medium text-white/50">文化寓意</h3>
            <p className="mt-2 text-white/90">{color.meaning}</p>
          </div>
        )}
        {color.story && (
          <div>
            <h3 className="text-sm font-medium text-white/50">文化故事</h3>
            <p className="mt-2 leading-relaxed text-white/80">{color.story}</p>
          </div>
        )}
        {color.poem && (
          <blockquote className="border-l-2 border-white/20 pl-4 text-white/70 italic">
            「{color.poem}」— {color.poet}
          </blockquote>
        )}
        {(color.relic || color.dynasty || color.location) && (
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            {color.relic && <span>代表文物：{color.relic}</span>}
            {color.dynasty && <span>朝代：{color.dynasty}</span>}
            {color.location && <span>产地：{color.location}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
