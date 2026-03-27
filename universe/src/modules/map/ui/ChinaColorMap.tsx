"use client";

import { useMemo, useState } from "react";
import type { CityData } from "@/shared/types";
import type { ChineseColor } from "@/shared/types";
import type { RegionData } from "@/modules/map/lib/regionHeatmap";
import ChinaMapRenderer from "@/modules/map/renderer/ChinaMapRenderer";
import RegionDetailPanel from "@/modules/map/ui/components/RegionDetailPanel";
import { buildRegionHeatmapData } from "@/modules/map/lib/regionHeatmap";

interface ChinaColorMapProps {
  cities: CityData[];
  colors: ChineseColor[];
}

export default function ChinaColorMap({ cities, colors }: ChinaColorMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const colorMap = useMemo(
    () => new Map(colors.map((c) => [c.name, c])),
    [colors]
  );

  const regionData = useMemo(() => buildRegionHeatmapData(cities), [cities]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="min-h-0 flex-1">
        <ChinaMapRenderer
          cities={cities}
          mapReady={mapReady}
          setMapReady={setMapReady}
          onRegionSelect={setSelectedRegion}
        />
      </div>
      <div className="max-h-[42vh] shrink-0 overflow-auto">
        <RegionDetailPanel
          selectedRegion={selectedRegion}
          colorMap={colorMap}
        />
      </div>
    </div>
  );
}
