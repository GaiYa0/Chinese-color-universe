"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import {
  RECOMMENDED_TRADITIONAL_SCHEMES,
  RECOMMENDED_SCHEME_TAGS,
} from "@/modules/toolkit/lib/recommendedTraditionalSchemes";

interface TraditionalSchemesGalleryProps {
  colors: ColorEntity[];
}

export function TraditionalSchemesGallery({ colors }: TraditionalSchemesGalleryProps) {
  const colorMap = useMemo(
    () => new Map(colors.map((c) => [c.name, c])),
    [colors]
  );

  const [tagFilter, setTagFilter] =
    useState<(typeof RECOMMENDED_SCHEME_TAGS)[number]>("全部");

  const filtered = useMemo(() => {
    if (tagFilter === "全部") return RECOMMENDED_TRADITIONAL_SCHEMES;
    return RECOMMENDED_TRADITIONAL_SCHEMES.filter((s) => s.tags.includes(tagFilter));
  }, [tagFilter]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="bg-gradient-to-r from-[#5C9FD8] via-[#26A69A] to-[#4DD0C1] bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
          传统色彩配色方案
        </h1>
        <p className="max-w-2xl text-sm text-white/55 md:text-base">
          精心挑选的传统色彩组合，为您的设计注入东方韵味。点选一套方案进入详情，查看以该四色渲染的传统纹饰。
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {RECOMMENDED_SCHEME_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTagFilter(t)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
              tagFilter === t
                ? "border-[#5C9FD8]/70 bg-[#5C9FD8]/20 text-[#9DD5FF]"
                : "border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:text-white/85"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((scheme) => (
          <Link
            key={scheme.id}
            href={`/tools/schemes/${scheme.id}`}
            className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0B0F1A]/85 shadow-[0_16px_48px_rgba(0,0,0,0.35)] transition hover:border-[#26A69A]/40 hover:bg-white/[0.04]"
          >
            <div className="flex h-14 w-full overflow-hidden">
              {scheme.colorNames.map((name) => {
                const hex = colorMap.get(name)?.hex ?? "#444";
                return (
                  <div
                    key={name}
                    className="min-w-0 flex-1"
                    style={{ backgroundColor: hex }}
                    title={`${name} ${hex}`}
                  />
                );
              })}
            </div>
            <div className="space-y-1.5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white group-hover:text-[#80CBC4]">
                  {scheme.name}
                </span>
                <span className="shrink-0 text-[10px] text-white/35">{scheme.tags[0]}</span>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
                {scheme.description}
              </p>
              <p className="text-[10px] text-[#26A69A]/80">点击进入纹饰展示 →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
