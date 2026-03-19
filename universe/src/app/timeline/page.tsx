import { fetchColors } from "@/services/data/data";
import ColorTimeline from "@/modules/explore/ui/ColorTimeline";

export default async function TimelinePage() {
  const colors = await fetchColors();

  return (
    <main className="cosmic-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          中国色时间轴
        </h1>
        <p className="mb-8 text-white/60">
          探索中国颜色在历史中的演变 · 点击朝代展开代表颜色
        </p>
        <ColorTimeline colors={colors} />
      </div>
    </main>
  );
}
