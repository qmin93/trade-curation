import { CORE_PRINCIPLES, TRADER_QUOTES } from "@/lib/quotes";
import { QuoteCard } from "@/components/QuoteCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TelegramCTA } from "@/components/TelegramCTA";

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
            Who Curates
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-center">
            누가 정리하나
          </h2>
          <div className="space-y-4 text-base text-[var(--text-muted)] leading-relaxed">
            <p>
              단타 트레이드는 매일 직접 매매하는 한 명의 단타 트레이더가 운영합니다.
              매일 아침, 단타 텔레그램·증권 매체에 흩어진 재료를 직접 읽고 — 단타에
              쓸모없는 건 버리고, 쓸 만한 것만 <strong className="text-[var(--text)]">원문 출처와 함께</strong> 정리합니다.
            </p>
            <p>
              저도 물려도 보고, 손절도 합니다. 그래서 &ldquo;사라&rdquo;고 하지 않습니다.
              대신 <strong className="text-[var(--text)]">&ldquo;오늘 이게 왜 도는지&rdquo;</strong>를 정리합니다.
              자리는 보여드리되, 들어갈지 말지는 본인의 기준입니다.
            </p>
            <p>
              모든 카드는 헤드라인이 아니라 직접 쓴 요약이고, &ldquo;출처 가기&rdquo;
              버튼으로 원문을 그대로 확인할 수 있습니다. 가공된 정보가 아니라,
              검증할 수 있는 정보를 지향합니다.
            </p>
          </div>
        </section>

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

        <TelegramCTA variant="banner" />
      </div>
    </>
  );
}
