"use client";

interface GraphToolbarProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onGenerate: () => void;
}

export default function GraphToolbar({
  inputValue,
  setInputValue,
  onGenerate,
}: GraphToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="输入颜色名称，如：天青"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
      />
      <button
        onClick={onGenerate}
        className="rounded-xl bg-emerald-500/80 px-6 py-3 font-medium text-white transition hover:bg-emerald-500"
      >
        生成探索路径
      </button>
    </div>
  );
}
