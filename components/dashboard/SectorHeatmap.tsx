import Link from "next/link";
import { SECTOR_MOVES } from "@/lib/market-snapshot";

function tone(pct: number) {
  const abs = Math.abs(pct);
  if (pct >= 0) {
    if (abs >= 5) return "bg-[var(--red)]/35 text-white";
    if (abs >= 3) return "bg-[var(--red)]/25 text-[var(--text)]";
    if (abs >= 1) return "bg-[var(--red)]/15 text-[var(--text)]";
    return "bg-[var(--red)]/8 text-[var(--text-muted)]";
  }
  if (abs >= 3) return "bg-[var(--green)]/30 text-white";
  if (abs >= 1) return "bg-[var(--green)]/18 text-[var(--text)]";
  return "bg-[var(--green)]/8 text-[var(--text-muted)]";
}

export function SectorHeatmap() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        Sector Heatmap
      </div>
      <div className="grid grid-cols-2 gap-1">
        {SECTOR_MOVES.map((s) => (
          <Link
            key={s.name}
            href={`/theme/${s.name.replace(/ /g, "-")}`}
            className={`rounded px-2 py-1.5 flex items-center justify-between text-[11px] mono tabular-nums hover:opacity-80 transition-opacity ${tone(s.changePercent)}`}
          >
            <span className="truncate font-semibold">{s.name}</span>
            <span className="ml-2">
              {s.changePercent >= 0 ? "+" : ""}
              {s.changePercent.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
