"use client";

import type { ChineseColor } from "@/shared/types";

interface GalaxyToolbarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  searchSuggestions: ChineseColor[];
  onSearchSelect: (color: ChineseColor) => void;
  viewMode: "galaxy" | "grid";
  setViewMode: (value: "galaxy" | "grid") => void;
}

export default function GalaxyToolbar({
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  searchSuggestions,
  onSearchSelect,
  viewMode,
  setViewMode,
}: GalaxyToolbarProps) {
  return (
    <div className="z-10 flex shrink-0 flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center">
      <div className="shrink-0">
        <h2 className="text-lg font-semibold text-white">颜色星空 · Color Galaxy</h2>
        <p className="text-xs text-white/50">悬停放大 · 双击进入详情 · 滚轮缩放 · 拖拽平移</p>
      </div>
      <div className="relative max-w-xl flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="搜索：天青、#4A5568、雨过天晴、故宫红..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
        />
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/90 py-2">
            {searchSuggestions.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onSearchSelect(color)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-white/10"
              >
                <div
                  className="h-8 w-8 shrink-0 rounded"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-white">{color.name}</p>
                  <p className="text-xs text-white/60">{color.hex}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setViewMode("galaxy")}
          className={`rounded-lg px-4 py-2 text-sm ${
            viewMode === "galaxy"
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/70"
          }`}
        >
          🌌 星空模式
        </button>
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          className={`rounded-lg px-4 py-2 text-sm ${
            viewMode === "grid"
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/70"
          }`}
        >
          📋 网格模式
        </button>
      </div>
    </div>
  );
}
