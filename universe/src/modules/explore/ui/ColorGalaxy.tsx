"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchColors } from "@/modules/explore/lib/colorUtils";
import type { ChineseColor } from "@/shared/types";
import type { ColorFamily, SourceType } from "@/modules/explore/lib/colorUtils";
import {
  buildGalaxyLinks,
  buildGalaxyNodes,
  getDynasties,
  getFilteredColors,
  type GalaxyFilterState,
  type GalaxyNodeData,
} from "@/modules/explore/lib/galaxy/buildGalaxyGraph";
import GalaxyGridView from "@/modules/explore/ui/components/GalaxyGridView";
import GalaxyInfoCard from "@/modules/explore/ui/components/GalaxyInfoCard";
import GalaxySidebar from "@/modules/explore/ui/components/GalaxySidebar";
import GalaxyToolbar from "@/modules/explore/ui/components/GalaxyToolbar";
import D3GalaxyRenderer from "@/modules/explore/renderer/D3GalaxyRenderer";
import { useSelectionStore } from "@/store/selection.store";

type NodeData = GalaxyNodeData;

export default function ColorGalaxy({ colors }: { colors: ChineseColor[] }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"galaxy" | "grid">("galaxy");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [flyToTarget, setFlyToTarget] = useState<ChineseColor | null>(null);
  const [hoveredColor, setHoveredColor] = useState<ChineseColor | null>(null);
  const [focusedColor, setFocusedColor] = useState<ChineseColor | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterFamily, setFilterFamily] = useState<ColorFamily | "">("");
  const [filterDynasty, setFilterDynasty] = useState("");
  const [filterSource, setFilterSource] = useState<SourceType | "">("");
  const [lightnessRange, setLightnessRange] = useState<[number, number]>([0, 1]);
  const [saturationRange, setSaturationRange] = useState<[number, number]>([0, 1]);
  const selectedColorName = useSelectionStore((state) => state.selectedColorName);
  const setSelectedColor = useSelectionStore((state) => state.setSelectedColor);
  const clearSelection = useSelectionStore((state) => state.clearSelection);

  const dynasties = useMemo(() => getDynasties(colors), [colors]);

  const filterState = useMemo<GalaxyFilterState>(
    () => ({
      filterFamily,
      filterDynasty,
      filterSource,
      lightnessRange,
      saturationRange,
    }),
    [
      filterFamily,
      filterDynasty,
      filterSource,
      lightnessRange,
      saturationRange,
    ]
  );

  const filteredColors = useMemo(
    () => getFilteredColors(colors, filterState),
    [colors, filterState]
  );

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchColors(colors, searchQuery).slice(0, 8);
  }, [searchQuery, colors]);
  const syncedFocusedColor = useMemo(
    () =>
      selectedColorName
        ? colors.find((color) => color.name === selectedColorName) ?? null
        : null,
    [colors, selectedColorName]
  );

  const nodes = useMemo((): NodeData[] => buildGalaxyNodes(filteredColors), [
    filteredColors,
  ]);

  const links = useMemo(() => buildGalaxyLinks(nodes), [nodes]);

  const handleSearchSelect = useCallback((color: ChineseColor) => {
    setSearchQuery(color.name);
    setShowSuggestions(false);
    setFlyToTarget(color);
    setSelectedColor({ id: color.id, name: color.name });
  }, [setSelectedColor]);
  const handleRendererSelect = useCallback((color: ChineseColor) => {
    setSelectedColor({ id: color.id, name: color.name });
  }, [setSelectedColor]);
  const handleOpenDetail = useCallback((color: ChineseColor) => {
    router.push(`/color/${encodeURIComponent(color.name)}`);
  }, [router]);
  const handleFlyComplete = useCallback(() => {
    setFlyToTarget(null);
  }, []);
  const handleClearFocus = useCallback(() => {
    setFocusedColor(null);
    setHoveredColor(null);
    setFlyToTarget(null);
    clearSelection();
  }, [clearSelection]);
  const activeFocusedColor = focusedColor ?? syncedFocusedColor;
  const displayColor = activeFocusedColor ?? hoveredColor;

  return (
    <div className="relative flex min-h-0 flex-1">
      <GalaxySidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        filterFamily={filterFamily}
        setFilterFamily={setFilterFamily}
        filterDynasty={filterDynasty}
        setFilterDynasty={setFilterDynasty}
        dynasties={dynasties}
        filterSource={filterSource}
        setFilterSource={setFilterSource}
        lightnessRange={lightnessRange}
        setLightnessRange={setLightnessRange}
        saturationRange={saturationRange}
        setSaturationRange={setSaturationRange}
      />

      <div className="relative flex flex-1 flex-col">
        <GalaxyToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          searchSuggestions={searchSuggestions}
          onSearchSelect={handleSearchSelect}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0 overflow-hidden">
            {viewMode === "galaxy" ? (
              <>
                {activeFocusedColor && (
                  <button
                    type="button"
                    aria-label="清除当前颜色聚焦"
                    onClick={handleClearFocus}
                    className="absolute right-4 top-4 z-[2] rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition hover:bg-black/70"
                  >
                    退出聚焦
                  </button>
                )}
                <D3GalaxyRenderer
                  nodes={nodes}
                  links={links}
                  flyToTarget={flyToTarget}
                  focusedColor={activeFocusedColor}
                  hoveredColor={hoveredColor}
                  onHoverColor={setHoveredColor}
                  onFocusColor={setFocusedColor}
                  onFlyComplete={handleFlyComplete}
                  onSelectColor={handleRendererSelect}
                  onOpenDetail={handleOpenDetail}
                />
              </>
            ) : (
              <GalaxyGridView
                filteredColors={filteredColors}
                focusedColor={focusedColor}
                setFocusedColor={(color) => {
                  setFocusedColor(color);
                  if (color) {
                    setSelectedColor({ id: color.id, name: color.name });
                  }
                }}
              />
            )}
          </div>
          {displayColor && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex items-end justify-center overflow-visible pb-5">
              <GalaxyInfoCard color={displayColor} focused={Boolean(activeFocusedColor)} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
