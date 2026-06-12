import { ACTIVE_PICK } from "@/lib/picks";

/**
 * 이미지 공방 — Threads 올릴 카드 미리보기 + 다운로드.
 * 차트·뉴스 캡처를 수동으로 하지 않고 여기서 바로 1080×1080 카드를 받는다.
 */
export const metadata = {
  title: "이미지 공방 · 카드 생성",
  description: "Threads용 종목·뉴스·픽·성과 카드를 사이트에서 바로 생성·다운로드.",
};

export const dynamic = "force-dynamic";

const sampleNews = {
  headline: "코스피, 외인 순매수에 2,900선 회복…반도체 주도",
  summary:
    "외국인이 반도체 대형주를 중심으로 순매수에 나서며 지수가 반등했습니다. 단기 수급이 우호적으로 돌아선 흐름입니다.",
  source: "연합뉴스",
};

function q(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

const CARDS: { key: string; title: string; desc: string; query: string }[] = [
  {
    key: "chart",
    title: "종목 차트 카드",
    desc: "네이버 차트 + 종목명·등락률. 급등주 글용.",
    query: q({ name: "삼성전자", ticker: "005930", change: "12.21", note: "외인 순매수에 갭 상승·거래량 폭증" }),
  },
  {
    key: "news",
    title: "뉴스 카드",
    desc: "헤드라인·요약·출처. 뉴스 글용.",
    query: q(sampleNews),
  },
  {
    key: "pick",
    title: "오늘의 픽 카드",
    desc: "진입·목표·손절. 픽 글용. (오늘 픽 자동 반영)",
    query: q({
      name: ACTIVE_PICK?.stockName ?? "샘씨엔에스",
      ticker: ACTIVE_PICK?.ticker ?? "252990",
      entry: ACTIVE_PICK?.entry ?? "16,210",
      target: ACTIVE_PICK?.targets?.[0] ?? "1차 +1.4%",
      stop: "15,560",
    }),
  },
  {
    key: "perf",
    title: "성과 카드",
    desc: "누적 수익률·승률. 신뢰 글용. (실데이터 자동)",
    query: "",
  },
];

export default function StudioPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
        Image Studio
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        이미지 공방
      </h1>
      <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed mb-3">
        Threads에 올릴 카드를 여기서 바로 받습니다. 차트·뉴스를 직접 캡처할
        필요 없이, 미리보기에서 우클릭 저장 또는 아래 다운로드 버튼을 쓰세요.
      </p>
      <div className="flex items-center gap-3 text-xs text-[var(--text-caption)] mb-10">
        <span className="rounded-md bg-[var(--bg-subtle)] px-2.5 py-1">
          무브랜드 = 페르소나용 (정체 보호)
        </span>
        <span className="rounded-md bg-[var(--accent)]/10 px-2.5 py-1 text-[var(--accent)]">
          브랜드 = 사이트 워터마크 (유입)
        </span>
      </div>

      <div className="space-y-14">
        {CARDS.map((c) => {
          const base = `/api/card/${c.key}${c.query ? `?${c.query}` : ""}`;
          const noBrand = `${base}${c.query ? "&" : "?"}brand=0`;
          const brand = `${base}${c.query ? "&" : "?"}brand=1`;
          return (
            <section key={c.key}>
              <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-[var(--border)]">
                <h2 className="text-lg font-bold text-[var(--text)]">{c.title}</h2>
                <span className="text-xs text-[var(--text-caption)]">{c.desc}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { label: "무브랜드 (페르소나용)", src: noBrand, file: `${c.key}.png` },
                  { label: "브랜드 (유입용)", src: brand, file: `${c.key}-brand.png` },
                ].map((v) => (
                  <div key={v.label} className="flex flex-col gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.src}
                      alt={v.label}
                      className="w-full rounded-xl border border-[var(--border)]"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">{v.label}</span>
                      <a
                        href={v.src}
                        download={v.file}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                      >
                        ↓ 다운로드
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mono text-[10px] text-[var(--text-caption)] mt-12 leading-relaxed">
        차트·뉴스·픽 카드는 URL 파라미터로 내용을 바꿀 수 있습니다. 예:
        /api/card/chart?name=SK하이닉스&ticker=000660&change=8.3&brand=1
      </p>
    </div>
  );
}
