/**
 * 운영자 화면 트래픽 패널용 — 실시간 인기검색종목·급등주.
 * 네이버 금융 검색 상위(키 불필요). /ops 클라이언트가 호출.
 */
import { NextResponse } from "next/server";
import { fetchTrendingStocks } from "@/lib/naver-trending";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  const stocks = await fetchTrendingStocks(12);
  return NextResponse.json({ ok: true, stocks });
}
