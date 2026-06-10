import { CORE_PRINCIPLES, TRADER_QUOTES } from "@/lib/quotes";
import { QuoteCard } from "@/components/QuoteCard";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "운영 철학 · 3 원칙",
  description:
    "손절선·자금관리·매매일지 — 마법사들 17명이 공통적으로 강조한 단타의 본질.",
};

export default function PhilosophyPage() {
  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-3">
            Philosophy
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
            근거 분명한 자리만.
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
            『주식시장의 마법사들』 17명 트레이더가 공통적으로 강조한 단타의 본질
            — 시세보다 원칙.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 space-y-20">
        <section>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-8 text-center">
            Three Principles
          </div>
          <div className="space-y-10">
            {CORE_PRINCIPLES.map((p) => (
              <div
                key={p.n}
                className="border-t border-[var(--border)] pt-8 first:border-t-0 first:pt-0"
              >
                <div className="mono text-sm font-bold text-[var(--accent)] mb-2">
                  {p.n}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  {p.title}
                </h2>
                <p className="text-base text-[var(--text-muted)] leading-relaxed mb-5">
                  {p.description}
                </p>
                <figure className="border-l-2 border-[var(--accent)] pl-4">
                  <blockquote className="text-[var(--text)] italic leading-relaxed">
                    {p.quote}
                  </blockquote>
                  <figcaption className="mono text-xs text-[var(--text-caption)] mt-2">
                    — {p.by}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader label="Quotes" title="트레이더 격언" />
          <div className="space-y-4">
            {TRADER_QUOTES.map((q, i) => (
              <QuoteCard key={i} quote={q} />
            ))}
          </div>
        </section>

        <section className="text-center border-t border-[var(--border)] pt-16">
          <p className="text-base text-[var(--text-muted)] mb-2">
            매매할 자리가 없으면 매매하지 마라.
          </p>
          <p className="mono text-xs text-[var(--text-caption)]">
            — 마이클 마커스
          </p>
        </section>
      </div>
    </>
  );
}
