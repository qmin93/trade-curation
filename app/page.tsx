import { KEYWORDS } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { LiveTrendingBand } from "@/components/LiveTrendingBand";
import { LiveGainersBand } from "@/components/LiveGainersBand";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { HeroNews } from "@/components/HeroNews";
import { NewsFeed } from "@/components/NewsFeed";
import { KeywordChip } from "@/components/KeywordChip";
import { TelegramCTA } from "@/components/TelegramCTA";
import { PickPopup } from "@/components/PickPopup";
import { ConsolePopup } from "@/components/ConsolePopup";
import { HeroFunnel } from "@/components/HeroFunnel";
import { LatestResultCard } from "@/components/LatestResultCard";
import { MarketNowBand } from "@/components/MarketNowBand";
import { getMarketStatus } from "@/lib/market-status";
import { rankNewsByPhase } from "@/lib/news-rank";

// 비용 최적화: 10분마다 재생성(뉴스 신선도 충분 + claude 요약 호출 빈도 ↓)
export const revalidate = 600;

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
      {/* 진입 광고 팝업 — 검증 성과 + 오늘 픽 + 텔레그램 (인라인 픽/성과 섹션 대체) */}
      <PickPopup />

      {/* 운영자 전용 — 콘솔 팝업(픽+포맷). 방문자에겐 버튼 안 보임 */}
      <ConsolePopup />

      {/* 실시간 급등·인기검색 밴드 (공개) */}
      <LiveTrendingBand />

      {/* 단타 신호 — 급등주(거래대금 큰 순) (공개) */}
      <LiveGainersBand />

      {/* 오늘 마감 리포트 — 검증(끝난 결과) 프루프, 홈에서 바로 */}
      <LatestResultCard />

      {/* 지금 장 상태 + 시간대 맞춤 데이터 (밤=장전, 장중=테마 주도주) */}
      <MarketNowBand />

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
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-10">
        {/* 뉴스 피드 — 키워드 필터 + 무한스크롤 */}
        <NewsFeed items={ranked} />

        {/* Sidebar */}
        <aside className="space-y-3 min-w-0 lg:sticky lg:top-24 lg:self-start">
          <HeroFunnel variant="side" />
          <IndexBoard />
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
