"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { parseHex } from "@/modules/toolkit/lib/colorSpace";
import type { KDPoint } from "@/modules/toolkit/lib/kdTree";
import { KDTree } from "@/modules/toolkit/lib/kdTree";
import { topKNearestByHeap } from "@/modules/toolkit/lib/schemeGenerator";

export function SimilarSection({ colors }: { colors: ColorEntity[] }) {
  const [hex, setHex] = useState("#26A69A");
  const [k, setK] = useState(8);

  const tree = useMemo(() => {
    const points: KDPoint<ColorEntity>[] = colors.map((c) => ({
      coords: [c.rgb[0], c.rgb[1], c.rgb[2]] as [number, number, number],
      data: c,
    }));
    return new KDTree(points);
  }, [colors]);

  const kdResults = useMemo(() => {
    const rgb = parseHex(hex);
    if (!rgb) return [];
    const pt: [number, number, number] = [rgb.r, rgb.g, rgb.b];
    return tree.nearestK(pt, k);
  }, [hex, tree, k]);

  const heapResults = useMemo(() => {
    const rgb = parseHex(hex);
    if (!rgb) return [];
    return topKNearestByHeap(rgb, colors, k);
  }, [hex, colors, k]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">相似颜色推荐</h2>
      <p className="text-sm text-white/55">
        KD-Tree K 近邻查询；右侧用二叉堆 Top-K 全量比对作交叉验证（结果应一致或极接近）。
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#26A69A"}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-24 cursor-pointer rounded-xl border border-white/10"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="font-mono max-w-xs rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white"
        />
        <label className="text-sm text-white/70">
          K
          <input
            type="number"
            min={3}
            max={24}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="ml-2 w-16 rounded border border-white/10 bg-black/30 px-2 py-1 text-white"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#26A69A]">KD-Tree K 近邻</h3>
          <ul className="space-y-2">
            {kdResults.map((p) => (
              <li key={p.data.name} className="flex items-center gap-3 text-sm">
                <div
                  className="h-8 w-8 shrink-0 rounded border border-white/20"
                  style={{ backgroundColor: p.data.hex }}
                />
                <Link
                  href={`/color/${encodeURIComponent(p.data.name)}`}
                  className="text-white hover:text-[#26A69A]"
                >
                  {p.data.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#7FD0C2]">二叉堆 Top-K（全量距离）</h3>
          <ul className="space-y-2">
            {heapResults.map((r) => (
              <li key={r.color.name} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded border border-white/20"
                    style={{ backgroundColor: r.color.hex }}
                  />
                  <Link
                    href={`/color/${encodeURIComponent(r.color.name)}`}
                    className="text-white hover:text-[#7FD0C2]"
                  >
                    {r.color.name}
                  </Link>
                </div>
                <span className="font-mono text-xs text-white/40">
                  {r.distance.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
