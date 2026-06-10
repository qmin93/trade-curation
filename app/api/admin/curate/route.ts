import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getServerSupabase,
  type NewsRow,
  type PickResultRow,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface NewsBody {
  type: "news";
  date: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
}

interface PickBody {
  type: "pick";
  date: string;
  stockName: string;
  ticker: string;
  time: string;
  entryPrice: number;
  target1: number;
  target2: number;
  stopLoss: number;
  note: string;
}

interface ResultBody {
  type: "result";
  date: string;
  stockName: string;
  ticker: string;
  entryPrice: number;
  resultPercent: number;
  targetReached: number;
  note: string;
}

type Body = NewsBody | PickBody | ResultBody;

function checkAuth(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${expected}`;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: "Unauthorized · ADMIN_TOKEN 확인" },
      { status: 401 },
    );
  }

  const sb = getServerSupabase();
  if (!sb) {
    return NextResponse.json(
      {
        error:
          "Supabase 미설정 — NEXT_PUBLIC_SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY 등록 필요",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Body;

    if (body.type === "news") {
      const row: NewsRow = {
        id: `${body.date.replace(/-/g, "")}-${Date.now()}`,
        date: body.date,
        headline: body.headline,
        summary: body.summary,
        source: body.source,
        source_url: body.sourceUrl,
        keywords: body.keywords,
        stocks: body.stocks,
        origin: "curated",
      };
      const { error } = await sb
        .from("news")
        .upsert(row, { onConflict: "source_url" });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      revalidatePath("/");
      revalidatePath("/keyword/[slug]", "page");
      return NextResponse.json({
        message: `뉴스 저장: ${body.headline.slice(0, 30)}…`,
      });
    }

    if (body.type === "pick") {
      const message = `${body.stockName} (${body.ticker}) 다중 신호·${body.entryPrice.toLocaleString()} 자리·1차 ${body.target1.toLocaleString()}·2차 ${body.target2.toLocaleString()}·손절 ${body.stopLoss.toLocaleString()}`;
      const { error } = await sb.from("alerts").insert({
        id: `${body.date.replace(/-/g, "")}-pick-${body.ticker}`,
        time: body.time,
        ticker: body.ticker,
        stock_name: body.stockName,
        type: "다중 신호",
        message,
        source: "내부 시그널",
        source_url: `/results/${body.date}`,
        severity: 3,
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      revalidatePath("/alerts");
      revalidatePath("/");
      return NextResponse.json({ message: `픽 저장: ${body.stockName}` });
    }

    if (body.type === "result") {
      const row: PickResultRow = {
        date: body.date,
        rank: 1,
        stock_name: body.stockName,
        ticker: body.ticker,
        target_reached: body.targetReached,
        result_percent: body.resultPercent,
        status: body.resultPercent >= 0 ? "hit" : "stop",
        note: body.note,
        total_return: body.resultPercent,
      };
      const { error } = await sb
        .from("pick_results")
        .upsert(row, { onConflict: "date,ticker" });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      revalidatePath("/results");
      revalidatePath(`/results/${body.date}`);
      return NextResponse.json({
        message: `결과 저장: ${body.stockName} ${body.resultPercent >= 0 ? "+" : ""}${body.resultPercent}%`,
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
