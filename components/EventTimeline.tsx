import { JUNE_EVENT_CALENDAR } from "@/lib/keywords";

export function EventTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--border-strong)] to-transparent" />
      <div className="space-y-3">
        {JUNE_EVENT_CALENDAR.map((e, i) => (
          <div
            key={e.date}
            className="relative pl-12 group"
          >
            <div className="absolute left-2 top-2 w-5 h-5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] group-hover:scale-150 transition-transform" />
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 transition-all hover:border-[var(--accent)]/50 hover:-translate-y-0.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="mono text-xs font-bold text-[var(--accent)] tracking-wide">
                  {e.date}
                </span>
                <span className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)]">
                  E{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="text-sm text-[var(--text)] mb-2 font-medium">
                {e.event}
              </div>
              <div className="flex flex-wrap gap-1">
                {e.keywords.map((k) => (
                  <span
                    key={k}
                    className="text-[10px] mono px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
