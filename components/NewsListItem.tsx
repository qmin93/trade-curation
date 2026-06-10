import type { UnifiedNewsItem } from "@/lib/news-fetcher";

const sourceTint: Record<string, string> = {
  ddaily: "text-purple-400",
  fnnews: "text-rose-400",
  newspim: "text-amber-400",
  etoday: "text-cyan-400",
  heraldcorp: "text-emerald-400",
  worktoday: "text-pink-400",
  yna: "text-violet-400",
  etnews: "text-blue-400",
  mtn: "text-yellow-400",
  hankyung: "text-sky-400",
  default: "text-[var(--accent)]",
};

function tintForSource(source: string): string {
  const key = source.toLowerCase().replace(/\..*$/, "");
  return sourceTint[key] ?? sourceTint.default;
}

export function NewsListItem({ news }: { news: UnifiedNewsItem }) {
  return (
    <a
      href={news.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-elevated)] -mx-3 px-3 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2 mb-1.5 text-[10px] mono uppercase tracking-widest">
        <span className={tintForSource(news.source)}>{news.source}</span>
        <span className="text-[var(--text-caption)]">·</span>
        <span className="text-[var(--text-caption)] tabular-nums">
          {news.date.slice(5)}
        </span>
        {news.keywords[0] && (
          <>
            <span className="text-[var(--text-caption)]">·</span>
            <span className="text-[var(--text-muted)]">#{news.keywords[0]}</span>
          </>
        )}
      </div>
      <h3 className="text-base md:text-lg font-semibold text-[var(--text)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
        {news.headline}
      </h3>
      {news.summary && (
        <p className="text-sm text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
          {news.summary}
        </p>
      )}
    </a>
  );
}
