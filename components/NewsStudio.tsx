"use client";

import { useMemo, useState } from "react";
import { generateFormatPost, type FormatId } from "@/lib/threads-formats";
import { PERSONAS, type Persona } from "@/lib/threads-caption";

/**
 * 뉴스 기사 팝업 안의 콘솔급 생성기 — 운영 콘솔(/ops)을 뉴스 본문 생성기에 합친 것.
 * 그 기사로 5계정 본문 + 🔄변주(규칙) + ✨AI(claude가 기사 읽고 작성) + 편집 + 복사 + CTA토글.
 */
const FMTS: { id: FormatId; label: string }[] = [
  { id: "news", label: "뉴스 본문" },
  { id: "question", label: "질문형" },
];

export function NewsStudio({
  subj,
  headline,
  summary = "",
  stocks = [],
}: {
  subj: string;
  headline: string;
  summary?: string;
  stocks?: string[];
}) {
  const mmdd = useMemo(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const [fmt, setFmt] = useState<FormatId>("news");
  const [withCTA, setWithCTA] = useState(true);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string>("");
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");

  const input = { subj, noteA: headline };
  const k = (p: Persona) => `${fmt}:${p}`;
  const base = (p: Persona) => generateFormatPost(fmt, input, p, mmdd, variants[k(p)] ?? 0, withCTA);
  const text = (p: Persona) => edited[k(p)] ?? base(p);

  const setFormat = (id: FormatId) => { setFmt(id); setEdited({}); setErr(""); };
  const bump = (p: Persona) => {
    setVariants((v) => ({ ...v, [k(p)]: (v[k(p)] ?? 0) + 1 + Math.floor(Math.random() * 5) }));
    setEdited((e) => { const n = { ...e }; delete n[k(p)]; return n; });
  };
  const bumpAll = () =>
    setVariants((v) => {
      const n = { ...v };
      for (const p of PERSONAS) n[k(p)] = (n[k(p)] ?? 0) + 1 + Math.floor(Math.random() * 5);
      return n;
    });

  // ✨ claude가 기사 읽고 작성
  const ai = async (p: Persona) => {
    setBusy(k(p)); setErr("");
    try {
      const res = await fetch("/api/news-body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: p, fmt, headline, summary, stocks, mmdd, withCTA,
          variant: variants[k(p)] ?? 0,
        }),
      });
      const data = await res.json();
      if (data.ok && data.body) setEdited((e) => ({ ...e, [k(p)]: data.body }));
      else setErr(data.error ? `AI 미적용: ${data.error}` : "AI 미적용");
    } catch (e) {
      setErr(`요청 실패: ${String(e).slice(0, 70)}`);
    } finally { setBusy(""); }
  };
  const aiAll = async () => { for (const p of PERSONAS) await ai(p); };

  const copy = async (p: Persona) => {
    await navigator.clipboard.writeText(text(p));
    setCopied(k(p));
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="mt-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-3">
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">✍️ Threads 본문 · 운영자</span>
        <div className="flex items-center gap-1.5">
          <button onClick={aiAll} className="rounded-md border border-[var(--accent)] px-2 py-1 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.08]">✨ 전체 AI</button>
          <button onClick={bumpAll} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">🔄 전체</button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
        {FMTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              fmt === f.id ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {f.label}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] cursor-pointer select-none">
          <input type="checkbox" checked={withCTA} onChange={(e) => setWithCTA(e.target.checked)} className="accent-[var(--accent)]" />
          CTA
        </label>
      </div>

      {err && <div className="mb-2 rounded-md border border-amber-500/40 bg-amber-500/[0.08] px-2.5 py-1.5 text-[11px] text-amber-600">{err}</div>}

      <div className="space-y-2.5">
        {PERSONAS.map((p) => (
          <div key={p} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] flex items-center gap-1">
                {p}{edited[k(p)] !== undefined && <span className="text-[var(--text-caption)]">· 편집됨</span>}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => ai(p)} disabled={busy === k(p)} className="rounded border border-[var(--accent)]/50 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.08] disabled:opacity-50" title="claude가 기사 읽고 작성">
                  {busy === k(p) ? "…" : "✨ AI"}
                </button>
                <button onClick={() => bump(p)} className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text)]" title="규칙 변주">🔄</button>
                <button onClick={() => copy(p)} className="rounded bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white hover:opacity-90">{copied === k(p) ? "✓" : "복사"}</button>
              </div>
            </div>
            <textarea
              value={text(p)}
              onChange={(e) => setEdited((s) => ({ ...s, [k(p)]: e.target.value }))}
              rows={Math.max(4, text(p).split("\n").length + 1)}
              className="w-full resize-y rounded border border-transparent focus:border-[var(--accent)] focus:outline-none bg-transparent font-sans text-[13px] leading-relaxed text-[var(--text)] p-1"
            />
          </div>
        ))}
      </div>
      <p className="mono text-[9px] text-[var(--text-caption)] mt-2">✨AI=claude가 기사 읽고 페르소나 톤으로 새로 씀(읽고 요약). 🔄=규칙 변주(무료). 텔레그램 링크는 본문 말고 첫 댓글에.</p>
    </div>
  );
}
