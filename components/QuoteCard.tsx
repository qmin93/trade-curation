import type { TraderQuote } from "@/lib/quotes";

export function QuoteCard({ quote, large = false }: { quote: TraderQuote; large?: boolean }) {
  return (
    <figure
      className={`relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] ${large ? "p-8 md:p-10" : "p-6"} overflow-hidden`}
    >
      <div
        aria-hidden
        className="absolute top-4 left-4 text-[8rem] leading-none font-serif text-[var(--accent)]/10 select-none"
      >
        “
      </div>
      <blockquote className="relative">
        <p
          className={`${large ? "text-2xl md:text-3xl" : "text-lg"} font-semibold leading-snug text-[var(--text)] tracking-tight`}
        >
          {quote.text}
        </p>
        <footer className="mt-4 flex items-baseline gap-2">
          <span className="text-sm font-bold text-[var(--accent)]">
            — {quote.attribution}
          </span>
          {quote.context && (
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
              {quote.context}
            </span>
          )}
        </footer>
      </blockquote>
    </figure>
  );
}
