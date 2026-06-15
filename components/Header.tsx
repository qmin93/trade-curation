import Link from "next/link";
import { getHotKeywords } from "@/lib/keywords";
import { getMarketStatus } from "@/lib/market-status";
import { TELEGRAM_INVITE_URL } from "@/lib/site";
import { GlobalSearch } from "./GlobalSearch";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

const TOP_NAV = [
  { href: "/premarket", label: "장전" },
  { href: "/live", label: "장중" },
  { href: "/alerts", label: "호재" },
  { href: "/calendar", label: "캘린더" },
  { href: "/results", label: "결과" },
  { href: "/philosophy", label: "철학" },
];

export function Header() {
  const hot = getHotKeywords();
  const status = getMarketStatus(new Date());
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[var(--accent)] to-blue-700 flex items-center justify-center font-bold text-sm text-white">
            ▲
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm tracking-tight group-hover:text-[var(--accent)] transition-colors">
              단타 트레이드
            </span>
            <span className="text-[9px] mono text-[var(--text-caption)] uppercase tracking-widest">
              keyword terminal
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex gap-1 text-sm shrink-0">
          {TOP_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block flex-1 max-w-sm">
          <GlobalSearch />
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            {status.isLive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] pulse-dot" />
            )}
            {status.badge}
          </div>
          <ThemeToggle />
          {/* 단일 전환 CTA — 모든 페이지 상시 노출 */}
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            텔레그램 무료
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-[var(--accent)] px-2.5 py-1.5 text-[11px] font-semibold text-white"
          >
            텔레그램
          </a>
          <ThemeToggle />
          <MobileNav keywords={hot} extras={TOP_NAV} />
        </div>
      </div>
    </header>
  );
}
