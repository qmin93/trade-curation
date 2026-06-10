/**
 * 통합 뉴스 fetcher — mock + 네이버 검색 + 매체 RSS 결합.
 *
 * 우선순위:
 * 1. NEWS_MOCK (텔방 corpus 본문 요약·페르소나 코멘트 포함)
 * 2. 네이버 검색 API (환경변수 있을 시)
 * 3. 매체 RSS (백업)
 */

import { NEWS_MOCK, type NewsItem } from "./news-mock";
import { searchNaverNews, normalizeNaverNews } from "./naver-search";
import {
  fetchAllRss,
  filterByKeyword,
  type RssItem,
} from "./rss-fetcher";

export interface UnifiedNewsItem {
  id: string;
  date: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
  origin: "mock" | "naver" | "rss";
}

function newsMockToUnified(n: NewsItem): UnifiedNewsItem {
  return {
    id: n.id,
    date: n.date,
    headline: n.headline,
    summary: n.summary,
    source: n.source,
    sourceUrl: n.sourceUrl,
    keywords: n.keywords,
    stocks: n.stocks,
    origin: "mock",
  };
}

function rssToUnified(r: RssItem, keyword: string): UnifiedNewsItem {
  const pubDate = r.pubDate ? new Date(r.pubDate) : new Date();
  const dateStr = pubDate.toISOString().slice(0, 10);
  return {
    id: `rss-${r.source}-${pubDate.getTime()}`,
    date: dateStr,
    headline: r.title,
    summary: r.description.slice(0, 200),
    source: r.source,
    sourceUrl: r.link,
    keywords: [keyword],
    stocks: [],
    origin: "rss",
  };
}

export async function getNewsByKeywordUnified(
  keywordLabel: string,
): Promise<UnifiedNewsItem[]> {
  const mockMatches = NEWS_MOCK.filter((n) =>
    n.keywords.some(
      (k) => k.toLowerCase() === keywordLabel.toLowerCase() || k.includes(keywordLabel),
    ),
  ).map(newsMockToUnified);

  const [naverItems, rssItems] = await Promise.all([
    searchNaverNews(keywordLabel, { display: 8, sort: "date" }),
    fetchAllRss(),
  ]);

  const naverUnified: UnifiedNewsItem[] = naverItems.map((item) => {
    const normalized = normalizeNaverNews(item, [keywordLabel], []);
    return { ...normalized, origin: "naver" as const };
  });

  const rssMatched = filterByKeyword(rssItems, keywordLabel);
  const rssUnified = rssMatched.map((r) => rssToUnified(r, keywordLabel));

  const all = [...mockMatches, ...naverUnified, ...rssUnified];
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.sourceUrl;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getRecentNewsUnified(
  limit = 10,
  keywords: string[] = ["하이닉스", "삼성전자", "코스피", "HBM", "연금"],
): Promise<UnifiedNewsItem[]> {
  const mockUnified = NEWS_MOCK.map(newsMockToUnified);

  const naverResults = await Promise.all(
    keywords.map((k) =>
      searchNaverNews(k, { display: 5, sort: "date" }).then((items) =>
        items.map((item) => {
          const normalized = normalizeNaverNews(item, [k], []);
          return { ...normalized, origin: "naver" as const };
        }),
      ),
    ),
  );
  const naverUnified = naverResults.flat();

  const rssItems = await fetchAllRss();
  const rssUnified: UnifiedNewsItem[] = [];
  for (const item of rssItems) {
    const matchedKw = keywords.find((k) =>
      `${item.title} ${item.description}`.toLowerCase().includes(k.toLowerCase()),
    );
    if (matchedKw) rssUnified.push(rssToUnified(item, matchedKw));
  }

  const all = [...mockUnified, ...naverUnified, ...rssUnified];
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.sourceUrl;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
