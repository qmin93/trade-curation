"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useOperator } from "@/lib/use-operator";
import {
  PERSONAS,
  pickCaptionByPersona,
  parsePickNote,
  type PickInput,
  type Persona,
} from "@/lib/pick-caption";
import { FormatStudio } from "@/components/FormatStudio";

/**
 * 운영 콘솔 본체 — 픽 입력 + 콘텐츠 포맷. `/ops` 페이지와 홈 팝업(ConsolePopup)이 공유.
 * embedded=true → 팝업용(전체화면 wrapper·헤더 제거).
 */

const OPS_SECRET = "qmin-ops-2026";
const LOCAL_KEY = "ops-draft-current";

const TRAFFIC_KEYWORDS = [
  "삼성전자", "SK하이닉스", "HBM", "코스피", "반도체",
  "외인 순매수", "휴머노이드", "원전", "AI 데이터센터", "2차전지",
];

const EMPTY: PickInput = {
  stockName: "", ticker: "", strategy: "", entry: "", stop: "",
  targets: ["", "", "", ""], note: "",
};
const EXAMPLE: PickInput = {
  stockName: "예스티", ticker: "122640", strategy: "세력감지 · 12:00",
  entry: "32,100", stop: "30,800 (-4.0%)",
  targets: ["1차 32,500 (+1.4%)", "2차 33,150 (+3.4%)", "3차 33,850 (+5.5%)", "4차 34,450 (+7.4%)"],
  note: "일봉 +8.4%로 5·20일선 위, 분봉 VWAP(30,892원) 위, 단기 이평 정배열·중기 추세선 위",
};

