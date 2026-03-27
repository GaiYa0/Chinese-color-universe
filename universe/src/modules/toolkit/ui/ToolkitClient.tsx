"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { ColorEntity } from "@/entities/color/model/color.types";
import { ToolkitGlowCards } from "./components/ToolkitGlowCards";
import type { ToolkitTabId } from "./components/toolkitToolConfig";
import { ConverterSection } from "./sections/ConverterSection";
import { MatchSection } from "./sections/MatchSection";
import { PickerSection } from "./sections/PickerSection";
import { GradientSection } from "./sections/GradientSection";
import { ImageSection } from "./sections/ImageSection";
import { SchemeSection } from "./sections/SchemeSection";
import { SimilarSection } from "./sections/SimilarSection";

/** @deprecated 使用 ToolkitTabId */
export type TabId = ToolkitTabId;

interface ToolkitClientProps {
  colors: ColorEntity[];
}

export default function ToolkitClient({ colors }: ToolkitClientProps) {
  const [tab, setTab] = useState<ToolkitTabId>("converter");

  return (
    <div className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-20 md:px-6">
      {/* 环境光晕（与页面 toolkit-hero-bg 呼应） */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] max-w-4xl -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(38, 166, 154, 0.15), transparent 65%)",
        }}
        aria-hidden
      />

      <header className="relative mb-10 shrink-0">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.04] p-5 shadow-[0_0_40px_-12px_rgba(38,166,154,0.12)] backdrop-blur-xl backdrop-saturate-150 md:p-6">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-50 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(38, 166, 154, 0.22), transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-12 h-40 w-56 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(139, 122, 184, 0.14), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#26A69A]/90">
              Chinese Color Toolkit
            </p>
            <h1 className="bg-gradient-to-r from-white via-white to-white/75 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              中国色工具系统
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
              传统色谱 × 数据结构：KD-Tree、K-Means、二叉堆优先队列，服务中国色创作与开发。
            </p>
            <p className="mt-3 text-sm">
              <Link
                href="/tools/schemes"
                className="text-[#80CBC4] underline decoration-[#26A69A]/40 underline-offset-4 transition hover:text-[#B2DFDB] hover:decoration-[#80CBC4]"
              >
                传统色彩配色方案
              </Link>
              <span className="text-white/40"> — 选方案后查看纹饰与中国风界面示意</span>
            </p>
          </div>
        </div>
      </header>

      <div className="relative mb-8 shrink-0">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-white/45">
          <span
            className="h-1 w-1 rounded-full bg-[#26A69A] shadow-[0_0_10px_rgba(38,166,154,0.7)]"
            aria-hidden
          />
          选择工具模块
        </p>
        <ToolkitGlowCards active={tab} onSelect={setTab} />
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="toolkit-content-shell rounded-[22px] border border-white/[0.08] bg-[#0B0F1A]/65 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
              {tab === "converter" && <ConverterSection />}
              {tab === "match" && <MatchSection colors={colors} />}
              {tab === "picker" && <PickerSection colors={colors} />}
              {tab === "gradient" && <GradientSection colors={colors} />}
              {tab === "image" && <ImageSection colors={colors} />}
              {tab === "scheme" && <SchemeSection colors={colors} />}
              {tab === "similar" && <SimilarSection colors={colors} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
