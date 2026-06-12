import { NextResponse } from "next/server";
import { getRecentNewsUnified } from "@/lib/news-fetcher";
import { fetchRecentDartDisclosures } from "@/lib/dart-fetcher";
import { insertNewsItems, type NewsRow } from "@/lib/supabase";

/**
 * 라이브 뉴스 영구 적재 endpoint — 자동 업데이트 백본.
 *
 * 통합 피드(네이버 검색·RSS·DART 공시)에서 라이브 항목만 Supabase news 테이블에 upsert.
 * → 30분 네이버 윈도우에서 밀려난 뉴스도 아카이브로 누적, 키워드/종목 페이지가 시간이 갈수록 풍부.
 *
 * - mock(소스코드 큐레이션)·supabase(이미 저장)는 적재 제외.
 * - upsert onConflict source_url → 중복 자동 무시.
 * - 보안: 프로덕션에서 CRON_SECRET 인증. cron-job.org가 30분마다 호출.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 진단: ?debug=dart → DART fetch만 직접 호출해 키/수집 상태 확인
  const { searchParams } = new URL(request.url);
  if (searchParams.get("debug") === "dart") {
    const dart = await fetchRecentDartDisclosures();
    return NextResponse.json({
      keyPresent: Boolean(process.env.DART_API_KEY),
      dartCount: dart.length,
      sample: dart.slice(0, 5).map((d) => `${d.corpName} — ${d.reportNm}`),
    });
  }

  try {
    const items = await getRecentNewsUnified(40);
    const live = items.filter(
      (n) => n.origin === "naver" || n.origin === "rss" || n.origin === "dart",
    );
    const rows: NewsRow[] = live.map((n) => ({
      id: n.id,
      date: n.date,
      headline: n.headline,
      summary: n.summary,
      source: n.source,
      source_url: n.sourceUrl,
      keywords: n.keywords,
      stocks: n.stocks,
      origin: n.origin,
    }));
    await insertNewsItems(rows);
    return NextResponse.json({
      ingested: rows.length,
      byOrigin: {
        naver: rows.filter((r) => r.origin === "naver").length,
        rss: rows.filter((r) => r.origin === "rss").length,
        dart: rows.filter((r) => r.origin === "dart").length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
