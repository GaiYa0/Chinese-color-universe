import Link from "next/link";

export default function SchemeNotFound() {
  return (
    <main className="toolkit-hero-bg flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16">
      <h1 className="text-xl font-semibold text-white">未找到该配色方案</h1>
      <p className="mt-2 text-sm text-white/50">请从列表中重新选择。</p>
      <Link
        href="/tools/schemes"
        className="mt-6 rounded-xl border border-[#26A69A]/40 bg-[#26A69A]/15 px-5 py-2.5 text-sm text-[#B2DFDB] transition hover:bg-[#26A69A]/25"
      >
        返回传统配色方案列表
      </Link>
    </main>
  );
}
