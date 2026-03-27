"use client";

/**
 * Web3 风格「能量卡片」工具入口
 *
 * - 玻璃拟态 + 渐变发光边框 + hover 强发光
 * - hover：scale 1.05、上浮、发光增强（CSS transition）
 * - 鼠标跟随径向高光 + rAF 倾斜（3D）
 * - prefers-reduced-motion / 粗指针：关闭倾斜与指针跟随
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ToolkitTabId } from "./toolkitToolConfig";
import { TOOLKIT_TOOL_THEMES, type ToolkitToolTheme } from "./toolkitToolConfig";

interface ToolkitGlowCardsProps {
  active: ToolkitTabId;
  onSelect: (id: ToolkitTabId) => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const TILT_MAX_DEG = 9;

const ToolEnergyCard = memo(function ToolEnergyCard({
  theme,
  active,
  onSelect,
  index,
}: {
  theme: ToolkitToolTheme;
  active: boolean;
  onSelect: (id: ToolkitTabId) => void;
  index: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const pointerRaf = useRef<number | null>(null);
  const pendingPointer = useRef<{ cx: number; cy: number } | null>(null);

  const { r, g, b } = hexToRgb(theme.accent);
  const glow = useMemo(() => `rgba(${r},${g},${b},`, [r, g, b]);

  const [enableTilt, setEnableTilt] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const sync = () => setEnableTilt(!reduced.matches && !coarse.matches);
    sync();
    reduced.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enableTilt && tiltRef.current) {
      tiltRef.current.style.transform = "";
    }
  }, [enableTilt]);

  const applyPointer = useCallback(() => {
    const el = rootRef.current;
    const tiltEl = tiltRef.current;
    const p = pendingPointer.current;
    pendingPointer.current = null;
    pointerRaf.current = null;
    if (!el || !p || !tiltEl) return;

    const rect = el.getBoundingClientRect();
    const lx = p.cx - rect.left;
    const ly = p.cy - rect.top;
    const px = lx / rect.width - 0.5;
    const py = ly / rect.height - 0.5;
    const rx = -py * TILT_MAX_DEG;
    const ry = px * TILT_MAX_DEG;
    tiltEl.style.transform = `perspective(960px) translate3d(0,0,0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    el.style.setProperty("--toolkit-pointer-x", `${(lx / rect.width) * 100}%`);
    el.style.setProperty("--toolkit-pointer-y", `${(ly / rect.height) * 100}%`);
  }, []);

  const resetPointer = useCallback(() => {
    if (pointerRaf.current !== null) {
      cancelAnimationFrame(pointerRaf.current);
      pointerRaf.current = null;
    }
    pendingPointer.current = null;
    if (tiltRef.current) {
      tiltRef.current.style.transform = "";
    }
    if (rootRef.current) {
      rootRef.current.style.setProperty("--toolkit-pointer-x", "50%");
      rootRef.current.style.setProperty("--toolkit-pointer-y", "50%");
    }
  }, []);

  useEffect(() => {
    if (!enableTilt) return;
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      pendingPointer.current = { cx: e.clientX, cy: e.clientY };
      if (pointerRaf.current === null) {
        pointerRaf.current = requestAnimationFrame(applyPointer);
      }
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", resetPointer);
    el.addEventListener("pointercancel", resetPointer);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", resetPointer);
      el.removeEventListener("pointercancel", resetPointer);
      resetPointer();
    };
  }, [enableTilt, applyPointer, resetPointer]);

  useEffect(() => {
    return () => {
      if (pointerRaf.current !== null) cancelAnimationFrame(pointerRaf.current);
    };
  }, []);

  const enterDelayStyle = useMemo(
    () => ({ animationDelay: `${Math.min(index, 12) * 0.045}s` } as const),
    [index]
  );

  const handleClick = useCallback(() => onSelect(theme.id), [onSelect, theme.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(theme.id);
      }
    },
    [onSelect, theme.id]
  );

  return (
    <div
      className="toolkit-tool-card-enter min-w-0"
      style={enterDelayStyle}
    >
      {/* onClick 直接绑在最外层：不依赖透明 button 的层叠命中，100% 可靠 */}
      <div
        ref={rootRef}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group relative cursor-pointer touch-manipulation select-none rounded-[20px] outline-none ring-[#26A69A]/55 focus-visible:ring-2 [--toolkit-pointer-x:50%] [--toolkit-pointer-y:50%]"
      >
        <div
          ref={tiltRef}
          className="origin-center [transform-style:preserve-3d] will-change-transform"
        >
          <div className="origin-center transition-[transform,filter] duration-300 ease-out will-change-transform group-hover:scale-[1.05] group-hover:-translate-y-2 group-active:scale-[0.97] group-active:duration-100 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100">
            <div
              className="relative w-full overflow-hidden rounded-[20px] opacity-75 shadow-[0_0_20px_-6px_rgba(0,0,0,0.6)] transition-[opacity,box-shadow,filter] duration-300 group-hover:opacity-100 group-hover:brightness-110 group-hover:saturate-125"
              style={{
                boxShadow: `0 0 28px -8px ${glow}0.22)`,
              }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(260%,52rem)] toolkit-card-border-spin"
                style={{
                  background: `conic-gradient(from 0deg, ${theme.accentSoft}f0, ${theme.accent}, rgba(255,255,255,0.42), ${theme.accent}, ${theme.accentSoft}f0)`,
                }}
                aria-hidden
              />
              <div className="relative z-10 m-[2px] overflow-hidden rounded-[18px] bg-[#0a0e18]/95 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[box-shadow,filter] duration-300 group-hover:shadow-[0_20px_56px_rgba(0,0,0,0.5)] group-active:brightness-90 group-active:shadow-[inset_0_3px_14px_rgba(0,0,0,0.4)] group-active:duration-100">
                <div
                  className="pointer-events-none absolute -inset-px rounded-[18px] opacity-40 transition-opacity duration-300 group-hover:opacity-75"
                  style={{
                    background: `linear-gradient(125deg, ${theme.accentSoft}66, transparent 46%, ${theme.accent}aa, transparent 78%)`,
                  }}
                />

                <span
                  className="pointer-events-none absolute inset-0 z-[1] rounded-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-0"
                  style={{
                    background: `radial-gradient(420px circle at var(--toolkit-pointer-x) var(--toolkit-pointer-y), ${glow}0.42), transparent 52%)`,
                  }}
                />

                <div
                  className="relative z-0 flex min-h-[118px] flex-col justify-between rounded-[18px] border border-white/[0.09] bg-[#0f141f]/55 p-4 backdrop-blur-xl backdrop-saturate-150 md:min-h-[128px]"
                  style={{
                    boxShadow: active
                      ? `0 0 0 1px ${glow}0.55), 0 0 36px ${glow}0.35), 0 12px 40px ${glow}0.22), inset 0 1px 0 rgba(255,255,255,0.08)`
                      : `0 8px 28px ${glow}0.14), inset 0 1px 0 rgba(255,255,255,0.06)`,
                  }}
                >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/38">
                      {theme.pigment}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold tracking-tight text-white md:text-[17px]">
                      {theme.label}
                    </h3>
                  </div>
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition-[box-shadow,transform] duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: theme.accent,
                      boxShadow: `0 0 8px ${theme.accent}, 0 0 18px ${glow}0.45)`,
                    }}
                  />
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-white/48 md:text-xs">
                  {theme.sub}
                </p>

                <div
                  className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]"
                  aria-hidden
                >
                  <div
                    className="h-full w-full origin-left rounded-full transition-transform duration-300 ease-out [will-change:transform] group-hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                    style={{
                      backgroundColor: theme.accent,
                      transform: `scaleX(${active ? 1 : 0.32})`,
                      boxShadow: active ? `0 0 14px ${glow}0.55)` : undefined,
                    }}
                  />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export function ToolkitGlowCards({ active, onSelect }: ToolkitGlowCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {TOOLKIT_TOOL_THEMES.map((theme, index) => (
        <ToolEnergyCard
          key={theme.id}
          index={index}
          theme={theme}
          active={active === theme.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
