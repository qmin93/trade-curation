"use client";

import { useMemo, useState } from "react";
import { useOperator } from "@/lib/use-operator";
import {
  PERSONAS,
  pickCaptionByPersona,
  type PickInput,
  type Persona,
} from "@/lib/pick-caption";

/**
 * 운영자 전용 픽 작성기 — `#op=` 해시로만 열린다.
 * 종목·포착가·목표가·근거를 입력하면 5계정 페르소나 본문을 즉시 생성, 계정별 복붙.
 * 방문자에겐 안내만 노출(폼·본문 숨김).
 */

const EMPTY: PickInput = {
  stockName: "",
  ticker: "",
  strategy: "",
  entry: "",
  stop: "",
  targets: ["", "", "", ""],
  note: "",
};

// 처음 열었을 때 감 잡기용 예시(오늘의 픽).
const EXAMPLE: PickInput = {
  stockName: "한온시스템",
  ticker: "018880",
  strategy: "종일용 · 09:08 포착",
  entry: "5,230",
  stop: "5,070 (-3.1%)",
  targets: ["1차 5,280 (+1.0%)", "2차 5,360 (+2.5%)", "3차 5,460 (+4.5%)", "4차 5,590 (+7.0%)"],
  note: "일봉 +11.7%로 5·20일선 위, 분봉 VWAP(5,217원) 위 유지",
};

function todayMMDD(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function OpsPickPage() {
  const isOperator = useOperator();
  const [pick, setPick] = useState<PickInput>(EXAMPLE);
  const [copied, setCopied] = useState<Persona | null>(null);
  const mmdd = useMemo(() => todayMMDD(), []);

  const captions = useMemo(
    () =>
      PERSONAS.map((p) => ({
        persona: p,
        text: pickCaptionByPersona(pick, p, mmdd),
      })),
    [pick, mmdd],
  );

  const set = <K extends keyof PickInput>(key: K, value: PickInput[K]) =>
    setPick((prev) => ({ ...prev, [key]: value }));

  const setTarget = (i: number, value: string) =>
    setPick((prev) => {
      const targets = [...prev.targets];
      targets[i] = value;
      return { ...prev, targets };
    });

  const copy = async (persona: Persona, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(persona);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!isOperator) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">
            운영자 전용
          </div>
          <p className="text-[var(--text-muted)] text-sm">
            이 페이지는 운영자만 볼 수 있습니다.
          </p>
        </div>
      </main>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:border-[var(--accent)] focus:outline-none";
  const labelCls =
    "mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5 block";

  return (
    <main className="min-h-screen px-5 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-1">
            운영자 전용 · 픽 작성기
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">
            오늘의 픽 → Threads 본문
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            종목·가격·근거를 넣으면 5계정 페르소나 본문이 바로 만들어집니다. 계정별로 복붙하세요.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* ───── 입력 폼 ───── */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>종목명</label>
                <input
                  className={inputCls}
                  value={pick.stockName}
                  onChange={(e) => set("stockName", e.target.value)}
                  placeholder="한온시스템"
                />
              </div>
              <div>
                <label className={labelCls}>티커</label>
                <input
                  className={inputCls}
                  value={pick.ticker}
                  onChange={(e) => set("ticker", e.target.value)}
                  placeholder="018880"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>전략 · 포착</label>
              <input
                className={inputCls}
                value={pick.strategy}
                onChange={(e) => set("strategy", e.target.value)}
                placeholder="종일용 · 09:08 포착"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>포착가</label>
                <input
                  className={inputCls}
                  value={pick.entry}
                  onChange={(e) => set("entry", e.target.value)}
                  placeholder="5,230"
                />
              </div>
              <div>
                <label className={labelCls}>손절 (괄호 % 포함 가능)</label>
                <input
                  className={inputCls}
                  value={pick.stop}
                  onChange={(e) => set("stop", e.target.value)}
                  placeholder="5,070 (-3.1%)"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>목표가 (한 줄에 하나)</label>
              <div className="space-y-2">
                {pick.targets.map((t, i) => (
                  <input
                    key={i}
                    className={inputCls}
                    value={t}
                    onChange={(e) => setTarget(i, e.target.value)}
                    placeholder={`${i + 1}차 ${["5,280 (+1.0%)", "5,360 (+2.5%)", "5,460 (+4.5%)", "5,590 (+7.0%)"][i] ?? ""}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>근거 메모 (한두 줄)</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={pick.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="일봉 +11.7%로 5·20일선 위, 분봉 VWAP(5,217원) 위 유지"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setPick(EMPTY)}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                비우기
              </button>
              <button
                onClick={() => setPick(EXAMPLE)}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                예시 채우기
              </button>
            </div>
          </section>

          {/* ───── 생성된 본문 ───── */}
          <section className="space-y-4">
            {captions.map(({ persona, text }) => (
              <div
                key={persona}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    {persona}
                  </span>
                  <button
                    onClick={() => copy(persona, text)}
                    className="rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
                  >
                    {copied === persona ? "복사됨 ✓" : "복사"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text)]">
                  {text}
                </pre>
              </div>
            ))}
            <p className="mono text-[10px] text-[var(--text-caption)]">
              계정마다 15~30분 간격으로, 차트 이미지(분봉/일봉)와 함께 게시 권장.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
