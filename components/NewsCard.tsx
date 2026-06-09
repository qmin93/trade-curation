import type { NewsItem } from "@/lib/news-mock";

export function NewsCard({ news }: { news: NewsItem }) {
  return (
    <article className="group relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5 transition-all duration-200 hover:border-[var(--accent)]/50 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(62,106,225,0.18)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="mono text-[11px] text-[var(--text-caption)]">
          {news.date}
        </span>
        <span className="text-[var(--border-strong)]">·</span>
        <a
          href={news.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-[11px] text-[var(--accent)]/70 hover:text-[var(--accent)] transition-colors"
        >
          {news.source} ↗
        </a>
      </div>
      <h2 className="font-bold text-base md:text-lg leading-snug mb-2 text-[var(--text)] group-hover:text-white transition-colors">
        {news.headline}
      </h2>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
        {news.summary}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {news.keywords.map((k) => (
          <span
            key={k}
            className="text-[10px] px-2 py-0.5 rounded mono uppercase tracking-wider bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
          >
            {k}
          </span>
        ))}
      </div>
    </article>
  );
}
