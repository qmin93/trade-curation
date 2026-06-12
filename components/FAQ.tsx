import { MONTHLY_STATS } from "@/lib/results";

/**
 * 자주 묻는 질문 — 진입 장벽 사전 제거. 멘토(세력아카데미) FAQ 차용.
 * <details>로 클라이언트 JS 없이 펼침형.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "정말 무료인가요?",
    a: "네. 텔레그램 무료 채널입니다. 카드 등록·선결제 없이 입장해 매일 종목·테마와 장중 신호를 받아보실 수 있습니다.",
  },
  {
    q: "신호는 어떻게 오나요?",
    a: "진입가·목표가·손절가가 함께 제공됩니다. 장중 실시간으로 텔레그램에 도착하고, 결과는 이 사이트 성과 페이지에 그대로 기록됩니다.",
  },
  {
    q: "손절도 공개하나요?",
    a: "수익도 손절도 같은 기준으로 전부 공개합니다. 잘된 신호만 고르지 않고, 종목명·날짜·시각·포착가·목표가·손절가를 모두 남겨 한 건씩 직접 검증하실 수 있습니다.",
  },
  {
    q: `승률이 어떻게 되나요?`,
    a: `${MONTHLY_STATS.month} 기준 누적 승률 ${MONTHLY_STATS.winRate}% (적중 ${MONTHLY_STATS.hitCount}건·손절 ${MONTHLY_STATS.missCount}건), 누적 수익률 +${MONTHLY_STATS.cumulativeReturn}%입니다. 매일 갱신되며 성과 페이지에서 확인할 수 있습니다.`,
  },
  {
    q: "종목 추천인가요?",
    a: "정보 공유·교육 목적의 콘텐츠입니다. 투자 권유가 아니며, 최종 매매 판단과 책임은 투자자 본인에게 있습니다.",
  },
];

export function FAQ() {
  return (
    <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
      {FAQS.map((f) => (
        <details key={f.q} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-[var(--text)]">
            {f.q}
            <span className="ml-4 text-[var(--text-caption)] transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-[var(--text-muted)]">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
