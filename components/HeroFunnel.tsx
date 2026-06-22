import { MONTHLY_STATS } from "@/lib/results";
import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 후크-스토리-제안 펀넬 카드 (『마케팅 설계자』Secret 1·2·19).
 * - variant="side"(기본): 사이드바용 컴팩트 카드. 뉴스가 본문 주인공이 되도록 옆에 둔다.
 * - variant="hero": 풀폭 히어로(현재 미사용, 필요 시 랜딩용).
 */
export function HeroFunnel({ variant = "side" }: { variant?: "side" | "hero" }) {
  const win = MONTHLY_STATS.winRate;

  if (variant === "side") {
    return (
      <section className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--bg-elevated)] p-5 shadow-[var(--shadow-card)]">
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] mb-2.5">
          Free · Telegram
        </div>
        <h2 className="text-base font-semibold tracking-tight leading-snug text-[var(--text)]">
          오늘 왜 올랐는지,
          <br />
          쉽게 정리해드려요
        </h2>
        <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
          어려운 용어 없이, 초보 막 뗀 분도 5분이면 한눈에.{" "}
          <span className="font-semibold text-[var(--text)]">
            6월 승률 <span className="text-[var(--red)] tabular-nums">{win}%</span>
          </span>
        </p>
        <a
          href={TELEGRAM_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-[var(--accent)]/20"
        >
          텔레그램 무료로 받기
          <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
        </a>
        <p className="mt-2.5 mono text-[9px] text-[var(--text-caption)]">
          매일 아침 무료 · 종목 추천 아님 · 매매 본인 책임
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--accent)]/25 bg-gradient-to-br from-[var(--accent)]/[0.10] via-[var(--bg-elevated)] to-[var(--bg-elevated)] shadow-[var(--shadow-card)]">
      <div className="px-6 py-8 md:px-10 md:py-12">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight leading-snug text-[var(--text)]">
          오늘 왜 올랐는지,
          <br />
          어려운 용어 없이 쉽게
        </h1>
        <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[var(--text-muted)]">
          매경·연합·한경 뉴스를 쉽게 풀어, 초보 막 뗀 분도 시초가 직전 한 화면에.{" "}
          <span className="font-semibold text-[var(--text)]">
            6월 승률 <span className="text-[var(--red)] tabular-nums">{win}%</span> · 손절까지 전부 공개
          </span>
          합니다.
        </p>
        <div className="mt-6">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-[var(--accent)]/20"
          >
            텔레그램에서 무료로 받기
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
