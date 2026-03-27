"use client";

import type { ReactNode } from "react";
import { useId } from "react";

/**
 * 传统纹饰展示：云、龙、如意、回纹均为四层错位旋转叠放；
 * 四色取自配色模块传入的 palette（胭脂、月白、竹青、妃色等）。
 */
interface TraditionalPatternShowcaseProps {
  /** 四色 HEX */
  palette: [string, string, string, string];
}

type RenderFn = (
  p: [string, string, string, string],
  uid: string
) => ReactNode;

/** 四层错位旋转叠放：位置与云纹、龙纹稿一致 */
const LAYER_LAYOUT = [
  { top: 20, left: 20, rotate: 0 },
  { top: 50, left: 40, rotate: 15 },
  { top: 80, left: 60, rotate: 30 },
  { top: 110, left: 80, rotate: 45 },
] as const;

const layeredWrapClass =
  "relative mx-auto h-48 w-full max-w-[220px] origin-top scale-[0.58] sm:scale-[0.72] md:scale-100";

function LayeredCloudPattern({
  colors,
  uid,
}: {
  colors: [string, string, string, string];
  uid: string;
}) {
  return (
    <div className={layeredWrapClass}>
      {LAYER_LAYOUT.map((layer, i) => {
        const stroke = colors[i];
        const fid = `cloud-shadow-${uid}-${i}`;
        return (
          <svg
            key={fid}
            className="absolute"
            viewBox="0 0 100 100"
            style={{
              top: layer.top,
              left: layer.left,
              width: 120,
              height: 80,
              transform: `rotate(${layer.rotate}deg)`,
              opacity: 0.8,
            }}
            aria-hidden
          >
            <defs>
              <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="2"
                  floodColor={stroke}
                  floodOpacity={0.5}
                />
              </filter>
            </defs>
            <g filter={`url(#${fid})`}>
              <path
                d="M20,50 Q30,30 40,50 Q50,30 60,50 Q70,30 80,50 Q70,70 60,50 Q50,70 40,50 Q30,70 20,50"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M30,40 Q40,20 50,40 Q60,20 70,40"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

function LayeredDragonPattern({
  colors,
  uid,
}: {
  colors: [string, string, string, string];
  uid: string;
}) {
  return (
    <div className={layeredWrapClass}>
      {LAYER_LAYOUT.map((layer, i) => {
        const stroke = colors[i];
        const fid = `dragon-shadow-${uid}-${i}`;
        return (
          <svg
            key={fid}
            className="absolute"
            viewBox="0 0 100 100"
            style={{
              top: layer.top,
              left: layer.left,
              width: 120,
              height: 80,
              transform: `rotate(${layer.rotate}deg)`,
              opacity: 0.8,
            }}
            aria-hidden
          >
            <defs>
              <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="2"
                  floodColor={stroke}
                  floodOpacity={0.5}
                />
              </filter>
            </defs>
            <g filter={`url(#${fid})`}>
              <path
                d="M10,50 C20,30 30,70 40,50 C50,30 60,70 70,50 C75,45 80,45 85,50"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M85,45 C87,43 89,43 90,45"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="90" cy="45" r="3" fill={stroke} />
              <path
                d="M10,45 L5,45 L5,40 L10,40"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10,55 L5,55 L5,60 L10,60"
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

const MEANDER_PATH =
  "M0,0 L5,0 L5,5 L10,5 L10,0 L15,0 L15,5 L20,5 L20,0 L20,5 L15,5 L15,10 L10,10 L10,15 L5,15 L5,10 L0,10 L0,5 L0,0";

function LayeredMeanderPattern({
  colors,
  uid,
}: {
  colors: [string, string, string, string];
  uid: string;
}) {
  return (
    <div className={layeredWrapClass}>
      {LAYER_LAYOUT.map((layer, i) => {
        const c = colors[i];
        const pid = `meander-pattern-${uid}-${i}`;
        const fid = `hui-shadow-${uid}-${i}`;
        return (
          <svg
            key={pid}
            className="absolute"
            viewBox="0 0 100 100"
            style={{
              top: layer.top,
              left: layer.left,
              width: 120,
              height: 100,
              transform: `rotate(${layer.rotate}deg)`,
              opacity: 0.8,
            }}
            aria-hidden
          >
            <defs>
              <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="2"
                  floodColor={c}
                  floodOpacity={0.45}
                />
              </filter>
              <pattern
                id={pid}
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={MEANDER_PATH}
                  fill={c}
                  stroke={c}
                  strokeWidth="0.5"
                  opacity={0.95}
                />
              </pattern>
            </defs>
            <g filter={`url(#${fid})`}>
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                fill={`url(#${pid})`}
                opacity={0.92}
              />
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                fill="none"
                stroke={c}
                strokeWidth="0.75"
                opacity={0.4}
              />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

function LayeredRuyiPattern({
  colors,
  uid,
}: {
  colors: [string, string, string, string];
  uid: string;
}) {
  return (
    <div className={layeredWrapClass}>
      {LAYER_LAYOUT.map((layer, i) => {
        const stroke = colors[i];
        const fid = `ruyi-shadow-${uid}-${i}`;
        return (
          <svg
            key={fid}
            className="absolute"
            viewBox="0 0 100 100"
            style={{
              top: layer.top,
              left: layer.left,
              width: 120,
              height: 80,
              transform: `rotate(${layer.rotate}deg)`,
              opacity: 0.8,
            }}
            aria-hidden
          >
            <defs>
              <filter id={fid} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="1"
                  dy="1"
                  stdDeviation="2"
                  floodColor={stroke}
                  floodOpacity={0.45}
                />
              </filter>
            </defs>
            <g filter={`url(#${fid})`}>
              <path
                d="M20,50 C30,30 40,70 50,50 C60,30 70,70 80,50"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20,50 C30,70 40,30 50,50 C60,70 70,30 80,50"
                fill="none"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="5" fill={stroke} />
              <circle cx="50" cy="50" r="2.2" fill={stroke} opacity={0.45} />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

const PATTERNS: { id: string; title: string; render: RenderFn }[] = [
  {
    id: "yun",
    title: "云纹",
    render: ([c0, c1, c2, c3], uid) => (
      <LayeredCloudPattern colors={[c0, c1, c2, c3]} uid={uid} />
    ),
  },
  {
    id: "hui",
    title: "回纹",
    render: ([c0, c1, c2, c3], uid) => (
      <LayeredMeanderPattern colors={[c0, c1, c2, c3]} uid={uid} />
    ),
  },
  {
    id: "long",
    title: "龙纹",
    render: ([c0, c1, c2, c3], uid) => (
      <LayeredDragonPattern colors={[c0, c1, c2, c3]} uid={uid} />
    ),
  },
  {
    id: "ruyi",
    title: "如意纹",
    render: ([c0, c1, c2, c3], uid) => (
      <LayeredRuyiPattern colors={[c0, c1, c2, c3]} uid={uid} />
    ),
  },
];

export function TraditionalPatternShowcase({ palette }: TraditionalPatternShowcaseProps) {
  const rid = useId().replace(/:/g, "");

  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-white">传统纹饰展示</h3>
      <p className="text-sm text-white/50">
        四种纹饰均为四层错位旋转叠放；四色来自上方所选配色方案（与色谱数据一致）。
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {PATTERNS.map((p) => (
          <div
            key={p.id}
            className="relative overflow-visible rounded-2xl border border-white/[0.08] bg-[#1a1d23]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <span className="absolute left-3 top-3 z-10 text-xs font-medium text-white/80">
              {p.title}
            </span>
            <div className="relative mt-8 flex min-h-[11rem] items-center justify-center overflow-visible p-1 sm:min-h-[12rem]">
              {p.render(palette, `${rid}-${p.id}`)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
