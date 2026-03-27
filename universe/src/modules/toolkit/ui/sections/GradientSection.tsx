"use client";

import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { GRADIENT_PRESETS } from "@/modules/toolkit/lib/gradientPresets";
import { ChineseColorSelect } from "@/modules/toolkit/ui/components/ChineseColorSelect";

export function GradientSection({ colors }: { colors: ColorEntity[] }) {
  const [a, setA] = useState("#26A69A");
  const [b, setB] = useState("#7C4DFF");
  const [angle, setAngle] = useState(135);

  const css = useMemo(() => {
    return `background: linear-gradient(${angle}deg, ${a}, ${b});`;
  }, [a, b, angle]);

  const tailwindHint = useMemo(() => {
    return `bg-gradient-to-br from-[${a}] to-[${b}] /* 角度请用 arbitrary */`;
  }, [a, b]);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-white">渐变生成器</h2>
      <p className="text-sm text-white/55">
        可从本站中国色色谱直接点选起点/终点，亦可用手动取色微调；支持角度调节与一键复制 CSS。
      </p>

      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50">推荐渐变搭配</p>
        <div className="flex flex-wrap gap-2">
          {GRADIENT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={`${p.note} · ${p.angle}°`}
              onClick={() => {
                setA(p.from);
                setB(p.to);
                setAngle(p.angle);
              }}
              className="group flex max-w-[200px] flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-2.5 text-left transition hover:border-[#26A69A]/45 hover:bg-[#26A69A]/10"
            >
              <span
                className="h-8 w-full rounded-lg border border-white/10"
                style={{
                  background: `linear-gradient(${p.angle}deg, ${p.from}, ${p.to})`,
                }}
              />
              <span className="text-xs font-medium text-white/90">{p.name}</span>
              <span className="line-clamp-2 text-[10px] leading-snug text-white/45">
                {p.note}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <ChineseColorSelect
            label="起点色 · 色谱"
            valueHex={a}
            onPickHex={setA}
            colors={colors}
          />
          <label className="flex flex-col gap-2">
            <span className="text-xs text-white/50">起点色 · 手动微调</span>
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(a) ? a : "#26A69A"}
              onChange={(e) => setA(e.target.value)}
              className="h-12 w-full max-w-[120px] cursor-pointer rounded-lg border border-white/10"
            />
          </label>
        </div>

        <div className="space-y-4">
          <ChineseColorSelect
            label="终点色 · 色谱"
            valueHex={b}
            onPickHex={setB}
            colors={colors}
          />
          <label className="flex flex-col gap-2">
            <span className="text-xs text-white/50">终点色 · 手动微调</span>
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(b) ? b : "#7C4DFF"}
              onChange={(e) => setB(e.target.value)}
              className="h-12 w-full max-w-[120px] cursor-pointer rounded-lg border border-white/10"
            />
          </label>
        </div>
      </div>

      <label className="flex min-w-[200px] max-w-md flex-col gap-2">
        <span className="text-xs text-white/50">角度 {angle}°</span>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="accent-[#26A69A]"
        />
      </label>

      <div
        className="h-40 w-full max-w-2xl rounded-2xl border border-white/10 shadow-lg"
        style={{ background: `linear-gradient(${angle}deg, ${a}, ${b})` }}
      />

      <div className="space-y-2">
        <span className="text-xs text-white/50">CSS</span>
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-[#7FD0C2]">
          {css}
        </pre>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(css)}
          className="rounded-xl border border-[#26A69A]/40 bg-[#26A69A]/20 px-4 py-2 text-sm text-[#26A69A] transition hover:bg-[#26A69A]/30"
        >
          复制 CSS
        </button>
      </div>
      <p className="text-xs text-white/35">Tailwind 提示（需 arbitrary）：{tailwindHint}</p>
    </div>
  );
}
