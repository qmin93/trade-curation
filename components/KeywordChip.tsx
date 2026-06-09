import Link from "next/link";
import type { Keyword } from "@/lib/keywords";

const tierStyle = {
  1: {
    bg: "bg-[var(--red)]/10",
    border: "border-[var(--red)]/30",
    text: "text-[var(--red)]",
    glow: "hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]",
  },
  2: {
    bg: "bg-[var(--amber)]/10",
    border: "border-[var(--amber)]/30",
    text: "text-[var(--amber)]",
    glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.35)]",
  },
  3: {
    bg: "bg-[var(--accent)]/10",
    border: "border-[var(--accent)]/30",
    text: "text-[var(--accent)]",
    glow: "hover:shadow-[0_0_24px_rgba(62,106,225,0.35)]",
  },
  4: {
    bg: "bg-[var(--bg-subtle)]",
    border: "border-[var(--border)]",
    text: "text-[var(--text-muted)]",
    glow: "hover:shadow-[0_0_18px_rgba(255,255,255,0.06)]",
  },
} as const;

export function KeywordChip({ keyword }: { keyword: Keyword }) {
  const s = tierStyle[keyword.tier];
  return (
    <Link
      href={`/keyword/${keyword.slug}`}
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all duration-200 hover:-translate-y-0.5 ${s.bg} ${s.border} ${s.glow}`}
    >
      <span className={`font-semibold text-sm ${s.text}`}>{keyword.label}</span>
      <span className={`text-[9px] mono uppercase tracking-widest opacity-60 ${s.text}`}>
        T{keyword.tier}
      </span>
    </Link>
  );
}
