import { AlertFeed } from "@/components/AlertFeed";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "실시간 호재 알림",
  description: "단독 호재·다중 신호·테마 자극 자동 감지.",
};

export const revalidate = 600;

export default function AlertsPage() {
  return (
    <>
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/15 via-transparent to-transparent">
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-16">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
            Live Alerts
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            실시간 <span className="gradient-text">호재 알림</span>
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
            단독 호재·다중 기술 신호·테마 자극을 자동 감지. 매 30분 갱신.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-8">
        <section>
          <SectionHeader label="01 · Today" title="오늘의 호재" />
          <AlertFeed limit={20} />
        </section>
      </div>
    </>
  );
}
