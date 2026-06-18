/**
 * 자체 페이지뷰 카운터 — Supabase `pageviews` 테이블에 적재.
 * POST: 방문 1건 기록(공개 비콘). GET ?op=SECRET: 집계(방문수·인기 페이지·유입 경로·일자별).
 * 테이블 없으면(또는 Supabase 미설정) 조용히 no-op → 사이트는 정상.
 *
 * 테이블(최초 1회 · Supabase SQL Editor):
 *   create table if not exists pageviews (
 *     id bigint generated always as identity primary key,
 *     path text, referrer text, created_at timestamptz default now()
 *   );
 *   create index if not exists pageviews_created_idx on pageviews (created_at desc);
 */
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const OPS_SECRET = process.env.OPS_SECRET ?? "qmin-ops-2026";

export async function POST(req: Request) {
  try {
    const b = (await req.json().catch(() => ({}))) as { path?: string; referrer?: string };
    const sb = getServerSupabase();
    if (!sb) return new NextResponse(null, { status: 204 });
    await sb.from("pageviews").insert({
      path: String(b.path ?? "/").slice(0, 200),
      referrer: String(b.referrer ?? "").slice(0, 300),
    });
  } catch {
    /* 적재 실패는 사이트에 영향 없게 무시 */
  }
  return new NextResponse(null, { status: 204 });
}

function refHost(r?: string | null): string {
  if (!r) return "(직접/북마크)";
  try {
    const h = new URL(r).hostname.replace(/^www\./, "");
    return h || "(직접)";
  } catch {
    return r.slice(0, 40);
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("op") !== OPS_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 7)));
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Supabase 미설정" });
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await sb
    .from("pageviews")
    .select("path,referrer,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);
  if (error) return NextResponse.json({ ok: false, error: error.message });
  const rows = data ?? [];

  const byPath: Record<string, number> = {};
  const byRef: Record<string, number> = {};
  const byDay: Record<string, number> = {};
  for (const r of rows) {
    const p = r.path || "/";
    byPath[p] = (byPath[p] || 0) + 1;
    const ref = refHost(r.referrer);
    byRef[ref] = (byRef[ref] || 0) + 1;
    const d = (r.created_at || "").slice(0, 10);
    if (d) byDay[d] = (byDay[d] || 0) + 1;
  }
  const top = (o: Record<string, number>, n = 12) =>
    Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);

  return NextResponse.json({
    ok: true,
    days,
    totalViews: rows.length,
    topPaths: top(byPath),
    topReferrers: top(byRef),
    byDay: Object.entries(byDay).sort(),
  });
}
