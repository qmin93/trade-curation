import { KEYWORDS, FETCH_KEYWORDS_EXTRA } from "@/lib/keywords";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { fetchTopGainers } from "@/lib/naver-trending";
import { IndexBoard } from "@/components/dashboard/IndexBoard";
import { CompactAlerts } from "@/components/dashboard/CompactAlerts";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
import { HeroNews } from "@/components/HeroNews";
import { NewsFeed } from "@/components/NewsFeed";
import { NewsListItem } from "@/components/NewsListItem";
import { TelegramCTA } from "@/components/TelegramCTA";
import { PickPopup } from "@/components/PickPopup";
import { ConsolePopup } from "@/components/ConsolePopup";
import { HeroFunnel } from "@/components/HeroFunnel";
import { LatestResultCard } from "@/components/LatestResultCard";
import { MarketNowBand } from "@/components/MarketNowBand";
import { LeverageEtfCard } from "@/components/LeverageEtfCard";
import { getMarketStatus } from "@/lib/market-status";
import { rankNewsByPhase } from "@/lib/news-rank";

// 비용 최적화: 10분마다 재생성(뉴스 신선도 충분 + claude 요약 호출 빈도 ↓)
export const revalidate = 600;

export default async function Home() {
  // 오늘 급등 TOP 종목 + Tier1 키워드 뉴스를 홈 메인에 바로 노출 (이미지 포함).
  const gainers = await fetchTopGainers(12);
  const feedKeywords = [
    ...gainers.map((g) => g.name),
    ...KEYWORDS.filter((k) => k.tier === 1).map((k) => k.label),
    "연기금 매수",
    ...FETCH_KEYWORDS_EXTRA,
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 18); // 네이버 API rate limit(429) 방지 — 급등 종목 우선, 상위 18개만 라이브 fetch
  const news = await getRecentNewsUnified(40, feedKeywords);
  // 최신순 정렬(게시시각 우선, 없으면 날짜) → 히어로가 항상 최신 반영.
  const sorted = [...news].sort((a, b) => {
    const ta = new Date(a.publishedAt ?? `${a.date}T00:00:00+09:00`).getTime();
    const tb = new Date(b.publishedAt ?? `${b.date}T00:00:00+09:00`).getTime();
    return tb - ta;
  });
  const [hero, ...rest] = sorted;
  // 🔥 오늘 급등 종목 뉴스 — 거래대금 상위 급등주 기사만 따로 (히어로 아래 이미지 섹션).
  const gainerNames = gainers.map((g) => g.name);
  const isGainerNews = (n: (typeof rest)[number]) =>
    gainerNames.some(
      (gn) =>
        n.stocks?.some((s) => s.includes(gn) || gn.includes(s)) ||
        n.headline?.includes(gn) ||
        n.keywords?.some((k) => k.includes(gn)),
    );
  const gainersNews = rest.filter(isGainerNews).slice(0, 12);
  const gainerIds = new Set(gainersNews.map((n) => n.id));
  // 시간대별 정렬: 장중=급등·수급 먼저, 장전·마감=미국·매크로 먼저.
  const status = getMarketStatus(new Date());
  const ranked = rankNewsByPhase(
    rest.filter((n) => !gainerIds.has(n.id)),
    status.phase,
  );
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* 진입 광고 팝업 — 검증 성과 + 오늘 픽 + 텔레그램 (인라인 픽/성과 섹션 대체) */}
      <PickPopup />

      {/* 운영자 전용 — 콘솔 팝업(픽+포맷). 방문자에겐 버튼 안 보임 */}
      <ConsolePopup />

      {/* 오늘 마감 리포트 — 검증(끝난 결과) 프루프, 홈에서 바로 */}
      <LatestResultCard />

      {/* 지금 장 상태 + 시간대 맞춤 데이터 (밤=장전, 장중=테마 주도주) */}
      <MarketNowBand />

      {/* 삼전닉스 레버리지 ETF 예상 시초가 — 장중 외(밤·장전·마감)에만 메인 노출 */}
      {!status.isLive && <LeverageEtfCard />}

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
      </div>

      {/* Hero news */}
      {hero && <HeroNews news={hero} />}

      {/* 🔥 오늘 급등 종목 뉴스 — 거래대금 상위 급등주, 왜 올랐나 (이미지) */}
      {gainersNews.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
              🔥 오늘 급등 종목 뉴스
            </h2>
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
              거래대금 상위 · 왜 올랐나
            </span>
          </div>
          <div className="space-y-3">
            {gainersNews.map((n) => (
              <NewsListItem key={n.id} news={n} />
            ))}
          </div>
        </section>
      )}

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
