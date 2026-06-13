import { KEYWORDS } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { TrendingStocks } from "@/components/dashboard/TrendingStocks";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { HeroNews } from "@/components/HeroNews";
import { NewsFeed } from "@/components/NewsFeed";
import { KeywordChip } from "@/components/KeywordChip";
import { TelegramCTA } from "@/components/TelegramCTA";
import { PickSpotlight } from "@/components/PickSpotlight";
import { MarketNowBand } from "@/components/MarketNowBand";
import { MONTHLY_STATS } from "@/lib/results";
import { getMarketStatus } from "@/lib/market-status";
import { rankNewsByPhase } from "@/lib/news-rank";

export const revalidate = 120;

export default async function Home() {
  const news = await getRecentNewsUnified(40);
  // 최신순 정렬(게시시각 우선, 없으면 날짜) → 히어로가 항상 최신 반영.
  const sorted = [...news].sort((a, b) => {
    const ta = new Date(a.publishedAt ?? `${a.date}T00:00:00+09:00`).getTime();
    const tb = new Date(b.publishedAt ?? `${b.date}T00:00:00+09:00`).getTime();
    return tb - ta;
  });
  const [hero, ...rest] = sorted;
  // 시간대별 정렬: 장중=급등·수급 먼저, 장전·마감=미국·매크로 먼저.
  const status = getMarketStatus(new Date());
  const ranked = rankNewsByPhase(rest, status.phase);
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* 지금 장 상태 + 시간대 맞춤 데이터 (밤=장전, 장중=테마 주도주) */}
      <MarketNowBand />

      {/* 오늘의 픽 스포트라이트 */}
      <PickSpotlight />

      {/* 검증된 성과 배지 → 성과 페이지 */}
      <a
        href="/results"
        className="group mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] px-5 py-3 text-sm"
      >
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
          검증된 성과
        </span>
        <span className="font-bold text-[var(--text)]">
          {MONTHLY_STATS.month} 승률{" "}
          <span className="text-[var(--red)]">{MONTHLY_STATS.winRate}%</span>
        </span>
        <span className="text-[var(--text-muted)]">
          누적{" "}
          <span className="font-semibold text-[var(--red)]">
            +{MONTHLY_STATS.cumulativeReturn}%
          </span>
        </span>
        <span className="text-[var(--text-caption)]">
          적중 {MONTHLY_STATS.hitCount}·손절 {MONTHLY_STATS.missCount} 전부 공개
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-[var(--accent)]">
          전체 기록
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </span>
      </a>

      {/* Headline strip */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {status.isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          )}
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)]">
            {status.badge} · {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KEYWORDS.map((k) => (
            <KeywordChip key={k.slug} keyword={k} />
          ))}
        </div>
      </div>

      {/* Hero news */}
      {hero && <HeroNews news={hero} />}

      {/* 2-column body */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 mt-10">
        {/* 뉴스 피드 — 키워드 필터 + 무한스크롤 */}
        <NewsFeed items={ranked} />

        {/* Sidebar */}
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <TelegramCTA />
          <IndexBoard />
          <TrendingStocks limit={8} />
          <CompactAlerts limit={5} />
          <CompactCalendar />
        </aside>
      </div>

      {/* 리드 퍼널 CTA — 무료 텔레그램 알림으로 유도 */}
      <div className="mt-12">
        <TelegramCTA variant="banner" />
      </div>
    </div>
  );
}
