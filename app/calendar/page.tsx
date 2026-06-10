import { TradingCalendar } from "@/components/TradingCalendar";
import { SectionHeader } from "@/components/SectionHeader";
import { WEEK_AHEAD } from "@/lib/calendar";

export const metadata = {
  title: "트레이딩 캘린더",
  description: "오늘 KST 핵심 시각·이번 주 매크로 이벤트.",
};

export const revalidate = 600;

export default function CalendarPage() {
  return (
    <>
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-transparent to-transparent">
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
            Trading Calendar · Today + Week
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            트레이딩 <span className="gradient-text">캘린더</span>
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
            오늘 한국 시장 핵심 시각·이번 주 매크로 이벤트 한 화면에.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12">
        <section>
          <SectionHeader label="01 · Today" title="오늘 시간표 (KST)" />
          <TradingCalendar />
        </section>

        <section>
          <SectionHeader label="02 · Week" title="이번 주 매크로" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WEEK_AHEAD.map((e) => {
              const color =
                e.importance === 3
                  ? "border-[var(--red)]/40 from-[var(--red)]/10"
                  : e.importance === 2
                    ? "border-[var(--accent)]/40 from-[var(--accent)]/10"
                    : "border-[var(--border)] from-transparent";
              return (
                <div
                  key={`${e.date}-${e.label}`}
                  className={`rounded-xl border ${color} bg-gradient-to-br to-transparent p-5 bg-[var(--bg-elevated)]`}
                >
                  <div className="mono text-xs font-bold text-[var(--accent)] mb-2">
                    {e.date}
                  </div>
                  <div className="text-sm text-[var(--text)] font-medium">
                    {e.label}
                  </div>
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mt-2">
                    {e.category}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
