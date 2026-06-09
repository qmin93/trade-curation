import Link from "next/link";
import { getHotKeywords } from "@/lib/keywords";

export default function NotFound() {
  const hot = getHotKeywords();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
          404 · Not Found
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4 gradient-text">
          404
        </h1>
        <p className="text-base text-[var(--text-muted)] mb-8">
          해당 키워드·종목·테마는 아직 수집되지 않았습니다.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 transition-colors mb-8"
        >
          홈으로 ←
        </Link>
        <div>
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-3">
            대신 이런 키워드는 어때요?
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {hot.map((k) => (
              <Link
                key={k.slug}
                href={`/keyword/${k.slug}`}
                className="px-3 py-1.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-sm hover:border-[var(--accent)]/50 transition-colors"
              >
                {k.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
