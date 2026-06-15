"use client";

import { useMemo, useState } from "react";
import { generateFormatPost, type FormatId } from "@/lib/threads-formats";
import { PERSONAS, type Persona } from "@/lib/threads-caption";

/**
 * 뉴스 기사 팝업 안의 콘솔급 생성기 — 운영 콘솔(/ops)을 뉴스 본문 생성기에 합친 것.
 * 그 기사(종목·헤드라인)를 입력으로 5계정 본문 + 🔄변주 + 편집 + 복사 + CTA토글.
 * 좁은 모달에 맞춘 세로 스택. 운영자에게만 NewsModal이 렌더한다.
 */
const FMTS: { id: FormatId; label: string }[] = [
  { id: "news", label: "뉴스 본문" },
  { id: "question", label: "질문형" },
];

export function NewsStudio({ subj, headline }: { subj: string; headline: string }) {
  const mmdd = useMemo(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  }, []);
  const [fmt, setFmt] = useState<FormatId>("news");
  const [withCTA, setWithCTA] = useState(true);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");

  const input = { subj, noteA: headline };
  const k = (p: Persona) => `${fmt}:${p}`;
  const base = (p: Persona) => generateFormatPost(fmt, input, p, mmdd, variants[k(p)] ?? 0, withCTA);
  const text = (p: Persona) => edited[k(p)] ?? base(p);

  const setFormat = (id: FormatId) => { setFmt(id); setEdited({}); };
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
  const copy = async (p: Persona) => {
    await navigator.clipboard.writeText(text(p));
    setCopied(k(p));
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="mt-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-3">
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">✍️ Threads 본문 생성 · 운영자</span>
        <button onClick={bumpAll} className="rounded-md border border-[var(--accent)] px-2 py-1 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.06]">🔄 전체</button>
      </div>

      {/* 포맷 + CTA */}
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

      {/* 5계정 블록 */}
      <div className="space-y-2.5">
        {PERSONAS.map((p) => (
          <div key={p} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">{p}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => bump(p)} className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text)]" title="변주">🔄</button>
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
      <p className="mono text-[9px] text-[var(--text-caption)] mt-2">기사 클릭 한 번으로 5계정 본문. 🔄 변주·직접 편집 가능. 카드 캡처 + 본문 복사 → Threads.</p>
    </div>
  );
}
