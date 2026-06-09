import { KEYWORDS } from "@/lib/keywords";
import { getRecentNews } from "@/lib/news-mock";
import { getTopMovers } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";
import { getRecentResults, MONTHLY_STATS } from "@/lib/results";
import { HeroSection } from "@/components/HeroSection";
import { KeywordGrid } from "@/components/KeywordGrid";
import { EventTimeline } from "@/components/EventTimeline";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StockCard } from "@/components/StockCard";
import { ResultCard } from "@/components/ResultCard";
import { PerformanceStats } from "@/components/PerformanceStats";
import Link from "next/link";

export default function Home() {
  const recentNews = getRecentNews(8);
  const movers = getTopMovers(8);
  const results = getRecentResults(3);
  return (
    <>
      <HeroSection />

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-16">
        <section>
          <SectionHeader
            label="01 · Performance"
            title={`${MONTHLY_STATS.month} 누적 성과`}
            href="/results"
            hrefLabel="결과 전체"
          />
          <PerformanceStats stats={MONTHLY_STATS} />
          {results.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {results.map((r) => (
                <ResultCard key={r.date} result={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            label="02 · Top Movers"
            title="오늘의 시초 변동률 TOP"
            href="/keyword/kospi"
            hrefLabel="시장 전체"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {movers.map((s) => (
              <StockCard key={s.ticker} stock={s} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            label="03 · Hot Keywords"
            title="오늘의 핫 키워드"
            href="/keyword/hynix"
            hrefLabel="전체"
          />
          <KeywordGrid keywords={KEYWORDS} />
        </section>

        <section className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <SectionHeader label="04 · News Feed" title="최신 뉴스" />
            <div className="grid sm:grid-cols-2 gap-4">
              {recentNews.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>
          <aside>
            <SectionHeader
              label="05 · Calendar"
              title="6월 트래픽 이벤트"
            />
            <EventTimeline />
          </aside>
        </section>

        <section>
          <SectionHeader
            label="06 · Themes"
            title="단타 테마 라인업"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <Link
                key={t.slug}
                href={`/theme/${t.slug}`}
                className="group rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)]/50 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(62,106,225,0.15)]"
              >
                <div className="mono text-[9px] uppercase tracking-widest text-[var(--accent)] mb-2">
                  Tier {t.tier}
                </div>
                <div className="font-semibold text-[var(--text)] group-hover:text-white transition-colors mb-1">
                  {t.label}
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
