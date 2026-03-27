"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { hslToRgb, parseHex, rgbToHex, rgbToHsl } from "@/modules/toolkit/lib/colorSpace";
import type { KDPoint } from "@/modules/toolkit/lib/kdTree";
import { KDTree } from "@/modules/toolkit/lib/kdTree";

export function PickerSection({ colors }: { colors: ColorEntity[] }) {
  const [hex, setHex] = useState("#26A69A");
  const [copied, setCopied] = useState<string | null>(null);

  const flash = useCallback((key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  }, []);

  const copyText = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text);
        flash(key);
      } catch {
        // ignore
      }
    },
    [flash]
  );
  const tree = useMemo(() => {
    const points: KDPoint<ColorEntity>[] = colors.map((c) => ({
      coords: [c.rgb[0], c.rgb[1], c.rgb[2]] as [number, number, number],
      data: c,
    }));
    return new KDTree(points);
  }, [colors]);

  const rgb = parseHex(hex);
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const nearest = useMemo(() => {
    if (!rgb) return null;
    return tree.nearest([rgb.r, rgb.g, rgb.b]);
  }, [rgb, tree]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">调色器</h2>
      <p className="text-sm text-white/55">
        原生取色器 + HSL 滑条实时反馈，并提示最接近的中国传统色（KD-Tree）。
      </p>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label className="mb-2 block text-xs text-white/50">选色</label>
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#26A69A"}
            onChange={(e) => setHex(e.target.value)}
            className="h-16 w-32 cursor-pointer rounded-xl border border-white/10"
          />
        </div>
        <div className="flex-1 space-y-3 min-w-[240px]">
          {hsl && (
            <>
              <label className="block text-xs text-white/50">
                H {Math.round(hsl.h)}°
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    const rgb2 = hslToRgb({ h, s: hsl!.s, l: hsl!.l });
                    setHex(rgbToHex(rgb2));
                  }}
                  className="mt-1 w-full accent-[#26A69A]"
                />
              </label>
              <label className="block text-xs text-white/50">
                S {Math.round(hsl.s)}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    const rgb2 = hslToRgb({ h: hsl.h, s, l: hsl.l });
                    setHex(rgbToHex(rgb2));
                  }}
                  className="mt-1 w-full accent-[#26A69A]"
                />
              </label>
              <label className="block text-xs text-white/50">
                L {Math.round(hsl.l)}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => {
                    const l = Number(e.target.value);
                    const rgb2 = hslToRgb({ h: hsl.h, s: hsl.s, l });
                    setHex(rgbToHex(rgb2));
                  }}
                  className="mt-1 w-full accent-[#26A69A]"
                />
              </label>
            </>
          )}
        </div>
      </div>

      <div
        className="h-24 w-full max-w-lg rounded-2xl border border-white/10"
        style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#333" }}
      />

      {rgb && (
        <div className="space-y-3">
          <p className="text-xs text-white/50">导出当前颜色</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(hex.toUpperCase(), "hex")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-[#26A69A]/40 hover:bg-white/10"
            >
              {copied === "hex" ? "已复制" : "复制 HEX"}
            </button>
            <button
              type="button"
              onClick={() =>
                copyText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")
              }
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-[#26A69A]/40 hover:bg-white/10"
            >
              {copied === "rgb" ? "已复制" : "复制 RGB"}
            </button>
            <button
              type="button"
              onClick={() =>
                copyText(
                  `color: ${hex.toUpperCase()};\n/* rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) */`,
                  "css"
                )
              }
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-[#26A69A]/40 hover:bg-white/10"
            >
              {copied === "css" ? "已复制" : "复制 CSS"}
            </button>
            <button
              type="button"
              onClick={() =>
                copyText(
                  JSON.stringify(
                    {
                      hex: hex.toUpperCase(),
                      rgb: [rgb.r, rgb.g, rgb.b],
                      hsl: hsl
                        ? {
                            h: Math.round(hsl.h),
                            s: Math.round(hsl.s),
                            l: Math.round(hsl.l),
                          }
                        : undefined,
                    },
                    null,
                    2
                  ),
                  "json"
                )
              }
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-[#26A69A]/40 hover:bg-white/10"
            >
              {copied === "json" ? "已复制" : "复制 JSON"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-white/50">
            {hex.toUpperCase()} · rgb({rgb.r}, {rgb.g}, {rgb.b})
            {hsl &&
              ` · hsl(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`}
          </pre>
        </div>
      )}

      {nearest && (
        <p className="text-sm text-white/70">
          最接近的中国色：
          <Link
            href={`/color/${encodeURIComponent(nearest.data.name)}`}
            className="ml-2 text-[#26A69A] hover:underline"
          >
            {nearest.data.name}
          </Link>
        </p>
      )}
    </div>
  );
}
