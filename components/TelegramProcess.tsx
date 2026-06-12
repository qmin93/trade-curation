import { TELEGRAM_INVITE_URL } from "@/lib/site";

/**
 * 텔레그램 입장 3단계 프로세스 — 진입 장벽 제거(카드 등록·선결제 없음) 시각화.
 * 멘토(세력아카데미)의 "대기방→DM→신호방" 다이어그램 차용.
 */
const STEPS: { n: string; title: string; desc: string }[] = [
  {
    n: "01",
    title: "무료 채널 입장",
    desc: "아래 버튼으로 텔레그램 채널 입장. 카드 등록·선결제 없음.",
  },
  {
    n: "02",
    title: "매일 신호 수신",
    desc: "아침 종목·테마 + 장중 신호(진입·목표·손절)를 그대로 받습니다.",
  },
  {
    n: "03",
    title: "결과 직접 검증",
    desc: "도달·손절 결과는 이 사이트 성과 페이지에서 한 건씩 확인.",
  },
];

export function TelegramProcess() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="relative rounded-xl border border-[var(--border)] p-5">
            <div className="mono text-3xl font-bold text-[var(--accent)]/30 mb-2">
              {s.n}
            </div>
            <div className="text-sm font-bold text-[var(--text)] mb-1.5">
              {s.title}
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
      <a
        href={TELEGRAM_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
      >
        한 달 무료 체험 시작하기
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </a>
      <p className="mono text-[10px] text-[var(--text-caption)] mt-3">
        선결제 후 입장 아님 · 무료 체험 먼저 · 정보 공유 목적 · 매매 본인 책임
      </p>
    </div>
  );
}
