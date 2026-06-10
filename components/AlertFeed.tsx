import Link from "next/link";
import { getRecentAlerts, type AlertItem } from "@/lib/alerts";

const typeColor: Record<AlertItem["type"], string> = {
  "단독 호재": "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
  "거래량 급증": "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/30",
  "다중 신호": "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
  "세력 매집": "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
  "급등": "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/30",
  "급락": "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/30",
  "테마": "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30",
};

const severityDot = {
  1: "bg-[var(--text-caption)]",
  2: "bg-[var(--accent)]",
  3: "bg-[var(--red)]",
};

export function AlertFeed({ limit = 6 }: { limit?: number }) {
  const alerts = getRecentAlerts(limit);
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1">
            Live Alerts · 실시간 호재
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            단독 호재·다중 신호·테마 자극 자동 감지
          </div>
        </div>
        <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          live
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-sm text-[var(--text-caption)]">
          현재 감지된 호재 없음
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => {
            const cardClass =
              "block rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-3 hover:border-[var(--accent)]/50 transition-all";
            const inner = (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${severityDot[a.severity]}`}
                  />
                  <span className="mono text-[10px] text-[var(--text-caption)]">
                    {a.time}
                  </span>
                  <span
                    className={`text-[10px] mono uppercase tracking-wider px-2 py-0.5 rounded border ${typeColor[a.type]}`}
                  >
                    {a.type}
                  </span>
                  {a.stockName && (
                    <span className="text-[10px] mono text-[var(--text)]">
                      {a.stockName} {a.ticker}
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--text)] leading-snug">
                  {a.message}
                </div>
                <div className="mono text-[10px] text-[var(--accent)]/70 mt-1.5">
                  {a.source} ↗
                </div>
              </>
            );
            return a.sourceUrl.startsWith("http") ? (
              <a
                key={a.id}
                href={a.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {inner}
              </a>
            ) : (
              <Link key={a.id} href={a.sourceUrl} className={cardClass}>
                {inner}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
