"use client";

import { useRouter } from "next/navigation";
import { useSelectionStore } from "@/store/selection.store";

export default function BackToGalaxyLink() {
  const router = useRouter();
  const clearSelection = useSelectionStore((state) => state.clearSelection);

  const handleBack = () => {
    clearSelection();
    // 从哪来回哪去；若直接打开详情页（无历史）则返回首页
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-8 inline-flex items-center gap-2 text-white/60 transition hover:text-white"
    >
      ← 返回
    </button>
  );
}
