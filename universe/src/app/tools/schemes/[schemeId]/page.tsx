import { notFound } from "next/navigation";
import { fetchColors } from "@/services/data/data";
import {
  getRecommendedSchemeById,
  RECOMMENDED_TRADITIONAL_SCHEMES,
} from "@/modules/toolkit/lib/recommendedTraditionalSchemes";
import { SchemePatternDetail } from "@/modules/toolkit/ui/components/SchemePatternDetail";

export async function generateStaticParams() {
  return RECOMMENDED_TRADITIONAL_SCHEMES.map((s) => ({ schemeId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ schemeId: string }>;
}) {
  const { schemeId } = await params;
  const scheme = getRecommendedSchemeById(schemeId);
  if (!scheme) return { title: "配色方案 | 中国色宇宙" };
  return {
    title: `${scheme.name} · 纹饰展示 | 中国色宇宙`,
    description: scheme.description,
  };
}

export default async function SchemePatternPage({
  params,
}: {
  params: Promise<{ schemeId: string }>;
}) {
  const { schemeId } = await params;
  const scheme = getRecommendedSchemeById(schemeId);
  if (!scheme) notFound();

  const colors = await fetchColors();

  return (
    <main className="toolkit-hero-bg min-h-screen pt-20">
      <SchemePatternDetail scheme={scheme} colors={colors} />
    </main>
  );
}
