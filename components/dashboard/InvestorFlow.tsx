import { INVESTOR_FLOWS } from "@/lib/market-snapshot";

export function InvestorFlowCard() {
  const maxAmount = Math.max(...INVESTOR_FLOWS.map((f) => f.amount));
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-2">
        Investor Flow · 억원
      </div>
      <div className="space-y-1.5">
        {INVESTOR_FLOWS.map((f) => {
          const pct = (f.amount / maxAmount) * 100;
          const color =
            f.direction === "buy"
              ? "bg-[var(--red)]"
              : "bg-[var(--green)]";
          return (
            <div key={f.label} className="text-[11px]">
              <div className="flex items-center justify-between mono tabular-nums mb-0.5">
                <span className="text-[var(--text-muted)]">{f.label}</span>
                <span
                  className={`font-semibold ${
                    f.direction === "buy"
                      ? "text-[var(--red)]"
                      : "text-[var(--green)]"
                  }`}
                >
                  {f.direction === "buy" ? "+" : "-"}
                  {f.amount.toLocaleString()}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className={`h-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
