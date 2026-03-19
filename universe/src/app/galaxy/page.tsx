import { fetchColors } from "@/services/data/data";
import ColorGalaxy from "@/modules/explore/ui/ColorGalaxy";

export default async function GalaxyPage() {
  const colors = await fetchColors();

  return (
    <main className="cosmic-bg min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          颜色星空 · Color Galaxy
        </h1>
        <p className="mb-6 text-white/60">
          每个颜色是星空中的发光节点，连线表示文化关联。悬停查看信息，点击展开详情。滚轮缩放 · 拖拽平移画布。
        </p>
      </div>
      <ColorGalaxy colors={colors} />
    </main>
  );
}
