"use client";

import { useMemo, useState } from "react";
import { useOperator } from "@/lib/use-operator";
import {
  PERSONAS,
  pickCaptionByPersona,
  parsePickNote,
  type PickInput,
  type Persona,
} from "@/lib/pick-caption";

/**
 * 운영자 전용 픽 작성기 — `#op=` 해시로만 열린다.
 * 종목·포착가·목표가·근거를 입력하면 5계정 페르소나 본문을 즉시 생성, 계정별 복붙.
 * 🔄 변주(규칙 기반 회전) + ✨ AI 다듬기(Claude) 지원.
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
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState(false);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [refined, setRefined] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Persona | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const [copied, setCopied] = useState<Persona | null>(null);
  const mmdd = useMemo(() => todayMMDD(), []);

  // 입력이 바뀌면 AI 다듬기 결과는 무효화(가격이 어긋나지 않게).
  const updatePick = (next: PickInput) => {
    setPick(next);
    setRefined({});
  };
  const set = <K extends keyof PickInput>(key: K, value: PickInput[K]) =>
    updatePick({ ...pick, [key]: value });
  const setTarget = (i: number, value: string) => {
    const targets = [...pick.targets];
    targets[i] = value;
    updatePick({ ...pick, targets });
  };

  const applyRaw = () => {
    if (!raw.trim()) return;
    updatePick(parsePickNote(raw));
    setVariants({});
    setParsed(true);
    setTimeout(() => setParsed(false), 2000);
  };

  const baseText = (p: Persona) =>
    pickCaptionByPersona(pick, p, mmdd, variants[p] ?? 0);
  const displayText = (p: Persona) => refined[p] ?? baseText(p);

  const bump = (p: Persona) => {
    setVariants((v) => ({ ...v, [p]: (v[p] ?? 0) + 1 }));
    setRefined((r) => {
      const next = { ...r };
      delete next[p];
      return next;
    });
  };

  const bumpAll = () => {
    setVariants((v) => {
      const next = { ...v };
      for (const p of PERSONAS) next[p] = (next[p] ?? 0) + 1;
      return next;
    });
    setRefined({});
  };

  const refine = async (p: Persona) => {
    setBusy(p);
    setErrMsg("");
    try {
      const res = await fetch("/api/refine-pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: p, draft: baseText(p) }),
      });
      const data = await res.json();
      if (data.refined) setRefined((r) => ({ ...r, [p]: data.refined }));
      if (!data.ok) setErrMsg(data.error ? `AI 다듬기 미적용: ${data.error}` : "AI 다듬기 미적용");
    } catch (e) {
      setErrMsg(`요청 실패: ${String(e).slice(0, 80)}`);
    } finally {
      setBusy(null);
    }
  };

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
            종목·가격·근거를 넣으면 5계정 페르소나 본문이 바로 만들어집니다.{" "}
            <span className="text-[var(--text)]">🔄 변주</span>는 말투를 다르게 뽑고,{" "}
            <span className="text-[var(--text)]">✨ AI 다듬기</span>는 더 자연스럽게 손봅니다.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* ───── 입력 폼 ───── */}
          <section className="space-y-4">
            {/* 픽 노트 붙여넣기 → 자동 채우기 */}
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-3">
              <label className={labelCls}>📋 픽 노트 붙여넣기</label>
              <textarea
                className={`${inputCls} resize-none font-mono text-[12px] leading-relaxed`}
                rows={6}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder={"🐋 세력 포착 노트를 통째로 붙여넣고 아래 버튼을 누르세요.\n예) 예스티 122640 / 세력감지 12:00 / 💰 포착가 32,100원 / 🎯 목표가 1차 … / ⚠️ 손절 …"}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={applyRaw}
                  className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  {parsed ? "채워짐 ✓" : "↓ 자동 채우기"}
                </button>
                <span className="mono text-[10px] text-[var(--text-caption)]">
                  붙여넣으면 아래 칸이 자동으로 채워집니다. 어색한 칸은 직접 수정하세요.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>종목명</label>
                <input className={inputCls} value={pick.stockName} onChange={(e) => set("stockName", e.target.value)} placeholder="한온시스템" />
              </div>
              <div>
                <label className={labelCls}>티커</label>
                <input className={inputCls} value={pick.ticker} onChange={(e) => set("ticker", e.target.value)} placeholder="018880" />
              </div>
            </div>

            <div>
              <label className={labelCls}>전략 · 포착</label>
              <input className={inputCls} value={pick.strategy} onChange={(e) => set("strategy", e.target.value)} placeholder="종일용 · 09:08 포착" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>포착가</label>
                <input className={inputCls} value={pick.entry} onChange={(e) => set("entry", e.target.value)} placeholder="5,230" />
              </div>
              <div>
                <label className={labelCls}>손절 (% 포함 가능)</label>
                <input className={inputCls} value={pick.stop} onChange={(e) => set("stop", e.target.value)} placeholder="5,070 (-3.1%)" />
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

            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => updatePick(EMPTY)} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
                비우기
              </button>
              <button onClick={() => updatePick(EXAMPLE)} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
                예시 채우기
              </button>
              <button onClick={bumpAll} className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.06]">
                🔄 전체 변주
              </button>
            </div>
          </section>

          {/* ───── 생성된 본문 ───── */}
          <section className="space-y-4">
            {errMsg && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-600">
                {errMsg}
              </div>
            )}
            {PERSONAS.map((persona) => {
              const text = displayText(persona);
              return (
                <div key={persona} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] flex items-center gap-1.5">
                      {persona}
                      {refined[persona] && <span className="text-[var(--text-caption)]">· ✨다듬음</span>}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => bump(persona)} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]" title="말투 다르게 뽑기">
                        🔄 변주
                      </button>
                      <button onClick={() => refine(persona)} disabled={busy === persona} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50" title="Claude로 자연스럽게 다듬기">
                        {busy === persona ? "다듬는 중…" : "✨ AI 다듬기"}
                      </button>
                      <button onClick={() => copy(persona, text)} className="rounded-md bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90">
                        {copied === persona ? "복사됨 ✓" : "복사"}
                      </button>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text)]">
                    {text}
                  </pre>
                </div>
              );
            })}
            <p className="mono text-[10px] text-[var(--text-caption)]">
              계정마다 15~30분 간격으로, 차트 이미지(분봉/일봉)와 함께 게시 권장.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
