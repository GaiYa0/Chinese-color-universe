"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { parseHex } from "@/modules/toolkit/lib/colorSpace";
import type { KDPoint } from "@/modules/toolkit/lib/kdTree";
import { KDTree } from "@/modules/toolkit/lib/kdTree";

export function MatchSection({ colors }: { colors: ColorEntity[] }) {
  const [hex, setHex] = useState("#888888");
  const tree = useMemo(() => {
    const points: KDPoint<ColorEntity>[] = colors.map((c) => ({
      coords: [c.rgb[0], c.rgb[1], c.rgb[2]] as [number, number, number],
      data: c,
    }));
    return new KDTree(points);
  }, [colors]);

  const match = useMemo(() => {
    const rgb = parseHex(hex);
    if (!rgb) return null;
    const pt: [number, number, number] = [rgb.r, rgb.g, rgb.b];
    const n = tree.nearest(pt);
    if (!n) return null;
    const d = Math.sqrt(
      (n.coords[0] - pt[0]) ** 2 +
        (n.coords[1] - pt[1]) ** 2 +
        (n.coords[2] - pt[2]) ** 2
    );
    return { color: n.data, dist: d };
  }, [hex, tree]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">中国色匹配</h2>
      <p className="text-sm text-white/55">
        在 RGB 三维空间构建 KD-Tree，查询与任意颜色欧氏距离最近的传统色名。
      </p>
      <input
        type="color"
        value={hex.match(/^#([0-9a-f]{6})$/i) ? hex : "#888888"}
        onChange={(e) => setHex(e.target.value)}
        className="h-14 w-28 cursor-pointer rounded-xl border border-white/10 bg-transparent"
      />
      <input
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        className="font-mono w-full max-w-xs rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
      />
      {match && (
        <div className="rounded-2xl border border-[#26A69A]/30 bg-[#26A69A]/10 p-4">
          <p className="text-xs text-white/50">最近邻（KD-Tree）</p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div
              className="h-16 w-16 rounded-xl border border-white/20"
              style={{ backgroundColor: match.color.hex }}
            />
            <div>
              <Link
                href={`/color/${encodeURIComponent(match.color.name)}`}
                className="text-lg font-medium text-[#26A69A] hover:underline"
              >
                {match.color.name}
              </Link>
              <p className="text-sm text-white/60">{match.color.hex}</p>
              <p className="text-xs text-white/40">
                ΔRGB ≈ {match.dist.toFixed(2)}（欧氏距离）
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
