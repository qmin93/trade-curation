/**
 * 테마별 주도주 — 멘토(reload.kospi)의 "🔥 오늘의 테마" 카드 데이터.
 * THEME_GROUPS(테마→종목) + 네이버 라이브 등락률 결합.
 */
import { THEME_GROUPS } from "./theme-stocks";
import { fetchQuotes, type LiveQuote } from "./market-quotes";

export interface ThemeMover {
  slug: string;
  label: string;
  emoji?: string;
  avgChange: number; // 주도주 평균 등락률
  leaders: LiveQuote[]; // 등락률 상위 종목
}

/** 테마별로 라이브 등락률을 붙여 주도주 순으로 정렬. 강한 테마 먼저. */
export async function fetchThemeMovers(leadersPerTheme = 4): Promise<ThemeMover[]> {
  const allTickers = [...new Set(THEME_GROUPS.flatMap((g) => g.tickers))];
  const quotes = await fetchQuotes(allTickers);

  const movers: ThemeMover[] = [];
  for (const g of THEME_GROUPS) {
    const live = g.tickers
      .map((tk) => quotes.get(tk))
      .filter((q): q is LiveQuote => Boolean(q))
      .sort((a, b) => b.changePercent - a.changePercent);
    if (live.length === 0) continue;
    const leaders = live.slice(0, leadersPerTheme);
    const avgChange =
      leaders.reduce((s, q) => s + q.changePercent, 0) / leaders.length;
    movers.push({
      slug: g.slug,
      label: g.label,
      emoji: g.emoji,
      avgChange,
      leaders,
    });
  }

  return movers.sort((a, b) => b.avgChange - a.avgChange);
}