function kstToday(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
function todayMMDD(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

interface TrendStock { rank: number; name: string; ticker: string; changePercent: number; direction: string; }
interface CloudDraft { id: string; label: string; pick_date: string; payload: { pick: PickInput; bodies: Record<string, string> }; updated_at: string; }

export function ConsoleBody({ embedded = false }: { embedded?: boolean }) {
  const isOperator = useOperator();
  const mmdd = useMemo(() => todayMMDD(), []);

  const [mode, setMode] = useState<"pick" | "format">("pick");
  const [pick, setPick] = useState<PickInput>(EXAMPLE);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState(false);
  const [busy, setBusy] = useState<Persona | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [copied, setCopied] = useState<Persona | null>(null);
  const [withPrices, setWithPrices] = useState(false); // 기본 게이팅(Threads). 켜면 유료 텔레그램용 정확한 가 포함.
  const [hookMode, setHookMode] = useState(false); // 트래픽 후킹형(첫 줄 호기심+댓글 유발) ↔ 관찰형(기본)

  const [trending, setTrending] = useState<TrendStock[]>([]);
  const [drafts, setDrafts] = useState<CloudDraft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [label, setLabel] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(LOCAL_KEY);
      if (s) {
        const o = JSON.parse(s);
        if (o.pick) setPick(o.pick);
        if (o.edited) setEdited(o.edited);
        if (o.variants) setVariants(o.variants);
      }
    } catch { /* noop */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ pick, edited, variants }));
    } catch { /* noop */ }
  }, [pick, edited, variants, loaded]);

  const loadDraftsList = useCallback(async () => {
    try {
      const res = await fetch("/api/ops/drafts", { headers: { "x-ops-secret": OPS_SECRET } });
      const data = await res.json();
      if (data.ok) setDrafts(data.drafts ?? []);
      else if (data.error) setErrMsg(`불러오기: ${data.error}`);
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!isOperator) return;
    fetch("/api/ops/trending")
      .then((r) => r.json())
      .then((d) => setTrending(d.stocks ?? []))
      .catch(() => {});
    loadDraftsList();
  }, [isOperator, loadDraftsList]);

  const set = <K extends keyof PickInput>(k: K, v: PickInput[K]) => setPick((p) => ({ ...p, [k]: v }));
  const setTarget = (i: number, v: string) =>
    setPick((p) => { const t = [...p.targets]; t[i] = v; return { ...p, targets: t }; });

  const replacePick = (next: PickInput, resetBodies = true) => {
    setPick(next);
    if (resetBodies) { setEdited({}); setVariants({}); }
  };

  const randomVariants = () =>
    Object.fromEntries(PERSONAS.map((p) => [p, Math.floor(Math.random() * 90)]));

  const applyRaw = () => {
    if (!raw.trim()) return;
    setPick(parsePickNote(raw));
    setEdited({});
    setVariants(randomVariants());
    setParsed(true);
    setTimeout(() => setParsed(false), 2000);
  };

  const baseText = useCallback(
    (p: Persona) => pickCaptionByPersona(pick, p, mmdd, variants[p] ?? 0, false, withPrices, hookMode),
    [pick, mmdd, variants, withPrices, hookMode],
  );
  const displayText = (p: Persona) => edited[p] ?? baseText(p);

  const bump = (p: Persona) => {
    setVariants((v) => ({ ...v, [p]: (v[p] ?? 0) + 1 + Math.floor(Math.random() * 7) }));
    setEdited((e) => { const n = { ...e }; delete n[p]; return n; });
  };
  const bumpAll = () => {
    setVariants(randomVariants());
    setEdited({});
  };

  const refine = async (p: Persona) => {
    setBusy(p); setErrMsg("");
    try {
      const res = await fetch("/api/refine-pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: p, draft: displayText(p) }),
      });
      const data = await res.json();
      if (data.refined) setEdited((e) => ({ ...e, [p]: data.refined }));
      if (!data.ok) setErrMsg(data.error ? `AI 다듬기 미적용: ${data.error}` : "AI 다듬기 미적용");
    } catch (e) {
      setErrMsg(`요청 실패: ${String(e).slice(0, 80)}`);
    } finally { setBusy(null); }
  };

  const copy = async (p: Persona) => {
    await navigator.clipboard.writeText(displayText(p));
    setCopied(p); setTimeout(() => setCopied(null), 1500);
  };

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1500); };
  const copyText = async (t: string) => { await navigator.clipboard.writeText(t); flash(`복사됨: ${t}`); };

  const saveCloud = async () => {
    setSaveStatus("saving"); setErrMsg("");
    const bodies = Object.fromEntries(PERSONAS.map((p) => [p, displayText(p)]));
    const id = `${(pick.ticker || pick.stockName || "pick").trim()}-${kstToday()}`;
    const draft = {
      id,
      label: label.trim() || `${pick.stockName} ${pick.ticker}`.trim() || "무제",
      pickDate: kstToday(),
      payload: { pick, bodies },
      updatedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/ops/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ops-secret": OPS_SECRET },
        body: JSON.stringify({ draft }),
      });
      const data = await res.json();
      if (data.ok) { setSaveStatus("saved"); loadDraftsList(); }
      else { setSaveStatus("error"); setErrMsg(`클라우드 저장 실패: ${data.error}`); }
    } catch (e) { setSaveStatus("error"); setErrMsg(String(e).slice(0, 80)); }
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const loadDraft = (d: CloudDraft) => {
    replacePick(d.payload.pick, false);
    setEdited(d.payload.bodies ?? {});
    setVariants({});
    setShowDrafts(false);
    flash("불러왔습니다");
  };
  const deleteDraft = async (id: string) => {
    await fetch(`/api/ops/drafts?id=${encodeURIComponent(id)}&op=${OPS_SECRET}`, { method: "DELETE" });
    loadDraftsList();
  };

  const exportBackup = () => {
    const bodies = Object.fromEntries(PERSONAS.map((p) => [p, displayText(p)]));
    const blob = new Blob([JSON.stringify({ pick, bodies, savedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pick-${(pick.ticker || "draft")}-${kstToday()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:border-[var(--accent)] focus:outline-none";
  const labelCls = "mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5 block";

  if (!isOperator) {
    return embedded ? null : (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mono text-xs uppercase tracking-widest text-[var(--text-caption)] mb-2">운영자 전용</div>
          <p className="text-[var(--text-muted)] text-sm">이 페이지는 운영자만 볼 수 있습니다.</p>
        </div>
      </main>
    );
  }

  const inner = (
    <div className={embedded ? "" : "mx-auto max-w-5xl"}>
      {!embedded && (
        <header className="mb-6">
          <div className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-1">운영자 콘솔 · 작성·저장</div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">Threads 복붙 스튜디오</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            <span className="text-[var(--text)]">오늘의 픽</span> + <span className="text-[var(--text)]">콘텐츠 포맷</span>(질문형·격언·타래·일상·결과인증·뉴스)을 페르소나 톤으로 뽑아 복붙. 변주·자동저장·클라우드 저장.
          </p>
        </header>
      )}

      {/* ── 트래픽 패널 ── */}
      <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">📈 트래픽 큰 주제</span>
          <span className="mono text-[9px] text-[var(--text-caption)]">클릭 = 복사 · 항상 고검색 키워드로</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TRAFFIC_KEYWORDS.map((kw) => (
            <button key={kw} onClick={() => copyText(kw)} className="rounded-full bg-[var(--accent)]/[0.08] border border-[var(--accent)]/25 px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.15]">
              {kw}
            </button>
          ))}
        </div>
        <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5">🔥 실시간 급등·인기검색 (클릭 = 종목 채우기)</div>
        {trending.length === 0 ? (
          <p className="text-xs text-[var(--text-caption)]">불러오는 중…</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {trending.map((s) => {
              const up = s.direction === "up";
              return (
                <button
                  key={s.ticker}
                  onClick={() => setPick((p) => ({ ...p, stockName: s.name, ticker: s.ticker }))}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-1 text-[11px] hover:border-[var(--accent)]"
                >
                  <span className="mono text-[var(--text-caption)] tabular-nums">{s.rank}</span>
                  <span className="font-medium text-[var(--text)]">{s.name}</span>
                  <span className={`mono tabular-nums font-semibold ${up ? "text-[var(--red)]" : s.direction === "down" ? "text-[var(--green)]" : "text-[var(--text-muted)]"}`}>
                    {up ? "+" : ""}{s.changePercent.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 탭 ── */}
      <div className="mb-6 flex gap-1.5">
        {([["pick", "오늘의 픽"], ["format", "콘텐츠 포맷"]] as const).map(([m, lbl]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              mode === m ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {mode === "format" && <FormatStudio mmdd={mmdd} />}

      {mode === "pick" && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* ── 입력 폼 ── */}
          <section className="space-y-4">
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-3">
              <label className={labelCls}>📋 픽 노트 붙여넣기</label>
              <textarea
                className={`${inputCls} resize-none font-mono text-[12px] leading-relaxed`} rows={6}
                value={raw} onChange={(e) => setRaw(e.target.value)}
                placeholder={"🐋 세력 포착 노트를 통째로 붙여넣고 아래 버튼을 누르세요."}
              />
              <button onClick={applyRaw} className="mt-2 rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                {parsed ? "채워짐 ✓" : "↓ 자동 채우기"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>종목명</label><input className={inputCls} value={pick.stockName} onChange={(e) => set("stockName", e.target.value)} /></div>
              <div><label className={labelCls}>티커</label><input className={inputCls} value={pick.ticker} onChange={(e) => set("ticker", e.target.value)} /></div>
            </div>
            <div><label className={labelCls}>전략 · 포착</label><input className={inputCls} value={pick.strategy} onChange={(e) => set("strategy", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>포착가</label><input className={inputCls} value={pick.entry} onChange={(e) => set("entry", e.target.value)} /></div>
              <div><label className={labelCls}>손절</label><input className={inputCls} value={pick.stop} onChange={(e) => set("stop", e.target.value)} /></div>
            </div>
            <div>
              <label className={labelCls}>목표가 (한 줄에 하나)</label>
              <div className="space-y-2">
                {pick.targets.map((t, i) => (
                  <input key={i} className={inputCls} value={t} onChange={(e) => setTarget(i, e.target.value)} placeholder={`${i + 1}차`} />
                ))}
              </div>
            </div>
            <div><label className={labelCls}>근거 메모</label><textarea className={`${inputCls} resize-none`} rows={3} value={pick.note} onChange={(e) => set("note", e.target.value)} /></div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => replacePick(EMPTY)} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">비우기</button>
              <button onClick={() => replacePick(EXAMPLE)} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">예시</button>
              <button onClick={bumpAll} className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.06]">🔄 전체 변주</button>
              <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none ml-1" title="첫 줄 호기심 갭 + 댓글 유발. 새 팔로워·도달용. (가격은 항상 게이팅)">
                <input type="checkbox" checked={hookMode} onChange={(e) => { setHookMode(e.target.checked); setEdited({}); }} className="accent-[var(--accent)]" />
                🎯 트래픽 후킹형
              </label>
              <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none ml-1" title="기본 OFF = Threads용(가격 게이팅). 켜면 유료 텔레그램용으로 포착·목표·손절가 포함.">
                <input type="checkbox" checked={withPrices} disabled={hookMode} onChange={(e) => { setWithPrices(e.target.checked); setEdited({}); }} className="accent-[var(--accent)] disabled:opacity-40" />
                💰 가격 포함(유료방용)
              </label>
            </div>
            <p className="mono text-[9px] text-[var(--text-caption)]">
              {hookMode
                ? "🎯 트래픽 후킹형 — 첫 줄 호기심+댓글 유발(새 팔로워·도달용). 가격 게이팅 고정."
                : withPrices
                ? "⚠️ 정확한 진입·목표·손절가 포함 — 유료 텔레그램방 전용. Threads엔 올리지 마세요."
                : "🔒 관찰형(Threads) — 정확한 가는 빠짐(포착·자리·근거만). 가격은 유료방 가치."}
            </p>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3 space-y-2.5">
              <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">💾 저장</div>
              <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="저장 라벨 (비우면 종목명)" />
              <div className="flex flex-wrap gap-2">
                <button onClick={saveCloud} className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                  {saveStatus === "saving" ? "저장 중…" : saveStatus === "saved" ? "클라우드 저장됨 ✓" : saveStatus === "error" ? "실패" : "☁️ 클라우드 저장"}
                </button>
                <button onClick={() => { setShowDrafts((s) => !s); loadDraftsList(); }} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
                  📂 불러오기 ({drafts.length})
                </button>
                <button onClick={exportBackup} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">⬇️ 백업</button>
              </div>
              <p className="mono text-[9px] text-[var(--text-caption)]">이 기기에 자동 저장됨 · 클라우드는 어디서나 복원</p>

              {showDrafts && (
                <div className="space-y-1.5 pt-1">
                  {drafts.length === 0 ? (
                    <p className="text-xs text-[var(--text-caption)]">저장된 글 없음 (또는 Supabase 테이블 미설정)</p>
                  ) : drafts.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-1.5">
                      <button onClick={() => loadDraft(d)} className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-semibold text-[var(--text)] truncate">{d.label}</div>
                        <div className="mono text-[9px] text-[var(--text-caption)]">{d.pick_date} · {d.updated_at?.slice(11, 16)}</div>
                      </button>
                      <button onClick={() => deleteDraft(d.id)} aria-label="삭제" className="text-[var(--text-caption)] hover:text-[var(--red)] text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── 생성·편집 본문 ── */}
          <section className="space-y-4">
            {errMsg && <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.08] px-3 py-2 text-xs text-amber-600">{errMsg}</div>}
            {PERSONAS.map((p) => (
              <div key={p} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
                <div className="flex items-center justify-between mb-2.5 gap-2">
                  <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] flex items-center gap-1.5">
                    {p}{edited[p] !== undefined && <span className="text-[var(--text-caption)]">· 편집됨</span>}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => bump(p)} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]" title="말투 변주(편집 초기화)">🔄</button>
                    <button onClick={() => refine(p)} disabled={busy === p} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50">{busy === p ? "…" : "✨ AI"}</button>
                    <button onClick={() => copy(p)} className="rounded-md bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90">{copied === p ? "복사됨 ✓" : "복사"}</button>
                  </div>
                </div>
                <textarea
                  value={displayText(p)}
                  onChange={(e) => setEdited((s) => ({ ...s, [p]: e.target.value }))}
                  rows={Math.max(6, displayText(p).split("\n").length + 1)}
                  className="w-full resize-y rounded-lg border border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] focus:outline-none bg-transparent font-sans text-sm leading-relaxed text-[var(--text)] p-1"
                />
              </div>
            ))}
            <p className="mono text-[10px] text-[var(--text-caption)]">붙여넣을 때마다 길이·말투가 새로 뽑힙니다. 🔄로 짧게/길게 다시 돌리고, 직접 고치면 그대로 저장됩니다.</p>
          </section>
        </div>
      )}
    </div>
  );

  const toastEl = toast ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] rounded-lg bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg-elevated)] shadow-lg">{toast}</div>
  ) : null;

  if (embedded) {
    return <>{inner}{toastEl}</>;
  }
  return (
    <main className="min-h-screen px-5 py-10 md:px-8">
      {inner}
      {toastEl}
    </main>
  );
}
