"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { rgbToHex } from "@/modules/toolkit/lib/colorSpace";
import { imageDataToSamples, kMeansRgb } from "@/modules/toolkit/lib/kMeansRgb";
import type { KDPoint } from "@/modules/toolkit/lib/kdTree";
import { KDTree } from "@/modules/toolkit/lib/kdTree";

export function ImageSection({ colors }: { colors: ColorEntity[] }) {
  const [k, setK] = useState(5);
  const [centroids, setCentroids] = useState<[number, number, number][]>([]);
  const [matches, setMatches] = useState<(ColorEntity | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runKMeans = useCallback(
    (file: File) => {
      if (!canvasRef.current) return;
      const img = new Image();
      img.onload = () => {
        const c = canvasRef.current!;
        const max = 320;
        let w = img.width;
        let h = img.height;
        if (w > max) {
          h = (h * max) / w;
          w = max;
        }
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        const samples = imageDataToSamples(data, 3);
        if (samples.length < k) return;
        const centers = kMeansRgb(samples, k, 20);
        setCentroids(centers);

        const points: KDPoint<ColorEntity>[] = colors.map((c) => ({
          coords: [c.rgb[0], c.rgb[1], c.rgb[2]] as [number, number, number],
          data: c,
        }));
        const tree = new KDTree(points);
        const m = centers.map((pt) => tree.nearest(pt));
        setMatches(m.map((p) => p?.data ?? null));
      };
      img.src = URL.createObjectURL(file);
    },
    [colors, k]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">图片取色 · K-Means</h2>
      <p className="text-sm text-white/55">
        将像素视为 RGB 向量集合，K-Means 聚类得到主色；再与中国色库 KD-Tree
        对齐最近传统色名。
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-white/70">
          聚类数 K
          <input
            type="number"
            min={2}
            max={12}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="ml-2 w-16 rounded border border-white/10 bg-black/30 px-2 py-1 text-white"
          />
        </label>
        <input
          type="file"
          accept="image/*"
          className="text-sm text-white/70 file:mr-2 file:rounded-lg file:border-0 file:bg-[#26A69A]/30 file:px-3 file:py-2 file:text-white"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) runKMeans(f);
          }}
        />
      </div>

      <canvas ref={canvasRef} className="max-h-64 max-w-full rounded-xl border border-white/10" />

      {centroids.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {centroids.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <div
                className="h-10 w-10 rounded-lg border border-white/20"
                style={{ backgroundColor: rgbToHex({ r: c[0], g: c[1], b: c[2] }) }}
              />
              <div className="text-xs">
                <p className="font-mono text-white/80">
                  {rgbToHex({ r: c[0], g: c[1], b: c[2] })}
                </p>
                {matches[i] && (
                  <Link
                    href={`/color/${encodeURIComponent(matches[i]!.name)}`}
                    className="text-[#26A69A] hover:underline"
                  >
                    ≈ {matches[i]!.name}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
