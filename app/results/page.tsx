import { getRecentResults, MONTHLY_STATS } from "@/lib/results";
import { ResultCard } from "@/components/ResultCard";
import { PerformanceStats } from "@/components/PerformanceStats";
import { SectionHeader } from "@/components/SectionHeader";
import { ComparisonTable } from "@/components/ComparisonTable";
import { TelegramProcess } from "@/components/TelegramProcess";
import { FAQ } from "@/components/FAQ";

export const metadata = {
  title: "추천 결과 · 누적 성과",
  description:
    "단타 트레이드 일자별 추천 결과 + 6월 누적 적중·실패·승률·수익률 정리.",
};

export const revalidate = 1800;

export default function ResultsPage() {
  const results = getRecentResults();
  return (
    <>
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-transparent to-transparent">
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
            Results · Performance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            추천 결과 <span className="gradient-text">기록</span>
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
            일자별 추천 종목 도달·미달 결과 + 월간 누적 성과. 정보 공유
            목적·종목 추천 아님.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12">
        <section>
          <SectionHeader
            label="01 · Monthly Stats"
            title={`${MONTHLY_STATS.month} 누적 성과`}
          />
          <PerformanceStats stats={MONTHLY_STATS} />
        </section>

        <section>
          <SectionHeader
            label="02 · Daily Results"
            title="일자별 결과"
          />
          {results.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center">
              <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">
                no results yet
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                결과가 누적되는 대로 표시됩니다.
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r) => (
                <ResultCard key={r.date} result={r} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            label="03 · Why us"
            title="일반 리딩방과 무엇이 다른가"
          />
          <ComparisonTable />
        </section>

        <section>
          <SectionHeader
            label="04 · How to start"
            title="무료 체험, 3단계면 끝"
          />
          <TelegramProcess />
        </section>

        <section>
          <SectionHeader label="05 · FAQ" title="자주 묻는 질문" />
          <FAQ />
        </section>
      </div>
    </>
  );
}
