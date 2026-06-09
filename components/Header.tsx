import Link from "next/link";
import { getHotKeywords } from "@/lib/keywords";
import { SearchInput } from "./SearchInput";
import { MobileNav } from "./MobileNav";

export function Header() {
  const hot = getHotKeywords();
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

        <nav className="hidden md:flex gap-1 text-sm shrink-0">
          {hot.map((k) => (
            <Link
              key={k.slug}
              href={`/keyword/${k.slug}`}
              className="px-3 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              {k.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block flex-1 max-w-sm">
          <SearchInput />
        </div>

        <div className="hidden md:flex items-center gap-2 mono text-[10px] text-[var(--text-caption)] uppercase tracking-widest shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] pulse-dot" />
          KRX OPEN
        </div>

        <MobileNav keywords={hot} />
      </div>
    </header>
  );
}
