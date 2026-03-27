import { fetchCulturalMap, fetchColors } from "@/services/data/data";
import ChinaColorMap from "@/modules/map/ui/ChinaColorMap";

export default async function MapPage() {
  const [mapData, colors] = await Promise.all([
    fetchCulturalMap(),
    fetchColors(),
  ]);

  return (
    <main className="cosmic-bg flex h-screen flex-col overflow-hidden pt-20">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 pb-4 pt-2">
        <h1 className="mb-1 shrink-0 text-xl font-bold text-white md:text-2xl">
          中国色地图 · CHINA COLOR MAP
        </h1>
        <p className="mb-3 shrink-0 text-sm text-white/60">
          点击城市查看文化色彩 · 景德镇 · 敦煌 · 北京
        </p>
        <ChinaColorMap cities={mapData.cities} colors={colors} />
      </div>
    </main>
  );
}
