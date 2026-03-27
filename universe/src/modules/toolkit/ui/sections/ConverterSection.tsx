"use client";

import { useMemo, useState } from "react";
import { hslToRgb, parseHex, rgbToHex, rgbToHsl, type RGB } from "@/modules/toolkit/lib/colorSpace";

export function ConverterSection() {
  const [hex, setHex] = useState("#26A69A");

  const parsed = useMemo(() => {
    const rgb = parseHex(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb);
    return { rgb, hsl };
  }, [hex]);

  const syncFromRgb = (next: RGB) => {
    setHex(rgbToHex(next));
  };

  const syncFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb({ h, s, l });
    setHex(rgbToHex(rgb));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">颜色转换器</h2>
      <p className="text-sm text-white/55">
        HEX ⇄ RGB ⇄ HSL 实时联动，全部在浏览器端完成。
      </p>

      <div
        className="h-28 w-full max-w-md rounded-2xl border border-white/10 shadow-inner transition"
        style={{ backgroundColor: parsed ? rgbToHex(parsed.rgb) : "#333" }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-xs text-white/50">HEX</span>
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-white outline-none focus:border-[#26A69A]/50"
            placeholder="#RRGGBB"
          />
        </label>

        {parsed && (
          <>
            <div className="space-y-2">
              <span className="text-xs text-white/50">RGB</span>
              <div className="flex gap-2">
                {(["r", "g", "b"] as const).map((k) => (
                  <input
                    key={k}
                    type="number"
                    min={0}
                    max={255}
                    value={parsed.rgb[k]}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      syncFromRgb({ ...parsed.rgb, [k]: v });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-white"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs text-white/50">HSL</span>
              <div className="grid grid-cols-3 gap-2">
                <label className="text-xs text-white/40">
                  H°
                  <input
                    type="number"
                    value={Math.round(parsed.hsl.h)}
                    onChange={(e) =>
                      syncFromHsl(Number(e.target.value), parsed.hsl.s, parsed.hsl.l)
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-xs text-white/40">
                  S%
                  <input
                    type="number"
                    value={Math.round(parsed.hsl.s)}
                    onChange={(e) =>
                      syncFromHsl(parsed.hsl.h, Number(e.target.value), parsed.hsl.l)
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  />
                </label>
                <label className="text-xs text-white/40">
                  L%
                  <input
                    type="number"
                    value={Math.round(parsed.hsl.l)}
                    onChange={(e) =>
                      syncFromHsl(parsed.hsl.h, parsed.hsl.s, Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
