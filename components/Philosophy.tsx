/**
 * 철학 5카드 — "왜 전부 공개하나". 멘토(세력아카데미)의 5원칙을 단타 트레이드 톤으로.
 * 정확한 자리 · FOMO 회피 · 기다림 · 자율 대응 · 리스크 관리.
 */
const PRINCIPLES: { n: string; icon: string; title: string; desc: string }[] = [
  {
    n: "01",
    icon: "🎯",
    title: "정확한 자리",
    desc: "아무 때나 신호를 내지 않습니다. 검증된 조건이 갖춰진 자리에서만 포착합니다.",
  },
  {
    n: "02",
    icon: "🚫",
    title: "FOMO 회피",
    desc: "이미 달려간 종목은 쫓지 않습니다. 늦은 추격이 아니라 앞선 포착을 지향합니다.",
  },
  {
    n: "03",
    icon: "⏳",
    title: "기다림",
    desc: "조건이 맞지 않는 날은 신호가 없습니다. 억지로 만들지 않는 것도 실력입니다.",
  },
  {
    n: "04",
    icon: "🧭",
    title: "자율 대응",
    desc: "목표가를 확보한 뒤의 보유·청산은 본인 판단입니다. 강요하지 않습니다.",
  },
  {
    n: "05",
    icon: "🛡️",
    title: "리스크 관리",
    desc: "포착가와 함께 손절가를 명확히 제시합니다. 잃지 않는 것이 먼저입니다.",
  },
];

export function Philosophy() {
  return (
    <div>
      <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed mb-6">
        신호의 가치는 결과로 증명됩니다. 그래서 잘된 것도, 안된 것도 전부 그대로
        보여드립니다. 아래는 신호를 내는 다섯 가지 기준입니다.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PRINCIPLES.map((p) => (
          <div
            key={p.n}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl" aria-hidden>
                {p.icon}
              </span>
              <span className="mono text-[11px] font-bold text-[var(--accent)]/40">
                {p.n}
              </span>
            </div>
            <div className="text-sm font-bold text-[var(--text)] mb-1.5">
              {p.title}
            </div>
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
