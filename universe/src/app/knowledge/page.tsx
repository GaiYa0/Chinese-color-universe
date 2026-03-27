import { fetchColors } from "@/services/data/data";
import { buildKnowledgeGraphFromColors } from "@/modules/graph/lib/buildFromColors";
import KnowledgeGraph from "@/modules/graph/ui/KnowledgeGraph";

export default async function KnowledgePage() {
  const colorsData = await fetchColors();
  const { nodes, edges } = buildKnowledgeGraphFromColors(colorsData);
  const colors = colorsData.map((c) => ({ name: c.name, hex: c.hex }));

  return (
    <main className="cosmic-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          文化关系图 · 知识图谱
        </h1>
        <p className="mb-8 text-white/60">
          输入颜色名称，探索与之关联的朝代、文物、文化符号。支持 BFS 广度探索与 DFS 深度探索。已根据全部中国色数据自动构建知识图谱。
        </p>
        <KnowledgeGraph
          nodes={nodes}
          edges={edges}
          colors={colors}
        />
      </div>
    </main>
  );
}
