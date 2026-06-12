/**
 * 시간대별 뉴스 정렬 — 장중엔 급등·수급 뉴스 먼저, 장전·마감엔 미국·매크로 먼저.
 * 안정 정렬(부스트 동률이면 기존 최신순 유지).
 */
import type { UnifiedNewsItem } from "./news-fetcher";
import type { MarketPhase } from "./market-status";

const OPEN_BOOST = /상한가|급등|신고가|특징주|거래량|수급|장중|매수세|급반등|테마/;
const PRE_BOOST = /나스닥|S&P|다우|미국 증시|FOMC|기준금리|\bCPI\b|환율|연준|파월|선물|필라델피아|\bSOX\b|매크로/;

export function rankNewsByPhase(
  items: UnifiedNewsItem[],
  phase: MarketPhase,
): UnifiedNewsItem[] {
  const re = phase === "open" ? OPEN_BOOST : PRE_BOOST;
  return items
    .map((n, i) => {
      const text = `${n.headline} ${n.summary} ${n.keywords.join(" ")}`;
      return { n, boost: re.test(text) ? 1 : 0, i };
    })
    .sort((a, b) => b.boost - a.boost || a.i - b.i)
    .map((x) => x.n);
}
