/**
 * 상단 ticker bar — 코스피·코스닥·환율 (현재는 mock·추후 KRX OpenAPI).
 * 좌측 라벨은 장 상태(장중/장 마감/휴장)를 반영.
 */
import { getMarketStatus } from "@/lib/market-status";

interface TickerItem {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
}

const MOCK_TICKERS: TickerItem[] = [
  { label: "KOSPI", value: "7,799.52", change: "+4.21%", direction: "up" },
  { label: "KOSDAQ", value: "937.69", change: "+2.89%", direction: "up" },
  { label: "USD/KRW", value: "1,374.20", change: "-0.18%", direction: "down" },
  { label: "SK하이닉스", value: "2,065,000", change: "+8.06%", direction: "up" },
  { label: "삼성전자", value: "313,500", change: "+6.09%", direction: "up" },
  { label: "삼성SDS", value: "203,000", change: "+3.20%", direction: "up" },
  { label: "두산에너빌", value: "82,500", change: "+9.71%", direction: "up" },
  { label: "HD현대일렉", value: "857,000", change: "+4.50%", direction: "up" },
];

function dirColor(d: TickerItem["direction"]) {
  if (d === "up") return "text-[var(--red)]";
  if (d === "down") return "text-[var(--green)]";
  return "text-[var(--text-muted)]";
}

function dirArrow(d: TickerItem["direction"]) {
  if (d === "up") return "▲";
  if (d === "down") return "▼";
  return "─";
}

export function TickerBar() {
  const items = [...MOCK_TICKERS, ...MOCK_TICKERS];
  const status = getMarketStatus(new Date());
  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1">
          {status.isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
          )}
          <span className="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)]">
            {status.badge}
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex gap-3 whitespace-nowrap">
            {items.map((t, i) => (
              <div key={`${t.label}-${i}`} className="flex items-center gap-2 mono text-xs rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 transition-colors duration-200 hover:border-[var(--border-strong)]">
                <span className="text-[var(--text-caption)]">{t.label}</span>
                <span className="text-[var(--text)] font-semibold">{t.value}</span>
                <span className={dirColor(t.direction)}>
                  {dirArrow(t.direction)} {t.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
