/**
 * 운영자 콘솔 트래픽 트렌드 패널용 — 네이버 데이터랩(테마 검색 모멘텀) + 구글 트렌딩.
 * (네이버 인기검색 종목은 /api/ops/trending 별도.)
 */
import { NextResponse } from "next/server";
import { fetchDataLabThemes, fetchGoogleTrending } from "@/lib/trends";

export const runtime = "nodejs";
export const revalidate = 1800; // 30분 캐시(데이터랩 일 단위라 자주 바뀌지 않음)

export async function GET() {
  const [datalab, google] = await Promise.all([
    fetchDataLabThemes(),
    fetchGoogleTrending(12),
  ]);
  return NextResponse.json({ ok: true, datalab, google });
}
