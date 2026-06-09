import Link from "next/link";
import type { Keyword } from "@/lib/keywords";

const tierAccent = {
  1: "from-[var(--red)]/20 to-transparent",
  2: "from-[var(--amber)]/20 to-transparent",
  3: "from-[var(--accent)]/20 to-transparent",
  4: "from-[var(--text-muted)]/10 to-transparent",
} as const;

const tierBorder = {
  1: "hover:border-[var(--red)]/50",
  2: "hover:border-[var(--amber)]/50",
  3: "hover:border-[var(--accent)]/50",
  4: "hover:border-[var(--text-muted)]/50",
} as const;

const tierText = {
  1: "text-[var(--red)]",
  2: "text-[var(--amber)]",
  3: "text-[var(--accent)]",
  4: "text-[var(--text-muted)]",
} as const;

export function KeywordGrid({ keywords }: { keywords: Keyword[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {keywords.map((k) => (
        <Link
          key={k.slug}
          href={`/keyword/${k.slug}`}
          className={`group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-all duration-200 hover:-translate-y-0.5 ${tierBorder[k.tier]}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${tierAccent[k.tier]}`}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`mono text-[9px] uppercase tracking-widest ${tierText[k.tier]}`}
              >
                Tier {k.tier} · {k.category}
              </span>
              <span
                className={`mono text-[10px] ${tierText[k.tier]} opacity-60`}
              >
                →
              </span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)] group-hover:text-white transition-colors mb-2 tracking-tight">
              {k.label}
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
              {k.description}
            </p>
            {k.relatedStocks && k.relatedStocks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {k.relatedStocks.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] mono px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-caption)] border border-[var(--border)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
