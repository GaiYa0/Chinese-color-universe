"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import {
  generateChineseSchemes,
  type HarmonyMode,
} from "@/modules/toolkit/lib/schemeGenerator";
import { ChineseColorSelect } from "@/modules/toolkit/ui/components/ChineseColorSelect";

const MODES: { id: HarmonyMode; label: string }[] = [
  { id: "analogous", label: "类似色（±30°）" },
  { id: "complementary", label: "互补（180°）" },
  { id: "triadic", label: "三角（120°）" },
  { id: "split", label: "分裂互补（150°/210°）" },
];

export function SchemeSection({ colors }: { colors: ColorEntity[] }) {
  const [hex, setHex] = useState("#26A69A");
  const [mode, setMode] = useState<HarmonyMode>("analogous");
  const [topK, setTopK] = useState(6);

  const schemes = useMemo(
    () => generateChineseSchemes(hex, colors, mode, topK),
    [hex, colors, mode, topK]
  );

  return (
    <div className="space-y-10">
      <h2 className="text-lg font-semibold text-white">配色方案 · 传统色与算法生成</h2>
      <p className="text-sm text-white/55">
        <strong className="text-white/80">传统色彩搭配与纹饰展示</strong>
        已拆为独立流程：先在配色方案库中选一套四色，再在详情页查看云纹、回纹、龙纹、如意纹及中国风界面示意。
      </p>

      <section className="rounded-2xl border border-[#26A69A]/25 bg-[#0B0F1A]/80 p-6 shadow-[0_0_40px_rgba(38,166,154,0.08)]">
        <h3 className="text-base font-semibold text-white">传统色彩配色方案</h3>
        <p className="mt-2 text-sm text-white/50">
          打开配色库，浏览分类、点选卡片进入详情，即可用该方案的四种中国色渲染传统纹饰。
        </p>
        <Link
          href="/tools/schemes"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#26A69A]/45 bg-[#26A69A]/15 px-5 py-3 text-sm font-medium text-[#B2DFDB] transition hover:border-[#80CBC4]/60 hover:bg-[#26A69A]/25"
        >
          前往传统配色方案库
          <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="space-y-6 border-t border-white/[0.06] pt-10">
        <h3 className="text-base font-semibold text-white">智能生成 · 优先队列 Top-K</h3>
        <p className="text-sm text-white/55">
          先选基准色：可从本站色谱点选，或手动取色 / 输入 HEX；再由 HSL 和谐角生成目标色，
          KD-Tree 找最近中国色；扩展明度变体后，用二叉堆 Top-K 选取若干传统色（去重）。
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <ChineseColorSelect
            label="基准色 · 色谱"
            valueHex={hex}
            onPickHex={setHex}
            colors={colors}
          />
          <div className="space-y-3">
            <span className="text-xs text-white/50">基准色 · 手动</span>
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] text-white/40">取色器</span>
                <input
                  type="color"
                  value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#26A69A"}
                  onChange={(e) => setHex(e.target.value)}
                  className="h-12 w-28 cursor-pointer rounded-xl border border-white/10"
                />
              </label>
              <label className="flex min-w-[140px] flex-1 flex-col gap-2">
                <span className="text-[10px] text-white/40">HEX</span>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#26A69A"
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as HarmonyMode)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white"
          >
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <label className="text-sm text-white/70">
            Top-K
            <input
              type="number"
              min={3}
              max={12}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="ml-2 w-16 rounded border border-white/10 bg-black/30 px-2 py-1 text-white"
            />
          </label>
        </div>

        <ul className="space-y-3">
          {schemes.map((s) => (
            <li
              key={`${s.color.name}-${s.role}`}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div
                className="h-12 w-12 rounded-lg border border-white/20"
                style={{ backgroundColor: s.color.hex }}
              />
              <div className="flex-1">
                <span className="text-xs text-[#26A69A]">{s.role}</span>
                <Link
                  href={`/color/${encodeURIComponent(s.color.name)}`}
                  className="block font-medium text-white hover:text-[#26A69A]"
                >
                  {s.color.name}
                </Link>
                <span className="text-xs text-white/40">Δ ≈ {s.distance.toFixed(1)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
