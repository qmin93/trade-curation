import { KEYWORDS } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { THEMES } from "@/lib/themes";
import { TOP_VOLUME, TOP_GAINERS } from "@/lib/market-snapshot";
import { getDailyQuote } from "@/lib/quotes";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { InvestorFlowCard } from "@/components/dashboard/InvestorFlow";
import { SectorHeatmap } from "@/components/dashboard/SectorHeatmap";
import { RankingList } from "@/components/dashboard/RankingList";
import { HighLowCard } from "@/components/dashboard/HighLowCard";
import { PremarketCard } from "@/components/dashboard/PremarketCard";
import { CompactNewsList } from "@/components/dashboard/CompactNewsList";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { PerformanceStrip } from "@/components/dashboard/PerformanceStrip";
import { KeywordChip } from "@/components/KeywordChip";
import Link from "next/link";

export const revalidate = 1800;

export default async function Home() {
  const recentNews = await getRecentNewsUnified(10);
  const quote = getDailyQuote();
  return (
    <div className="max-w-[1600px] mx-auto px-3 py-3 space-y-3">
      {/* Headline strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-1">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">
            근거 분명한 자리만.
          </h1>
          <p className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mt-0.5">
            "{quote.text}" — {quote.attribution}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KEYWORDS.map((k) => (
            <KeywordChip key={k.slug} keyword={k} />
          ))}
        </div>
      </div>

      {/* Performance strip */}
      <PerformanceStrip />

      {/* Row 1 — Market overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <IndexBoard />
        <InvestorFlowCard />
        <PremarketCard />
        <HighLowCard />
      </div>

      {/* Row 2 — Rankings + Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <RankingList title="Top Gainers" items={TOP_GAINERS} />
        <RankingList
          title="Top Volume"
          items={TOP_VOLUME.slice(0, 6)}
          showVolume
        />
        <SectorHeatmap />
      </div>

      {/* Row 3 — Live streams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <CompactAlerts limit={6} />
        <CompactNewsList items={recentNews} />
        <CompactCalendar />
      </div>

      {/* Themes strip */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
          <span>Themes</span>
          <Link href="/keyword/hynix" className="hover:text-[var(--accent)]">
            Keywords ↗
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {THEMES.map((t) => (
            <Link
              key={t.slug}
              href={`/theme/${t.slug}`}
              className="rounded px-2 py-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-[var(--accent)]/50 text-[11px] font-semibold text-[var(--text)] text-center transition-colors truncate"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
