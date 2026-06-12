/**
 * 테마별 주도주 — 멘토(reload.kospi)의 "🔥 오늘의 테마" 카드 데이터.
 * 정적 테마→종목 매핑(STOCKS.themes)에 네이버 라이브 등락률을 결합.
 */
import { THEMES } from "./themes";
import { STOCKS } from "./stocks";
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
  // 테마에 종목이 매핑된 것만
  const themeTickers = new Map<string, string[]>();
  for (const t of THEMES) {
    const members = STOCKS.filter((s) => s.themes.includes(t.slug)).map(
      (s) => s.ticker,
    );
    if (members.length > 0) themeTickers.set(t.slug, members);
  }

  const allTickers = [...new Set([...themeTickers.values()].flat())];
  const quotes = await fetchQuotes(allTickers);

  const movers: ThemeMover[] = [];
  for (const t of THEMES) {
    const members = themeTickers.get(t.slug);
    if (!members) continue;
    const live = members
      .map((tk) => quotes.get(tk))
      .filter((q): q is LiveQuote => Boolean(q))
      .sort((a, b) => b.changePercent - a.changePercent);
    if (live.length === 0) continue;
    const leaders = live.slice(0, leadersPerTheme);
    const avgChange =
      leaders.reduce((s, q) => s + q.changePercent, 0) / leaders.length;
    movers.push({
      slug: t.slug,
      label: t.label,
      emoji: t.emoji,
      avgChange,
      leaders,
    });
  }

  // 강한 테마(평균 등락률 높은 순) 먼저
  return movers.sort((a, b) => b.avgChange - a.avgChange);
}
