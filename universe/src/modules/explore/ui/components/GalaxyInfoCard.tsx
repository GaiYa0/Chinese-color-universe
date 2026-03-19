"use client";

import type { ChineseColor } from "@/shared/types";

interface GalaxyInfoCardProps {
  color: ChineseColor;
  focused: boolean;
}

export default function GalaxyInfoCard({
  color,
  focused,
}: GalaxyInfoCardProps) {
  return (
    <div className="glass-card z-10 min-w-[280px] max-w-[90vw] shrink-0 rounded-2xl p-4 shadow-lg">
      <div className="mb-3 h-14 rounded-lg" style={{ backgroundColor: color.hex }} />
      <p className="break-words text-lg font-semibold text-white">{color.name}</p>
      <p className="break-all text-sm text-white/70">{color.hex}</p>
      {color.dynasty && (
        <p className="mt-1 text-sm text-white/60">朝代：{color.dynasty}</p>
      )}
      {color.meaning && <p className="mt-2 text-sm text-white/60">{color.meaning}</p>}
      {focused && color.story && (
        <p className="mt-2 text-sm text-white/50">{color.story}</p>
      )}
    </div>
  );
}
