import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DAILY_RESULTS,
  getResultByDate,
  MONTHLY_STATS,
} from "@/lib/results";
import { PerformanceStats } from "@/components/PerformanceStats";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, resultItemListLd } from "@/lib/seo";

export const revalidate = 1800;

export function generateStaticParams() {
  return DAILY_RESULTS.map((r) => ({ date: r.date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const r = getResultByDate(date);
  if (!r) return {};
  return {
    title: `${r.date} 결과 · ${r.totalReturn >= 0 ? "+" : ""}${r.totalReturn.toFixed(2)}%`,
    description: r.summary,
  };
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const result = getResultByDate(date);
  if (!result) notFound();
  const positive = result.totalReturn >= 0;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "결과", path: "/results" },
            { name: result.date, path: `/results/${result.date}` },
          ]),
          resultItemListLd(result.date, result.picks),
        ]}
      />
      <section
        className={`border-b border-[var(--border)] bg-gradient-to-br ${
          positive
            ? "from-[var(--red)]/15"
            : "from-[var(--green)]/15"
        } via-transparent to-transparent`}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <Link
            href="/results"
            className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] hover:text-[var(--accent)] transition-colors mb-6 inline-block"
          >
            ← 결과 목록
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
                Daily Result
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 mono tabular-nums">
                {result.date}
              </h1>
              <p className="text-base text-[var(--text-muted)] max-w-xl leading-relaxed">
                {result.summary}
              </p>
            </div>
            <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 min-w-[240px]">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
                Total Return
              </div>
              <div
                className={`mono text-4xl font-bold tabular-nums ${positive ? "text-[var(--red)]" : "text-[var(--green)]"}`}
              >
                {positive ? "▲ +" : "▼ "}
                {Math.abs(result.totalReturn).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12">
        <section>
          <SectionHeader label="01 · Picks" title="당일 추천 종목" />
          <div className="space-y-3">
            {result.picks.map((p) => (
              <div
                key={p.ticker}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="mono text-xs text-[var(--text-caption)]">
                      #{p.rank}
                    </span>
                    <Link
                      href={`/stock/${p.ticker}`}
                      className="text-lg font-bold hover:text-[var(--accent)] transition-colors"
                    >
                      {p.stockName}
                    </Link>
                    <span className="mono text-xs text-[var(--text-caption)]">
                      {p.ticker}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.status === "hit" && (
                      <span className="mono text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/30">
                        {p.targetReached}차 도달
                      </span>
                    )}
                    {p.status === "stop" && (
                      <span className="mono text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/30">
                        손절
                      </span>
                    )}
                    <span
                      className={`mono text-xl font-bold ${p.resultPercent >= 0 ? "text-[var(--red)]" : "text-[var(--green)]"}`}
                    >
                      {p.resultPercent >= 0 ? "+" : ""}
                      {p.resultPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                {p.note && (
                  <p className="text-sm text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                    {p.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            label="02 · Monthly Snapshot"
            title={`${MONTHLY_STATS.month} 누적`}
          />
          <PerformanceStats stats={MONTHLY_STATS} />
        </section>
      </div>
    </>
  );
}
