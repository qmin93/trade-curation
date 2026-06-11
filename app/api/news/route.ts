import { NextResponse } from "next/server";
import {
  getRecentNewsUnified,
  getNewsByKeywordUnified,
} from "@/lib/news-fetcher";

/**
 * 읽기 전용 뉴스 피드 JSON.
 *
 * 사이트가 모은 통합 뉴스(큐레이션 mock + 네이버 검색 + RSS)를 그대로 내준다.
 * `/news` 슬래시 커맨드가 발굴 소스로 사용:
 *  - origin 으로 라이브 항목(naver/rss)과 큐레이션(mock)을 구분 → mock 재수집(순환) 방지
 *  - 네이버 링크가 막혀도 originallink(원본 매체)·스니펫을 받아 우회 발굴
 *
 * 예) GET /api/news?limit=30
 *     GET /api/news?keyword=하이닉스
 *     GET /api/news?origin=live      (naver+rss 만)
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 30, 1), 100);
  const keyword = searchParams.get("keyword");
  const originFilter = searchParams.get("origin"); // "live" | "mock" | null

  try {
    const raw = keyword
      ? await getNewsByKeywordUnified(keyword)
      : await getRecentNewsUnified(limit);

    let items = raw;
    if (originFilter === "live") {
      items = raw.filter((n) => n.origin === "naver" || n.origin === "rss");
    } else if (originFilter === "mock") {
      items = raw.filter((n) => n.origin === "mock");
    }

    return NextResponse.json({
      count: items.length,
      generatedAt: new Date().toISOString(),
      items: items.map((n) => ({
        id: n.id,
        date: n.date,
        publishedAt: n.publishedAt ?? null,
        headline: n.headline,
        summary: n.summary,
        source: n.source,
        sourceUrl: n.sourceUrl, // 원본 매체 링크(originallink) — 네이버 우회용
        origin: n.origin, // "mock" | "naver" | "rss"
        keywords: n.keywords,
        stocks: n.stocks,
        imageUrl: n.imageUrl ?? null,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
