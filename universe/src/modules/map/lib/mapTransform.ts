import type { CityData } from "@/shared/types";

export function buildScatterData(cities: CityData[]) {
  return cities.map((city) => ({
    name: city.name,
    value: [city.x, city.y] as [number, number],
    colors: city.colors,
    culture: city.culture,
  }));
}
