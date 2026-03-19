import type { CityData } from "@/shared/types";

const CITY_COORDS: Record<string, [number, number]> = {
  北京: [116.4, 39.9],
  景德镇: [117.2, 29.3],
  敦煌: [94.8, 40.1],
  开封: [114.3, 34.8],
  苏州: [120.6, 31.3],
  杭州: [120.2, 30.3],
  西安: [108.9, 34.3],
  南京: [118.8, 32.1],
  南通: [121.0, 32.0],
  汝州: [112.8, 34.2],
};

export function buildScatterData(cities: CityData[]) {
  return cities
    .filter((city) => CITY_COORDS[city.name])
    .map((city) => ({
      name: city.name,
      value: CITY_COORDS[city.name],
      colors: city.colors,
      culture: city.culture,
    }));
}
