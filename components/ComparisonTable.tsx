/**
 * 일반 리딩방 vs 단타 트레이드 비교 테이블.
 * 차별화(투명성·무료 체험·검증 가능성)를 한눈에 — 멘토(세력아카데미) funnel 차용.
 */
const ROWS: { label: string; them: string; us: string }[] = [
  { label: "종목 근거", them: "종목명만 툭 통보", us: "왜 이 종목인지 실시간 뉴스·재료까지 공개" },
  { label: "진입 방식", them: "고액 선결제 후 입장", us: "무료 체험 먼저, 카드 등록 없음" },
  { label: "신호 구성", them: '모호한 "지금 사라"', us: "진입가·목표가·손절가 동시 제공" },
  { label: "손절 공개", them: "수익만 골라서 자랑", us: "손절도 같은 기준으로 전부 공개" },
  { label: "검증", them: "결과 불투명·삭제", us: "종목·날짜·시각·가격 전부 공개, 한 건씩 검증" },
  { label: "비용", them: "월 수십만 원 선결제", us: "텔레그램 무료" },
];

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      <div className="grid grid-cols-[0.9fr_1fr_1.1fr] text-sm">
        {/* header */}
        <div className="bg-[var(--bg-elevated)] px-4 py-3" />
        <div className="bg-[var(--bg-elevated)] px-4 py-3 text-center mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-caption)] border-l border-[var(--border)]">
          일반 리딩방
        </div>
        <div className="bg-[var(--accent)]/10 px-4 py-3 text-center text-xs font-bold text-[var(--accent)] border-l border-[var(--border)]">
          단타 트레이드
        </div>
        {/* rows */}
        {ROWS.map((r, i) => (
          <div key={r.label} className="contents">
            <div
              className={`px-4 py-3.5 font-semibold text-[var(--text)] ${i % 2 ? "bg-[var(--bg-elevated)]/40" : ""}`}
            >
              {r.label}
            </div>
            <div
              className={`px-4 py-3.5 text-center text-[var(--text-muted)] border-l border-[var(--border)] ${i % 2 ? "bg-[var(--bg-elevated)]/40" : ""}`}
            >
              <span className="mr-1 text-[var(--text-caption)]" aria-hidden>✕</span>
              {r.them}
            </div>
            <div
              className={`px-4 py-3.5 text-center font-medium text-[var(--text)] border-l border-[var(--border)] bg-[var(--accent)]/[0.04] ${i % 2 ? "bg-[var(--accent)]/[0.07]" : ""}`}
            >
              <span className="mr-1 text-[var(--green)]" aria-hidden>✓</span>
              {r.us}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
