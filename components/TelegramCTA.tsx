import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 리드 퍼널 진입 CTA — 방문자를 텔레그램(무료 알림)으로 보낸다.
 * 후크(욕구 자극) → 무료 제안(리드 마그넷) → 단일 행동, 책 『마케팅 설계자』 구조.
 */
export function TelegramCTA({
  variant = "card",
}: {
  variant?: "card" | "banner";
}) {
  if (variant === "banner") {
    return (
      <a
        href={TELEGRAM_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/15 via-[var(--bg-elevated)] to-[var(--bg-elevated)] p-8 md:p-10"
      >
        <div className="absolute inset-0 noise-bg pointer-events-none" />
        <div className="relative">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
            Free · Telegram
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 max-w-xl leading-snug">
            장 열기 전, 오늘 뜰 자리부터 무료로 받아보세요
          </h3>
          <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl mb-6 leading-relaxed">
            흩어진 단타 뉴스를 직접 정리해 매일 아침 텔레그램으로. 오늘의 급등
            테마·대장주를 시초가 직전에 한 번에 봅니다.
          </p>
          <span className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white group-hover:opacity-90 transition-opacity">
            텔레그램에서 무료로 받기
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </span>
          <p className="mono text-[10px] text-[var(--text-caption)] mt-4">
            정보 공유 목적 · 종목 추천 아님 · 매매 본인 책임
          </p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={TELEGRAM_INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--accent)]/15 to-[var(--bg-elevated)] p-4"
    >
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
        Free · Telegram
      </div>
      <div className="text-sm font-bold text-[var(--text)] leading-snug mb-1.5">
        오늘 뜰 자리, 매일 아침 무료로
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
        직접 정리한 단타 종목·테마를 텔레그램으로 받아보세요.
      </p>
      <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white group-hover:opacity-90 transition-opacity">
        무료로 받기
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </span>
    </a>
  );
}
