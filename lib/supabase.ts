/**
 * Supabase 클라이언트 — 텔방 corpus·뉴스·결과 영속화.
 *
 * 발급:
 * 1. https://supabase.com/dashboard → New Project (무료 500MB DB)
 * 2. Settings → API → Project URL, anon public, service_role 복사
 * 3. .env.local에 입력
 * 4. SQL Editor에서 lib/db/schema.sql 실행
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _server: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY 미설정 — Supabase 미사용 모드.",
      );
    }
    return null;
  }
  if (!_server) {
    _server = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _server;
}

export interface NewsRow {
  id: string;
  date: string;
  headline: string;
  summary: string;
  source: string;
  source_url: string;
  keywords: string[];
  stocks: string[];
  origin: string;
  created_at?: string;
}

export interface PickResultRow {
  date: string;
  rank: number;
  stock_name: string;
  ticker: string;
  target_reached: number;
  result_percent: number;
  status: string;
  note?: string;
  total_return?: number;
  summary?: string;
}

export async function insertNewsItems(items: NewsRow[]): Promise<void> {
  const sb = getServerSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("news")
    .upsert(items, { onConflict: "source_url" });
  if (error) console.error("[supabase] insertNewsItems", error.message);
}

export async function fetchNewsByKeyword(
  keyword: string,
  limit = 30,
): Promise<NewsRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("news")
    .select("*")
    .contains("keywords", [keyword])
    .order("date", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[supabase] fetchNewsByKeyword", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchRecentNews(limit = 30): Promise<NewsRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("news")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[supabase] fetchRecentNews", error.message);
    return [];
  }
  return data ?? [];
}

export interface AlertRow {
  id: string;
  time: string;
  ticker?: string | null;
  stock_name?: string | null;
  type: string;
  message: string;
  source: string;
  source_url: string;
  severity: number;
  created_at?: string;
}

export async function fetchRecentAlerts(limit = 20): Promise<AlertRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[supabase] fetchRecentAlerts", error.message);
    return [];
  }
  return data ?? [];
}

export async function insertPickResult(row: PickResultRow): Promise<void> {
  const sb = getServerSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("pick_results")
    .upsert(row, { onConflict: "date,ticker" });
  if (error) console.error("[supabase] insertPickResult", error.message);
}
