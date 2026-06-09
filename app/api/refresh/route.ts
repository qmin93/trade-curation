import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { KEYWORDS } from "@/lib/keywords";
import { STOCKS } from "@/lib/stocks";
import { THEMES } from "@/lib/themes";

/**
 * 캐시 강제 갱신 endpoint.
 *
 * - Vercel Cron이 매 30분 호출 → 모든 키워드/종목/테마 페이지 revalidate
 * - 수동 호출도 가능: GET /api/refresh
 *
 * 보안: 프로덕션에서는 CRON_SECRET 환경변수로 인증.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/");
    KEYWORDS.forEach((k) => revalidatePath(`/keyword/${k.slug}`));
    STOCKS.forEach((s) => revalidatePath(`/stock/${s.ticker}`));
    THEMES.forEach((t) => revalidatePath(`/theme/${t.slug}`));
    revalidatePath("/results");
    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: {
        keywords: KEYWORDS.length,
        stocks: STOCKS.length,
        themes: THEMES.length,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
