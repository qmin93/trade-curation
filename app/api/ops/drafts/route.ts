/**
 * 운영자 픽 작성기 — 클라우드 저장(Supabase) 라우트.
 * 손으로 쓴 페르소나 글을 영구 저장/불러오기. 운영자 시크릿(x-ops-secret) 게이트.
 * Supabase 미설정·테이블 없음 → ok:false 반환(로컬 자동저장은 그대로 작동).
 *
 * 테이블(최초 1회, Supabase SQL Editor):
 *   create table if not exists ops_drafts (
 *     id text primary key,
 *     label text,
 *     pick_date text,
 *     payload jsonb not null,
 *     updated_at timestamptz default now()
 *   );
 */
import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const OPS_SECRET = process.env.OPS_SECRET ?? "qmin-ops-2026";

function authed(req: Request): boolean {
  const url = new URL(req.url);
  const secret = req.headers.get("x-ops-secret") ?? url.searchParams.get("op");
  return secret === OPS_SECRET;
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Supabase 미설정", drafts: [] });
  const { data, error } = await sb
    .from("ops_drafts")
    .select("id,label,pick_date,payload,updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message, drafts: [] });
  }
  return NextResponse.json({ ok: true, drafts: data ?? [] });
}

export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  let body: { draft?: { id?: string; label?: string; pickDate?: string; payload?: unknown } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const d = body.draft;
  if (!d || !d.id || !d.payload) {
    return NextResponse.json({ ok: false, error: "draft.id·payload 필요" }, { status: 400 });
  }
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Supabase 미설정 — 로컬에만 저장됨" });
  const { error } = await sb.from("ops_drafts").upsert(
    {
      id: d.id,
      label: d.label ?? "",
      pick_date: d.pickDate ?? "",
      payload: d.payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id 필요" }, { status: 400 });
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Supabase 미설정" });
  const { error } = await sb.from("ops_drafts").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message });
  return NextResponse.json({ ok: true });
}
