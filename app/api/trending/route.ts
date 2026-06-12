import { NextResponse } from "next/server";
import { fetchTrendingStocks } from "@/lib/naver-trending";

/**
 * 실시간 인기 검색 종목 JSON — 콘텐츠 루프(/news) 발굴용 트래픽 신호.
 * "지금 검색 상위 종목" = 오늘 글·픽 우선순위.
 *
 * 예) GET /api/trending?limit=15
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 10, 1), 30);
  try {
    const stocks = await fetchTrendingStocks(limit);
    return NextResponse.json({
      count: stocks.length,
      generatedAt: new Date().toISOString(),
      stocks,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
