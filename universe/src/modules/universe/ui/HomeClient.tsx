"use client";

import dynamic from "next/dynamic";
import type { ChineseColor } from "@/shared/types";
import SceneErrorBoundary from "@/core/boundaries/SceneErrorBoundary";

const UniverseScene = dynamic(
  () => import("@/modules/universe/scene/UniverseScene").then((m) => m.default),
  { ssr: false, loading: UniverseLoading }
);

function UniverseLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "#050510" }}
    >
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
          role="progressbar"
          aria-label="加载中"
        />
        <p className="text-white/70">加载宇宙中...</p>
        <a
          href="/galaxy"
          className="mt-6 inline-block text-sm text-white/50 underline hover:text-white/70"
        >
          若加载过久，可先进入颜色星空 →
        </a>
      </div>
    </div>
  );
}

interface HomeClientProps {
  colors: ChineseColor[];
}

export default function HomeClient({ colors }: HomeClientProps) {
  return (
    <SceneErrorBoundary fallback={<UniverseLoading />}>
      <UniverseScene colors={colors} />
    </SceneErrorBoundary>
  );
}
