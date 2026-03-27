"use client";

import Link from "next/link";
import type { ColorEntity } from "@/entities/color/model/color.types";
import type { RecommendedTraditionalScheme } from "@/modules/toolkit/lib/recommendedTraditionalSchemes";
import { resolveSchemePaletteHex } from "@/modules/toolkit/lib/recommendedTraditionalSchemes";
import { ChineseStyleUIShowcase } from "@/modules/toolkit/ui/components/ChineseStyleUIShowcase";
import { TraditionalPatternShowcase } from "@/modules/toolkit/ui/components/TraditionalPatternShowcase";

interface SchemePatternDetailProps {
  scheme: RecommendedTraditionalScheme;
  colors: ColorEntity[];
}

export function SchemePatternDetail({ scheme, colors }: SchemePatternDetailProps) {
  const palette = resolveSchemePaletteHex(scheme, colors);
  const colorMap = new Map(colors.map((c) => [c.name, c]));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-4">
      <nav className="text-sm text-white/45">
        <Link href="/tools/schemes" className="hover:text-[#80CBC4]">
          传统配色方案
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{scheme.name}</span>
      </nav>

      <header className="space-y-4">
        <h1 className="text-2xl font-bold text-white md:text-3xl">{scheme.name}</h1>
        <p className="max-w-2xl text-white/55">{scheme.description}</p>
        <div className="flex flex-wrap gap-2">
          {scheme.colorNames.map((name) => {
            const c = colorMap.get(name);
            return (
              <Link
                key={name}
                href={`/color/${encodeURIComponent(name)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-[#26A69A]/40 hover:bg-white/[0.07]"
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-lg border border-white/15"
                  style={{ backgroundColor: c?.hex ?? "#444" }}
                />
                <span>
                  <span className="text-white">{name}</span>
                  <span className="ml-2 font-mono text-xs text-white/40">{c?.hex}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </header>

      <section className="border-t border-white/[0.08] pt-8">
        <TraditionalPatternShowcase palette={palette} />
      </section>

      <section className="border-t border-white/[0.08] pt-8">
        <ChineseStyleUIShowcase palette={palette} />
      </section>

      <div className="flex flex-wrap gap-3 pt-4">
        <Link
          href="/tools/schemes"
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white transition hover:border-[#26A69A]/50 hover:bg-white/10"
        >
          ← 返回配色方案列表
        </Link>
        <Link
          href="/tools"
          className="rounded-xl border border-[#26A69A]/30 bg-[#26A69A]/10 px-5 py-2.5 text-sm text-[#80CBC4] transition hover:bg-[#26A69A]/20"
        >
          打开色工具
        </Link>
      </div>
    </div>
  );
}
