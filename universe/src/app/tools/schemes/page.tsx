import Link from "next/link";
import { fetchColors } from "@/services/data/data";
import { TraditionalSchemesGallery } from "@/modules/toolkit/ui/components/TraditionalSchemesGallery";

export const metadata = {
  title: "传统色彩配色方案 | 中国色宇宙",
  description:
    "精心挑选的传统色彩组合；点选方案查看云纹、回纹、龙纹、如意纹与中国风界面示意。",
};

export default async function TraditionalSchemesPage() {
  const colors = await fetchColors();

  return (
    <main className="toolkit-hero-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tools"
            className="text-sm text-[#80CBC4] transition hover:text-[#B2DFDB]"
          >
            ← 返回色工具
          </Link>
        </div>
        <TraditionalSchemesGallery colors={colors} />
      </div>
    </main>
  );
}
