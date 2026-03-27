"use client";

import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";

interface ChineseColorSelectProps {
  label: string;
  valueHex: string;
  onPickHex: (hex: string) => void;
  colors: ColorEntity[];
}

/**
 * 从站内 colors 列表中搜索并选择颜色，用于渐变等场景
 */
export function ChineseColorSelect({
  label,
  valueHex,
  onPickHex,
  colors,
}: ChineseColorSelectProps) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return colors.slice(0, 48);
    return colors.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.hex.toLowerCase().includes(t)
    ).slice(0, 64);
  }, [colors, q]);

  return (
    <div className="space-y-2">
      <span className="text-xs text-white/50">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="搜索色名或 HEX…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[160px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <div
          className="h-10 w-14 shrink-0 rounded-lg border border-white/20"
          style={{ backgroundColor: valueHex }}
          title="当前值"
        />
      </div>
      <div className="max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2">
        <div className="flex flex-wrap gap-1.5">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              title={`${c.name} ${c.hex}`}
              onClick={() => onPickHex(c.hex)}
              className={`h-8 w-8 rounded-md border transition hover:scale-110 hover:border-[#26A69A]/60 ${
                c.hex.toUpperCase() === valueHex.toUpperCase()
                  ? "border-[#26A69A] ring-1 ring-[#26A69A]/50"
                  : "border-white/15"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-4 text-center text-xs text-white/40">无匹配色名</p>
        )}
      </div>
    </div>
  );
}
