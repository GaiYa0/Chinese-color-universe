import { fetchCulturalMap, fetchColors } from "@/services/data/data";
import ChinaColorMap from "@/modules/map/ui/ChinaColorMap";

export default async function MapPage() {
  const [mapData, colors] = await Promise.all([
    fetchCulturalMap(),
    fetchColors(),
  ]);

  return (
    <main className="cosmic-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          中国色地图 · CHINA COLOR MAP
        </h1>
        <p className="mb-8 text-white/60">
          点击城市查看文化色彩 · 景德镇 · 敦煌 · 北京
        </p>
        <ChinaColorMap cities={mapData.cities} colors={colors} />
      </div>
    </main>
  );
}
