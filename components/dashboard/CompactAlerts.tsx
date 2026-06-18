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
    <div className="card-surface p-4">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-caption)] mb-3 flex items-center justify-between">
        <Link href="/alerts" className="transition-colors hover:text-[var(--accent)]">
          Live Alerts ↗
        </Link>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
        </span>
      </div>
      <div className="space-y-0.5 -mx-1.5">
        {alerts.map((a) => {
          const inner = (
            <div className="flex items-start gap-2 text-[11px]">
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${sevColor[a.severity]}`}
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
              className="block px-1.5 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={a.id}
              href={a.sourceUrl}
              className="block px-1.5 py-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
