import Link from "next/link";

export function SectionHeader({
  label,
  title,
  href,
  hrefLabel,
}: {
  label: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5 pb-3 border-b border-[var(--border)]">
      <div>
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-1">
          {label}
        </div>
        <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
          {title}
        </h2>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:text-white transition-colors"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
