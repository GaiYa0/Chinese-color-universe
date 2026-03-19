"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "宇宙首页" },
  { href: "/galaxy", label: "颜色星空" },
  { href: "/knowledge", label: "知识图谱" },
  { href: "/map", label: "中国色地图" },
  { href: "/timeline", label: "时间轴" },
  { href: "/today", label: "今日中国色" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-wider text-white/90 transition hover:text-white"
        >
          中国色宇宙
        </Link>
        <div className="flex gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`relative block px-4 py-2 text-sm transition ${
                    isActive
                      ? "rounded-full bg-white/15 text-white"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
