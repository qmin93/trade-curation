import { fetchPremarket, type Quote } from "@/lib/premarket";
import { TelegramCTA } from "@/components/TelegramCTA";

/**
 * 장전(場前) 대시보드 — 장 시작 전 흩어진 글로벌 신호를 한 화면에.
 * 미국 증시 마감 · 나스닥 선물 · 원/달러 · 김치프리미엄 · 코스피 예상 시초가.
 */
export const metadata = {
  title: "장전 체크 · 미국 마감·선물·환율·예상 시초가",
  description:
    "장 시작 전 나스닥 선물·미국 증시 마감·원달러 환율·김치프리미엄·코스피 예상 시초가를 한 화면에.",
};

export const revalidate = 60;

function pctClass(v: number) {
  return v >= 0 ? "text-[var(--red)]" : "text-[var(--green)]";
}
function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}
function fmtNum(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function QuoteCard({ q }: { q: Quote }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
      <div className="text-xs text-[var(--text-caption)] mb-1.5">{q.label}</div>
      <div className="mono text-xl font-bold text-[var(--text)] tabular-nums">
        {fmtNum(q.price)}
      </div>
      <div className={`mono text-sm font-semibold tabular-nums mt-0.5 ${pctClass(q.changePercent)}`}>
        {fmtPct(q.changePercent)}
      </div>
    </div>
  );
}

export default async function PremarketPage() {
  const data = await fetchPremarket();
  const kstTime = new Date(data.fetchedAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-10">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
        Pre-Market · 장전 체크
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        장 시작 전, 흩어진 신호를 한 화면에
      </h1>
      <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed mb-2">
        간밤 미국 증시 마감과 실시간 나스닥 선물, 원/달러 환율, 김치프리미엄까지
        — 오늘 코스피의 아침 방향을 결정하는 신호들을 모았습니다.
      </p>
      <div className="mono text-[10px] text-[var(--text-caption)] mb-8">
        업데이트 {kstTime} KST · 60초마다 갱신
      </div>

      {/* 코스피 예상 시초가 */}
      {data.kospi && (
        <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] p-6 mb-8">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-3">
            코스피 예상 시초가 (참고용 추정)
          </div>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
            <div>
              <div className="text-xs text-[var(--text-caption)] mb-1">예상 지수</div>
              <div className="mono text-4xl font-bold text-[var(--text)] tabular-nums">
                {fmtNum(data.kospi.estimatedOpen)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-caption)] mb-1">예상 등락</div>
              <div className={`mono text-3xl font-bold tabular-nums ${pctClass(data.kospi.estimatedChangePercent)}`}>
                {fmtPct(data.kospi.estimatedChangePercent)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-caption)] mb-1">전일 종가</div>
              <div className="mono text-2xl font-semibold text-[var(--text-muted)] tabular-nums">
                {fmtNum(data.kospi.prevClose)}
              </div>
            </div>
          </div>
          <p className="mono text-[10px] text-[var(--text-caption)] mt-4 leading-relaxed">
            나스닥100 선물 등락률에 단순 가중한 추정치입니다. 실제 시초가는
            수급·개별 재료로 달라집니다. 투자 권유 아님 · 참고용.
          </p>
        </div>
      )}

      {/* 미국 증시 마감 */}
      <Section title="미국 증시 마감" desc="간밤 뉴욕 증시 종가">
        {data.usClose.map((q) => (
          <QuoteCard key={q.symbol} q={q} />
        ))}
      </Section>

      {/* 나스닥 선물 */}
      <Section title="미국 선물 (실시간)" desc="개장 전에도 움직이는 글로벌 방향">
        {data.futures.map((q) => (
          <QuoteCard key={q.symbol} q={q} />
        ))}
      </Section>

      {/* 환율 + 김프 */}
      <Section title="환율 · 위험선호" desc="외국인 수급·심리 보조 신호">
        {data.usdkrw && <QuoteCard q={data.usdkrw} />}
        {data.kimchi && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <div className="text-xs text-[var(--text-caption)] mb-1.5">김치프리미엄 (BTC)</div>
            <div className={`mono text-xl font-bold tabular-nums ${pctClass(data.kimchi.premiumPercent)}`}>
              {fmtPct(data.kimchi.premiumPercent)}
            </div>
            <div className="mono text-[10px] text-[var(--text-caption)] mt-1">
              업비트 vs 바이낸스×환율
            </div>
          </div>
        )}
      </Section>

      {/* 단일 전환 CTA */}
      <div className="mt-10">
        <TelegramCTA variant="banner" />
      </div>

      <p className="mono text-[10px] text-[var(--text-caption)] mt-10 leading-relaxed border-t border-[var(--border)] pt-5">
        데이터: Yahoo Finance(지수·선물·환율) · Upbit/Binance(김프). 지연·오차
        가능. 투자 판단과 책임은 투자자 본인에게 있습니다.
      </p>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
        <span className="text-xs text-[var(--text-caption)]">{desc}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
    </section>
  );
}
