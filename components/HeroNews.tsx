import type { UnifiedNewsItem } from "@/lib/news-fetcher";

const sourceGradient: Record<string, string> = {
  ddaily: "from-purple-900 via-indigo-900 to-slate-900",
  fnnews: "from-rose-900 via-red-900 to-slate-900",
  newspim: "from-amber-900 via-orange-900 to-slate-900",
  etoday: "from-blue-900 via-cyan-900 to-slate-900",
  heraldcorp: "from-emerald-900 via-teal-900 to-slate-900",
  worktoday: "from-pink-900 via-rose-900 to-slate-900",
  yna: "from-violet-900 via-purple-900 to-slate-900",
  etnews: "from-blue-900 via-indigo-900 to-slate-900",
  mtn: "from-amber-900 via-yellow-900 to-slate-900",
  hankyung: "from-sky-900 via-blue-900 to-slate-900",
  default: "from-slate-800 via-slate-900 to-slate-950",
};

function gradientForSource(source: string): string {
  const key = source.toLowerCase().replace(/\..*$/, "");
  return sourceGradient[key] ?? sourceGradient.default;
}

export function HeroNews({ news }: { news: UnifiedNewsItem }) {
  const grad = gradientForSource(news.source);
  return (
    <a
      href={news.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-2xl border border-[var(--border)] aspect-[16/9] md:aspect-[21/9]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 50%)",
        }}
      />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/70">
            Featured
          </span>
          <span className="text-white/30">·</span>
          <span className="mono text-[10px] uppercase tracking-widest text-white/70">
            {news.source}
          </span>
          <span className="text-white/30">·</span>
          <span className="mono text-[10px] text-white/60 tabular-nums">
            {news.date}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4 max-w-3xl line-clamp-3 group-hover:text-white transition-colors">
          {news.headline}
        </h2>
        <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl line-clamp-2 mb-5">
          {news.summary}
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-white font-semibold">
            Read article
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
          {news.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              className="ml-2 text-[10px] mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20"
            >
              #{k}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
