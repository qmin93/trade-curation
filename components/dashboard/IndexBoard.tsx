import { MARKET_INDICES, FX_RATES } from "@/lib/market-snapshot";

export function IndexBoard() {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        Indices · FX
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {MARKET_INDICES.map((m) => (
          <Row
            key={m.label}
            label={m.label}
            value={m.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            pct={m.changePercent}
          />
        ))}
      </div>
      <div className="border-t border-[var(--border)] mt-2 pt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {FX_RATES.map((f) => (
          <Row
            key={f.pair}
            label={f.pair}
            value={f.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            pct={f.changePercent}
            invertColor
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  pct,
  invertColor = false,
}: {
  label: string;
  value: string;
  pct: number;
  invertColor?: boolean;
}) {
  const up = pct >= 0;
  const color = invertColor
    ? up
      ? "text-[var(--green)]"
      : "text-[var(--red)]"
    : up
      ? "text-[var(--red)]"
      : "text-[var(--green)]";
  return (
    <div className="flex items-center gap-1 text-[11px] mono tabular-nums">
      <span className="text-[var(--text-muted)] truncate min-w-0">{label}</span>
      <span className="ml-auto text-[var(--text)] font-semibold shrink-0">{value}</span>
      <span className={`font-semibold w-11 text-right shrink-0 ${color}`}>
        {up ? "+" : ""}
        {pct.toFixed(2)}%
      </span>
    </div>
  );
}
