/**
 * 네이버 검색 API 클라이언트 — 뉴스 검색
 *
 * 발급:
 * 1. https://developers.naver.com/main/ 가입·로그인
 * 2. "Application 등록" → 뉴스 검색 API 선택
 * 3. Client ID / Secret을 .env.local에 저장
 *
 * 무료 한도: 일 25,000회.
 */

const NAVER_NEWS_API = "https://openapi.naver.com/v1/search/news.json";

export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

export interface SearchOptions {
  display?: number;
  start?: number;
  sort?: "sim" | "date";
}

export async function searchNaverNews(
  query: string,
  options: SearchOptions = {},
): Promise<NaverNewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn(
      "[naver-search] NAVER_CLIENT_ID·SECRET 환경변수 미설정 — mock 모드.",
    );
    return [];
  }

  const params = new URLSearchParams({
    query,
    display: String(options.display ?? 10),
    start: String(options.start ?? 1),
    sort: options.sort ?? "date",
  });

  try {
    const res = await fetch(`${NAVER_NEWS_API}?${params.toString()}`, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      console.error("[naver-search] HTTP", res.status, await res.text());
      return [];
    }
    const data: NaverNewsResponse = await res.json();
    return data.items ?? [];
  } catch (err) {
    console.error("[naver-search] fetch failed", err);
    return [];
  }
}

/**
 * 네이버 검색 결과 → 사이트 내부 NewsItem 형식으로 정규화.
 */
export function normalizeNaverNews(
  item: NaverNewsItem,
  keywords: string[],
  stocks: string[] = [],
): {
  id: string;
  date: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
} {
  const cleanTitle = item.title
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");

  const cleanDesc = item.description
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");

  const pubDate = new Date(item.pubDate);
  const dateStr = pubDate.toISOString().slice(0, 10);
  const url = new URL(item.originallink || item.link);

  return {
    id: `naver-${dateStr}-${url.hostname}-${pubDate.getTime()}`,
    date: dateStr,
    headline: cleanTitle,
    summary: cleanDesc,
    source: url.hostname.replace(/^www\./, ""),
    sourceUrl: item.originallink || item.link,
    keywords,
    stocks,
  };
}
