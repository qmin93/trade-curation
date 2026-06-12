import { ImageResponse } from "next/og";
import { loadKoreanFont } from "@/lib/card-font";
import { ACTIVE_PICK } from "@/lib/picks";
import { getBacktestSummary } from "@/lib/backtest";
import { fetchThemeMovers } from "@/lib/theme-movers";

/**
 * Threads 공유용 1080×1080 카드 이미지 생성기.
 *   /api/card/chart?ticker=005930&name=삼성전자&change=12.2&note=...
 *   /api/card/news?headline=...&summary=...&source=...
 *   /api/card/pick?name=...&ticker=...&entry=...&target=...&stop=...
 *   /api/card/perf
 * 공통: &brand=1 → 사이트 워터마크(브랜드 계정용) / 생략 → 무브랜드(페르소나용)
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIDTH = 1080;
const SQUARE = 1080;
const PORTRAIT = 1350;
const NAVY = "#0a0e1a";
const TEXT = "#f1f5f9";
const MUTED = "#94a3b8";
const UP = "#ef4444";
const DOWN = "#3b82f6";
const ACCENT = "#3e6ae1";
const PANEL = "rgba(255,255,255,0.05)";
const BORDER = "rgba(255,255,255,0.10)";

function chartUrl(ticker: string) {
  return `https://ssl.pstatic.net/imgfinance/chart/item/area/day/${ticker}.png`;
}

function Brand({ on }: { on: boolean }) {
  if (!on) {
    return (
      <div style={{ display: "flex", height: 8 }} />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginTop: "auto",
        paddingTop: 28,
      }}
    >
      <div style={{ display: "flex", width: 16, height: 16, borderRadius: 999, background: UP }} />
      <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: TEXT }}>단타 트레이드</div>
      <div style={{ display: "flex", marginLeft: "auto", fontSize: 26, color: MUTED }}>
        dantatrade.vercel.app
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 72,
        background:
          "radial-gradient(circle at 18% 12%, rgba(62,106,225,0.22), transparent 55%), radial-gradient(circle at 85% 90%, rgba(239,68,68,0.14), transparent 50%), " +
          NAVY,
        color: TEXT,
        fontFamily: "Pretendard",
      }}
    >
      {children}
    </div>
  );
}

function eyebrow(text: string) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 28,
        letterSpacing: "0.1em",
        color: ACCENT,
        textTransform: "uppercase",
        marginBottom: 28,
      }}
    >
      {text}
    </div>
  );
}

function ChartCard(p: URLSearchParams, brand: boolean) {
  const name = p.get("name") || "삼성전자";
  const ticker = p.get("ticker") || "005930";
  const changeRaw = p.get("change");
  const change = changeRaw !== null ? Number(changeRaw) : 12.2;
  const note = p.get("note") || "";
  const col = change >= 0 ? UP : DOWN;
  return (
    <Shell>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 32, color: MUTED, marginTop: 6 }}>{ticker}</div>
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 600, color: col }}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 40,
          borderRadius: 24,
          overflow: "hidden",
          background: "#ffffff",
          border: `1px solid ${BORDER}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chartUrl(ticker)} width={936} height={470} style={{ objectFit: "cover" }} alt="" />
      </div>
      {note ? (
        <div style={{ display: "flex", fontSize: 34, color: MUTED, marginTop: 32, lineHeight: 1.4 }}>
          {note}
        </div>
      ) : (
        <div style={{ display: "flex", height: 8 }} />
      )}
      <Brand on={brand} />
    </Shell>
  );
}

function NewsCard(p: URLSearchParams, brand: boolean) {
  const headline = p.get("headline") || "코스피, 외인 순매수에 2,900선 회복…반도체 주도";
  const summary =
    p.get("summary") ||
    "외국인이 반도체 대형주를 중심으로 순매수에 나서며 지수가 반등했습니다. 단기 수급이 우호적으로 돌아선 흐름입니다.";
  const source = p.get("source") || "연합뉴스";
  return (
    <Shell>
      {eyebrow("Market News")}
      <div style={{ display: "flex", fontSize: 64, fontWeight: 600, lineHeight: 1.28 }}>
        {headline}
      </div>
      <div style={{ display: "flex", fontSize: 36, color: MUTED, marginTop: 36, lineHeight: 1.5 }}>
        {summary}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "10px 22px",
            borderRadius: 999,
            background: PANEL,
            border: `1px solid ${BORDER}`,
            fontSize: 28,
            color: MUTED,
          }}
        >
          {source}
        </div>
      </div>
      <Brand on={brand} />
    </Shell>
  );
}

function row(label: string, value: string, color: string) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "26px 32px",
        borderRadius: 18,
        background: PANEL,
        border: `1px solid ${BORDER}`,
        marginBottom: 18,
      }}
    >
      <div style={{ display: "flex", fontSize: 36, color: MUTED }}>{label}</div>
      <div style={{ display: "flex", fontSize: 46, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

function PickCard(p: URLSearchParams, brand: boolean) {
  const name = p.get("name") || ACTIVE_PICK?.stockName || "샘씨엔에스";
  const ticker = p.get("ticker") || ACTIVE_PICK?.ticker || "252990";
  const entry = p.get("entry") || ACTIVE_PICK?.entry || "16,210";
  const target = p.get("target") || ACTIVE_PICK?.targets?.[0] || "1차 +1.4%";
  const stop = p.get("stop") || "15,560";
  return (
    <Shell>
      {eyebrow("오늘의 픽")}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 44 }}>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 600 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 34, color: MUTED, paddingBottom: 14 }}>{ticker}</div>
      </div>
      {row("진입가", entry, TEXT)}
      {row("목표", target, UP)}
      {row("손절가", stop, DOWN)}
      <div style={{ display: "flex", fontSize: 26, color: MUTED, marginTop: 24, lineHeight: 1.45 }}>
        정보 공유 목적 · 종목 추천 아님 · 매매 본인 책임
      </div>
      <Brand on={brand} />
    </Shell>
  );
}

function stat(value: string, label: string, color: string) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "36px 30px",
        borderRadius: 20,
        background: PANEL,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: "flex", fontSize: 64, fontWeight: 600, color }}>{value}</div>
      <div style={{ display: "flex", fontSize: 28, color: MUTED, marginTop: 8 }}>{label}</div>
    </div>
  );
}

function PerfCard(brand: boolean) {
  const bt = getBacktestSummary();
  const total = bt.hitCount + bt.missCount;
  return (
    <Shell>
      {eyebrow("검증된 성과")}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}>
        <div style={{ display: "flex", fontSize: 40, color: MUTED }}>공개 기간 누적 수익률</div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 600, color: UP, lineHeight: 1.05 }}>
          +{bt.cumulativeReturn.toFixed(1)}%
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
        {stat(`${bt.winRate.toFixed(1)}%`, "승률", TEXT)}
        {stat(`${total}건`, "누적 신호", TEXT)}
        {stat(`${bt.hitCount} · ${bt.missCount}`, "적중 · 손절", ACCENT)}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: MUTED, marginTop: 36, lineHeight: 1.45 }}>
        손절까지 전부 공개합니다. 잘된 신호만 고르지 않습니다.
      </div>
      <Brand on={brand} />
    </Shell>
  );
}

async function ThemeCard(brand: boolean) {
  const movers = (await fetchThemeMovers(3)).slice(0, 5);
  return (
    <Shell>
      {eyebrow("🔥 오늘의 테마 주도주")}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {movers.map((m) => (
          <div
            key={m.slug}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 24px",
              borderRadius: 18,
              background: PANEL,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", fontSize: 38, fontWeight: 600, color: TEXT }}>
                {m.emoji ? `${m.emoji} ` : ""}
                {m.label}
              </div>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: m.avgChange >= 0 ? UP : DOWN }}>
                {m.avgChange >= 0 ? "+" : ""}
                {m.avgChange.toFixed(1)}%
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {m.leaders.map((q) => (
                <div key={q.ticker} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", fontSize: 30, color: MUTED }}>{q.name}</div>
                  <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: q.changePercent >= 0 ? UP : DOWN }}>
                    {q.changePercent >= 0 ? "+" : ""}
                    {q.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Brand on={brand} />
    </Shell>
  );
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ type: string }> },
) {
  const { type } = await ctx.params;
  const url = new URL(req.url);
  const p = url.searchParams;
  const brand = p.get("brand") === "1";
  const ratio = p.get("ratio");
  // 테마 카드는 항목이 많아 기본 세로형(명시적 square만 정사각).
  const height =
    ratio === "portrait" || (type === "theme" && ratio !== "square")
      ? PORTRAIT
      : SQUARE;

  let node: React.ReactNode;
  if (type === "chart") node = ChartCard(p, brand);
  else if (type === "news") node = NewsCard(p, brand);
  else if (type === "pick") node = PickCard(p, brand);
  else if (type === "perf") node = PerfCard(brand);
  else if (type === "theme") node = await ThemeCard(brand);
  else return new Response("unknown card type", { status: 404 });

  const font = await loadKoreanFont();
  return new ImageResponse(node, {
    width: WIDTH,
    height,
    fonts: [{ name: "Pretendard", data: font, weight: 600, style: "normal" }],
  });
}
