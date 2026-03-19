import { fetchColors, getTodayColor } from "@/services/data/data";
import TodayColor from "@/modules/explore/ui/TodayColor";

export default async function TodayPage() {
  const colors = await fetchColors();
  const todayColor = getTodayColor(colors);

  return (
    <main className="cosmic-bg relative min-h-screen overflow-hidden pt-20 pb-16">
      {/* 粒子背景 */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-white/30"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animationDelay: `${(i % 5) * 0.5}s`,
            }}
          />
        ))}
      </div>
      <div className="relative mx-auto max-w-2xl px-6">
        <TodayColor color={todayColor} />
      </div>
    </main>
  );
}
