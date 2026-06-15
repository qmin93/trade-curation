import { MONTHLY_STATS } from "@/lib/results";
import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 홈 최상단 후크-스토리-제안 히어로 (『마케팅 설계자』Secret 1·2·19).
 * - 후크: 차가운 방문자의 욕구·통증 자극
 * - 스토리: 누가-무엇을-왜 + 검증(승률) 한 줄
 * - 제안: 단일 행동(텔레그램 무료)
 */
export function HeroFunnel() {
  const win = MONTHLY_STATS.winRate;
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/[0.10] via-[var(--bg-elevated)] to-[var(--bg-elevated)]">
      <div className="px-6 py-8 md:px-10 md:py-10">
        {/* 후크 */}
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug text-[var(--text)]">
          장 열기 전 5분,
          <br />
          오늘 뜰 자리를 놓치고 계신가요?
        </h1>

        {/* 스토리 (누가-무엇을-왜 + 증거) */}
        <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[var(--text-muted)]">
          매경·연합·한경에 흩어진 단타 뉴스를 직접 골라, 시초가 직전 한 화면에.{" "}
          <span className="font-semibold text-[var(--text)]">
            6월 승률 <span className="text-[var(--red)]">{win}%</span> · 손절까지 전부 공개
          </span>
          합니다.
        </p>

        {/* 누가-무엇을-왜-어떻게 미니 라벨 */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
          <span>누가 · 시초가 보는 단타 직장인</span>
          <span>무엇을 · 단타 뉴스·검증 픽 큐레이션</span>
          <span>왜 · 시초가 직전 한 번에</span>
        </div>

        {/* 제안 (단일 행동) */}
        <div className="mt-6">
          <a
            href={TELEGRAM_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            텔레그램에서 무료로 받기
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </a>
          <p className="mt-3 mono text-[10px] text-[var(--text-caption)]">
            매일 아침 무료 · 정보 공유 목적 · 종목 추천 아님 · 매매 본인 책임
          </p>
        </div>
      </div>
    </section>
  );
}
