import { fetchColors } from "@/services/data/data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function ColorDetailPage({ params }: Props) {
  const { name } = await params;
  const colors = await fetchColors();
  const color = colors.find((c) => c.name === decodeURIComponent(name));

  if (!color) notFound();

  return (
    <main className="cosmic-bg min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white/60 transition hover:text-white"
        >
          ← 返回宇宙
        </Link>
        <div className="glass-card rounded-2xl p-8">
          <div
            className="mb-6 h-32 rounded-xl"
            style={{ backgroundColor: color.hex }}
          />
          <h1 className="text-3xl font-bold text-white">{color.name}</h1>
          <p className="mt-2 text-lg text-white/80">{color.hex}</p>
          {color.meaning && (
            <p className="mt-4 text-white/70">{color.meaning}</p>
          )}
          {color.relic && (
            <p className="mt-2 text-white/60">
              <span className="text-white/50">代表文物：</span>
              {color.relic}
            </p>
          )}
          {color.poem && (
            <blockquote className="mt-4 border-l-2 border-white/20 pl-4 text-white/70 italic">
              「{color.poem}」— {color.poet}
            </blockquote>
          )}
          {color.dynasty && (
            <p className="mt-2 text-white/60">
              <span className="text-white/50">朝代：</span>
              {color.dynasty}
            </p>
          )}
          {color.location && (
            <p className="mt-1 text-white/60">
              <span className="text-white/50">产地：</span>
              {color.location}
            </p>
          )}
          {color.story && (
            <p className="mt-6 text-white/70 leading-relaxed">{color.story}</p>
          )}
        </div>
      </div>
    </main>
  );
}
