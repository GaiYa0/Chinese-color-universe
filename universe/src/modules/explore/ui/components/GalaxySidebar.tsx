"use client";

import type { ColorFamily, SourceType } from "@/modules/explore/lib/colorUtils";

const COLOR_FAMILIES: ColorFamily[] = [
  "红",
  "橙",
  "黄",
  "绿",
  "青",
  "蓝",
  "紫",
  "黑白灰",
];
const SOURCES: SourceType[] = ["瓷器", "织物", "建筑", "书画", "其他"];

interface GalaxySidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  filterFamily: ColorFamily | "";
  setFilterFamily: (value: ColorFamily | "") => void;
  filterDynasty: string;
  setFilterDynasty: (value: string) => void;
  dynasties: string[];
  filterSource: SourceType | "";
  setFilterSource: (value: SourceType | "") => void;
  lightnessRange: [number, number];
  setLightnessRange: (value: [number, number]) => void;
  saturationRange: [number, number];
  setSaturationRange: (value: [number, number]) => void;
}

export default function GalaxySidebar(props: GalaxySidebarProps) {
  const {
    sidebarOpen,
    setSidebarOpen,
    filterFamily,
    setFilterFamily,
    filterDynasty,
    setFilterDynasty,
    dynasties,
    filterSource,
    setFilterSource,
    lightnessRange,
    setLightnessRange,
    saturationRange,
    setSaturationRange,
  } = props;

  return (
    <aside
      className={`glass-card z-10 flex shrink-0 flex-col border-r border-white/10 transition-all duration-300 ${
        sidebarOpen ? "w-56" : "w-0 overflow-hidden"
      }`}
    >
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-20 z-20 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20"
      >
        {sidebarOpen ? "‹" : "›"}
      </button>
      {sidebarOpen && (
        <div className="space-y-4 p-4">
          <h3 className="text-sm font-semibold text-white/90">多维筛选</h3>
          <div>
            <p className="mb-2 text-xs text-white/60">色系</p>
            <div className="flex flex-wrap gap-1">
              {COLOR_FAMILIES.map((family) => (
                <button
                  key={family}
                  type="button"
                  onClick={() =>
                    setFilterFamily(filterFamily === family ? "" : family)
                  }
                  className={`rounded px-2 py-1 text-xs ${
                    filterFamily === family
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70"
                  }`}
                >
                  {family}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-white/60">朝代</p>
            <select
              value={filterDynasty}
              onChange={(e) => setFilterDynasty(e.target.value)}
              className="w-full rounded bg-white/5 px-2 py-1.5 text-sm text-white"
            >
              <option value="">全部</option>
              {dynasties.map((dynasty) => (
                <option key={dynasty} value={dynasty}>
                  {dynasty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-2 text-xs text-white/60">来源</p>
            <div className="flex flex-wrap gap-1">
              {SOURCES.map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() =>
                    setFilterSource(filterSource === source ? "" : source)
                  }
                  className={`rounded px-2 py-1 text-xs ${
                    filterSource === source
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70"
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-white/60">
              明度 {lightnessRange[0].toFixed(0)}–{lightnessRange[1].toFixed(0)}%
            </p>
            <div className="flex gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(lightnessRange[0] * 100)}
                onChange={(e) =>
                  setLightnessRange([+e.target.value / 100, lightnessRange[1]])
                }
                className="flex-1"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(lightnessRange[1] * 100)}
                onChange={(e) =>
                  setLightnessRange([lightnessRange[0], +e.target.value / 100])
                }
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-white/60">
              饱和度 {Math.round(saturationRange[0] * 100)}–
              {Math.round(saturationRange[1] * 100)}%
            </p>
            <div className="flex gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(saturationRange[0] * 100)}
                onChange={(e) =>
                  setSaturationRange([+e.target.value / 100, saturationRange[1]])
                }
                className="flex-1"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(saturationRange[1] * 100)}
                onChange={(e) =>
                  setSaturationRange([saturationRange[0], +e.target.value / 100])
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
