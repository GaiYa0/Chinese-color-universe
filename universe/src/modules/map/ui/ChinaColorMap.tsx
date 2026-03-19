"use client";

import { useMemo, useState } from "react";
import type { CityData } from "@/shared/types";
import type { ChineseColor } from "@/shared/types";
import ChinaMapRenderer from "@/modules/map/renderer/ChinaMapRenderer";
import CityDetailPanel from "@/modules/map/ui/components/CityDetailPanel";
import { useSelectionStore } from "@/store/selection.store";

interface ChinaColorMapProps {
  cities: CityData[];
  colors: ChineseColor[];
}

export default function ChinaColorMap({ cities, colors }: ChinaColorMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const selectedColorName = useSelectionStore((state) => state.selectedColorName);
  const setSelectedCityName = useSelectionStore((state) => state.setSelectedCityName);

  const colorMap = useMemo(
    () => new Map(colors.map((c) => [c.name, c])),
    [colors]
  );
  const syncedSelectedCity = useMemo(
    () =>
      selectedColorName
        ? cities.find((item) => item.colors.includes(selectedColorName)) ?? null
        : null,
    [cities, selectedColorName]
  );
  const activeSelectedCity = selectedCity ?? syncedSelectedCity;

  return (
    <div className="space-y-6">
      <ChinaMapRenderer
        cities={cities}
        mapReady={mapReady}
        setMapReady={setMapReady}
        onCitySelect={(cityName) => {
          const city = cities.find((item) => item.name === cityName);
          if (!city) return;
          setSelectedCity(city);
          setSelectedCityName(city.name);
        }}
      />
      <CityDetailPanel selectedCity={activeSelectedCity} colorMap={colorMap} />
    </div>
  );
}