import { fetchColors } from "@/services/data/data";
import ToolkitClient from "@/modules/toolkit/ui/ToolkitClient";

export const metadata = {
  title: "中国色工具系统 | 中国色宇宙",
  description:
    "颜色转换、中国色匹配、调色器、渐变生成、图片取色、配色方案、相似推荐",
};

export default async function ToolsPage() {
  const colors = await fetchColors();

  return (
    <main className="toolkit-hero-bg flex min-h-screen flex-col overflow-auto">
      <ToolkitClient colors={colors} />
    </main>
  );
}
