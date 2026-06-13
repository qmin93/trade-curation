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
import {
  fetchRecentDartDisclosures,
  dartViewerUrl,
  type DartDisclosure,
} from "./dart-fetcher";
import { applyFilters } from "./news-filters";
import {
  fetchNewsByKeyword as fetchSupabaseByKeyword,
  fetchRecentNews as fetchSupabaseRecent,
  type NewsRow,
} from "./supabase";
import { summarizeBatch } from "./claude-summarize";
import { getOgImagesBatch } from "./og-image";

async function enrichWithSummaryAndImages(
  items: UnifiedNewsItem[],
  enrichLimit = 12,
): Promise<UnifiedNewsItem[]> {
  if (items.length === 0) return items;

  const toEnrich = items.slice(0, enrichLimit);

  // DART 공시는 템플릿 요약이 완성형 + 뷰어가 og:image를 공유 → claude 요약·이미지 중복제거에서 제외.
  const claudeEligible = toEnrich.filter(
    (n) => n.origin !== "mock" && n.origin !== "dart" && n.summary.length > 0,
  );
  const summaryMap = await summarizeBatch(
    claudeEligible.map((n) => ({
      sourceUrl: n.sourceUrl,
      headline: n.headline,
      description: n.summary,
    })),
    3,
  );

  // summaryMap 값이 null이면 off-topic → 목록에서 제외
  const dropUrls = new Set<string>();
  for (const [url, val] of summaryMap) {
    if (val === null) dropUrls.add(url);
  }

  const imageMap = await getOgImagesBatch(
    toEnrich.filter((n) => n.origin !== "dart").map((n) => n.sourceUrl),
    5,
  );

  // 같은 og:image = 사실상 같은/비슷한 뉴스로 보고 뒤 항목을 아예 제외 (중복 느낌 제거).
  // DART 공시는 뷰어가 같은 og:image를 공유하므로 이미지 중복제거 대상에서 제외한다.
  const usedImages = new Set<string>();
  const out: UnifiedNewsItem[] = [];
  for (const n of items) {
    if (n.origin === "dart") {
      out.push(n); // 템플릿 요약·링크 그대로 유지
      continue;
    }
    if (dropUrls.has(n.sourceUrl)) continue;
    const img = imageMap.get(n.sourceUrl) ?? n.imageUrl ?? null;
    if (img && usedImages.has(img)) continue;
    if (img) usedImages.add(img);
    out.push({
      ...n,
      summary: summaryMap.get(n.sourceUrl) ?? n.summary,
      imageUrl: img,
    });
  }
  return out;
}

/**
 * 헤드라인을 정규화한 키. [속보]·(…) 같은 장식과 공백·기호를 제거해
 * 다른 매체가 같은 사건을 보도한 경우(다른 URL)도 같은 키로 묶이게 한다.
 */
/**
 * 자동수집(naver/rss) 헤드라인의 기계 느낌 제거 — 맨 앞 [속보]류 태그, 끝 말줄임표,
 * 매체 꼬리를 보수적으로 정리. 사실은 그대로 두고 장식만 덜어낸다.
 * (큐레이션 mock 제목은 이미 사람이 쓴 톤이라 건드리지 않는다.)
 */
/** &#039; &amp; &quot; 등 HTML 엔티티 디코딩 (네이버·RSS 제목/요약에 섞여 들어옴). */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

export function cleanHeadline(h: string): string {
  return decodeEntities(h)
    .replace(/^\s*\[[^\]]*\]\s*/u, "")
    .replace(/\s*[…]+\s*$/u, "")
    .replace(/\.{2,}\s*$/u, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function titleKey(headline: string): string {
  return headline
    .replace(/\[[^\]]*\]/gu, "")
    .replace(/\([^)]*\)/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase()
    .slice(0, 14);
}

/** URL 완전일치 + 헤드라인 정규화 키, 두 기준으로 중복 제거. */
function dedupeByUrlAndTitle(items: UnifiedNewsItem[]): UnifiedNewsItem[] {
  const seenUrl = new Set<string>();
  const seenTitle = new Set<string>();
  return items.filter((item) => {
    const tk = titleKey(item.headline);
    if (seenUrl.has(item.sourceUrl)) return false;
    if (tk.length >= 6 && seenTitle.has(tk)) return false;
    seenUrl.add(item.sourceUrl);
    if (tk.length >= 6) seenTitle.add(tk);
    return true;
  });
}

export interface UnifiedNewsItem {
  id: string;
  date: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
  origin: "mock" | "naver" | "rss" | "dart";
  imageUrl?: string | null;
  /** 기사 게시 시각 (ISO). naver/rss는 pubDate에서 채움. mock은 보통 날짜만. */
  publishedAt?: string | null;
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
    publishedAt: n.publishedAt ?? null,
  };
}

function supabaseToUnified(r: NewsRow): UnifiedNewsItem {
  // 아카이브는 원래 origin을 보존한다. 과거엔 전부 "mock"으로 묶어
  // 아카이브가 커질수록 mock 가점(200)으로 라이브·DART를 홈/ingest에서 밀어내는 버그가 있었다.
  const o = r.origin;
  const origin: UnifiedNewsItem["origin"] =
    o === "naver" || o === "rss" || o === "dart" ? o : "mock";
  return {
    id: r.id,
    date: r.date,
    headline: r.headline,
    summary: r.summary,
    source: r.source,
    sourceUrl: r.source_url,
    keywords: r.keywords,
    stocks: r.stocks,
    origin,
  };
}

