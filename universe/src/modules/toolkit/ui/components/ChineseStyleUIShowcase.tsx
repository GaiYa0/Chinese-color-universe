"use client";

/**
 * 中国风 UI 展示：窗棂、屏风、卷轴、印章等抽象组件示意
 */
interface ChineseStyleUIShowcaseProps {
  palette: [string, string, string, string];
}

export function ChineseStyleUIShowcase({ palette }: ChineseStyleUIShowcaseProps) {
  const [c0, c1, c2, c3] = palette;

  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-white">中国风 UI 展示</h3>
      <p className="text-sm text-white/50">
        将传统物象抽象为界面构件：格窗、屏风、卷轴、印信，四色分区展示。
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 窗棂 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#2d333b]/90 p-4">
          <p className="mb-3 text-xs font-medium text-white/85">传统窗棂 UI</p>
          <div className="flex h-36 items-end justify-center gap-1.5 px-2">
            {[c0, c1, c2, c3].map((c, i) => (
              <div
                key={i}
                className="group relative h-full min-h-0 flex-1 overflow-hidden rounded-sm"
                style={{ backgroundColor: c, minWidth: "2.25rem" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(${c} 0 0),
                      linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.55) 52%, transparent 52%),
                      linear-gradient(transparent 48%, rgba(255,255,255,0.45) 48%, rgba(255,255,255,0.45) 52%, transparent 52%)
                    `,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-0.5 p-0.5">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="bg-white opacity-20 transition-opacity duration-300 group-hover:opacity-30 dark:bg-gray-800"
                    />
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-0 border border-white opacity-20 transition-opacity duration-300 group-hover:opacity-40 dark:border-gray-800" />
              </div>
            ))}
          </div>
        </div>

        {/* 屏风：四扇并列，圆光意象 + 整面细框（与稿一致，深色下用白边透明度） */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#2d333b]/90 p-4">
          <p className="mb-3 text-xs font-medium text-white/85">传统屏风 UI</p>
          <div className="flex h-40 overflow-hidden rounded-lg">
            {[c0, c1, c2, c3].map((c, i) => (
              <div
                key={i}
                className="group relative flex h-full min-h-0 flex-1 border-r border-white/20 transition-transform duration-300 last:border-r-0 hover:z-10 hover:scale-105"
                style={{ backgroundColor: c }}
              >
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-2 border-white opacity-30 transition-opacity duration-300 group-hover:opacity-50" />
                </div>
                <div className="pointer-events-none absolute inset-0 border border-white opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
              </div>
            ))}
          </div>
        </div>

        {/* 卷轴：四段横叠，题签矩形 + 整段细框 */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#2d333b]/90 p-4">
          <p className="mb-3 text-xs font-medium text-white/85">传统卷轴 UI</p>
          <div className="flex h-44 flex-col overflow-hidden rounded-lg">
            {[c0, c1, c2, c3].map((c, i) => (
              <div
                key={i}
                className="group relative flex min-h-0 flex-1 border-b border-white/20 transition-transform duration-300 last:border-b-0 hover:z-10 hover:scale-105"
                style={{ backgroundColor: c }}
              >
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="h-8 w-24 rounded border-2 border-white opacity-30 transition-opacity duration-300 group-hover:opacity-50" />
                </div>
                <div className="pointer-events-none absolute inset-0 border border-white opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
              </div>
            ))}
          </div>
        </div>

        {/* 印章：外框 + 内篆 + 叠边 + 渐变（与稿一致，四色各一印） */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#2d333b]/90 p-4">
          <p className="mb-3 text-xs font-medium text-white/85">传统印章 UI</p>
          <div className="mx-auto grid max-w-[220px] grid-cols-2 gap-4 p-2">
            {[c0, c1, c2, c3].map((c, i) => (
              <div
                key={i}
                className="group flex items-center justify-center transition-transform duration-300 hover:scale-110"
              >
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-lg border-4 border-white"
                  style={{ backgroundColor: c }}
                >
                  <div className="h-12 w-12 rounded border-2 border-white opacity-30 transition-opacity duration-300 group-hover:opacity-50" />
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-white opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
                  <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-white opacity-10 transition-opacity duration-300 group-hover:opacity-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
