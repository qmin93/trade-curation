import Link from "next/link";
import { getRecentAlerts } from "@/lib/alerts";

const sevColor = {
  1: "bg-[var(--text-caption)]",
  2: "bg-[var(--accent)]",
  3: "bg-[var(--red)]",
};

export function CompactAlerts({ limit = 6 }: { limit?: number }) {
  const alerts = getRecentAlerts(limit);
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2 flex items-center justify-between">
        <Link href="/alerts" className="hover:text-[var(--accent)]">
          Live Alerts ↗
        </Link>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[var(--red)] pulse-dot" />
        </span>
      </div>
      <div className="space-y-0.5">
        {alerts.map((a) => {
          const inner = (
            <div className="flex items-start gap-2 text-[11px]">
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${sevColor[a.severity]}`}
              />
              <span className="mono text-[10px] text-[var(--text-caption)] w-10 shrink-0 tabular-nums">
                {a.time}
              </span>
              <span className="text-[var(--text)] leading-snug line-clamp-1 flex-1">
                {a.message}
              </span>
            </div>
          );
          return a.sourceUrl.startsWith("http") ? (
            <a
              key={a.id}
              href={a.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-1.5 py-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={a.id}
              href={a.sourceUrl}
              className="block px-1.5 py-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
