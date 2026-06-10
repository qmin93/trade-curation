import Link from "next/link";
import { getDailyQuote } from "@/lib/quotes";

export function HeroSection() {
  const quote = getDailyQuote();
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--hero-glow-blue), transparent 60%), radial-gradient(circle at 80% 30%, var(--hero-glow-red), transparent 50%)`,
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-4 py-20 md:py-28">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)]">
            Live · Keyword Curation Terminal
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-3xl">
          근거 분명한
          <br />
          <span className="gradient-text">자리만.</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed mb-10">
          단타 트레이더가 직접 큐레이션하는 키워드 뉴스·실시간 호재·백테스트.
          시초가 직전 한 화면에.
        </p>

        <div className="max-w-2xl border-l-2 border-[var(--accent)] pl-5 py-1 mb-10">
          <p className="text-base md:text-lg text-[var(--text)] leading-snug italic">
            “{quote.text}”
          </p>
          <p className="mono text-xs text-[var(--text-caption)] mt-2">
            — {quote.attribution}
            {quote.context && ` · ${quote.context}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/alerts"
            className="px-5 py-2.5 rounded-md bg-[var(--accent)] hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            실시간 호재 보기 →
          </Link>
          <Link
            href="/philosophy"
            className="px-5 py-2.5 rounded-md border border-[var(--border)] text-[var(--text)] text-sm font-semibold hover:border-[var(--accent)] transition-colors"
          >
            운영 철학
          </Link>
        </div>
      </div>
    </section>
  );
}