function rssToUnified(r: RssItem, keyword: string): UnifiedNewsItem {
  const pubDate = r.pubDate ? new Date(r.pubDate) : new Date();
  const dateStr = pubDate.toISOString().slice(0, 10);
  return {
    id: `rss-${r.source}-${pubDate.getTime()}`,
    date: dateStr,
    headline: cleanHeadline(r.title),
    summary: decodeEntities(r.description).slice(0, 200),
    source: r.source,
    sourceUrl: r.link,
    keywords: [keyword],
    stocks: [],
    origin: "rss",
    publishedAt: r.pubDate ? pubDate.toISOString() : null,
  };
}

function dartToUnified(d: DartDisclosure): UnifiedNewsItem {
  const dateStr = `${d.rceptDt.slice(0, 4)}-${d.rceptDt.slice(4, 6)}-${d.rceptDt.slice(6, 8)}`;
  return {
    id: `dart-${d.rceptNo}`,
    date: dateStr,
    headline: `${d.corpName} — ${d.reportNm}`,
    summary: `${d.corpName}(${d.stockCode})이 '${d.reportNm}'을(를) 공시했습니다. 기사화 이전 원문 공시라 단타 관점에서 즉시 확인이 필요한 재료입니다.`,
    source: "DART 공시",
    sourceUrl: dartViewerUrl(d.rceptNo),
    keywords: [d.corpName, "공시"],
    stocks: [d.corpName],
    origin: "dart",
    publishedAt: `${dateStr}T09:00:00+09:00`,
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

  const [supabaseRows, naverItems, rssItems] = await Promise.all([
    fetchSupabaseByKeyword(keywordLabel, 20),
    searchNaverNews(keywordLabel, { display: 8, sort: "date" }),
    fetchAllRss(),
  ]);

  const supabaseUnified = supabaseRows.map(supabaseToUnified);
  mockMatches.unshift(...supabaseUnified);

  const naverUnified: UnifiedNewsItem[] = naverItems.map((item) => {
    const normalized = normalizeNaverNews(item, [keywordLabel], []);
    return {
      ...normalized,
      headline: cleanHeadline(normalized.headline),
      origin: "naver" as const,
    };
  });

  const rssMatched = filterByKeyword(rssItems, keywordLabel);
  const rssUnified = rssMatched.map((r) => rssToUnified(r, keywordLabel));

  const all = [...mockMatches, ...naverUnified, ...rssUnified];
  const deduped = dedupeByUrlAndTitle(all);

  const filtered = applyFilters(deduped);
  return enrichWithSummaryAndImages(filtered, 12);
}

export async function getRecentNewsUnified(
  limit = 10,
  keywords?: string[],
  opts?: { includeDart?: boolean },
): Promise<UnifiedNewsItem[]> {
  // DART 공시는 방문자 화면엔 안 맞아 기본 제외. /news 발굴(origin=live)만 켠다.
  const includeDart = opts?.includeDart ?? false;
  // 기본: 핵심 5 + 단타 강화 키워드 (총 15개)
  const { FETCH_KEYWORDS_EXTRA } = await import("./keywords");
  const actualKeywords =
    keywords ?? [
      "하이닉스",
      "삼성전자",
      "코스피",
      "HBM",
      "연금",
      ...FETCH_KEYWORDS_EXTRA,
    ];
  const mockUnified = NEWS_MOCK.map(newsMockToUnified);

  const supabaseRows = await fetchSupabaseRecent(30);
  const supabaseUnified = supabaseRows.map(supabaseToUnified);

  const naverResults = await Promise.all(
    actualKeywords.map((k) =>
      searchNaverNews(k, { display: 5, sort: "date" }).then((items) =>
        items.map((item) => {
          const normalized = normalizeNaverNews(item, [k], []);
          return {
            ...normalized,
            headline: cleanHeadline(normalized.headline),
            origin: "naver" as const,
          };
        }),
      ),
    ),
  );
  const naverUnified = naverResults.flat();

  const rssItems = await fetchAllRss();
  const rssUnified: UnifiedNewsItem[] = [];
  for (const item of rssItems) {
    const matchedKw = actualKeywords.find((k) =>
      `${item.title} ${item.description}`.toLowerCase().includes(k.toLowerCase()),
    );
    if (matchedKw) rssUnified.push(rssToUnified(item, matchedKw));
  }

  // DART 실시간 공시 — 발굴(/news)용. 방문자 화면엔 기본 미포함.
  const dartUnified = includeDart
    ? (await fetchRecentDartDisclosures()).map(dartToUnified)
    : [];

  const all = [
    ...supabaseUnified,
    ...mockUnified,
    ...naverUnified,
    ...rssUnified,
    ...dartUnified,
  ];
  let deduped = dedupeByUrlAndTitle(all);
  // 안전망: 아카이브에 과거 DART가 남아 있어도 방문자 화면엔 안 나오게.
  if (!includeDart) deduped = deduped.filter((n) => n.origin !== "dart");

  const filtered = applyFilters(deduped).slice(0, limit);
  return enrichWithSummaryAndImages(filtered, limit);
}
