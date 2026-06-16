"use client";

import { useMemo, useState } from "react";
import {
  FORMATS,
  generateFormatPost,
  type FormatId,
} from "@/lib/threads-formats";
import type { Persona } from "@/lib/threads-caption";

/**
 * 운영자 콘솔 — 콘텐츠 포맷 스튜디오.
 * 질문형·격언·타래·일상일지·결과인증·뉴스 → 페르소나별 복붙 블록 생성.
 * 변주(🔄) + 텔레그램 CTA 토글 + 복사. 픽 작성기와 한 화면(/ops) 탭으로 공존.
 */
export function FormatStudio({ mmdd }: { mmdd: string }) {
  const [fmt, setFmt] = useState<FormatId>("question");
  const [input, setInput] = useState<{ subj: string; noteA: string; noteB: string }>({
    subj: "", noteA: "", noteB: "",
  });
  const [withCTA, setWithCTA] = useState(false);
  const [withDisc, setWithDisc] = useState(false);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string>("");
  const [paste, setPaste] = useState("");

  const meta = useMemo(() => FORMATS.find((f) => f.id === fmt)!, [fmt]);

  const key = (p: Persona) => `${fmt}:${p}`;
  const base = (p: Persona) =>
    generateFormatPost(fmt, input, p, mmdd, variants[key(p)] ?? 0, withCTA, withDisc);
  const text = (p: Persona) => edited[key(p)] ?? base(p);

  const pickFormat = (id: FormatId) => {
    setFmt(id);
    setInput({ subj: "", noteA: "", noteB: "" });
    setEdited({});
    setVariants({});
  };
  const setField = (k: "subj" | "noteA" | "noteB", v: string) => {
    setInput((s) => ({ ...s, [k]: v }));
    setEdited({}); // 입력 바뀌면 본문 새로
  };
  // 붙여넣은 원문(뉴스·메모·아이디어)을 현재 포맷의 입력칸에 자동 분배.
  const applyPaste = () => {
    const raw = paste.trim();
    if (!raw) return;
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    const keys = meta.fields.map((f) => f.key);
    const next = { subj: "", noteA: "", noteB: "" };
    if (keys.includes("subj")) {
      next.subj = lines[0] ?? "";
      const rest = lines.slice(1);
      if (keys.includes("noteB")) {
        next.noteA = rest[0] ?? "";
        next.noteB = rest.slice(1).join(" ");
      } else {
        next.noteA = rest.join(" ");
      }
    } else {
      // 종목칸 없는 포맷(격언·일상·리드마그넷) → 전체를 본문 노트로.
      next.noteA = raw;
    }
    setInput(next);
    setEdited({});
    setVariants({});
  };
  const bump = (p: Persona) => {
    setVariants((v) => ({ ...v, [key(p)]: (v[key(p)] ?? 0) + 1 + Math.floor(Math.random() * 5) }));
    setEdited((e) => { const n = { ...e }; delete n[key(p)]; return n; });
  };
  const bumpAll = () =>
    setVariants((v) => {
      const n = { ...v };
      for (const p of meta.personas) n[key(p)] = (n[key(p)] ?? 0) + 1 + Math.floor(Math.random() * 5);
      return n;
    });
  const copy = async (p: Persona) => {
    await navigator.clipboard.writeText(text(p));
    setCopied(key(p));
    setTimeout(() => setCopied(""), 1500);
  };

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:border-[var(--accent)] focus:outline-none";
  const labelCls = "mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5 block";

  return (
    <div className="space-y-5">
      {/* 포맷 선택 */}
      <div className="flex flex-wrap gap-1.5">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => pickFormat(f.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              fmt === f.id
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-[var(--text-muted)] -mt-2">{meta.desc}</p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* 입력 */}
        <section className="space-y-3">
          {/* 붙여넣기 → 자동 채우기 (픽 탭과 동일한 편의) */}
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-2.5">
            <label className={labelCls}>📋 붙여넣기 → 자동 채우기</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="뉴스·메모·아이디어를 통째로 붙여넣고 ↓ 누르세요. 첫 줄=종목/주제, 나머지=내용."
            />
            <button
              onClick={applyPaste}
              className="mt-2 w-full rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              ↓ 자동 채우기
            </button>
          </div>
          {meta.fields.map((fl) => (
            <div key={fl.key}>
              <label className={labelCls}>{fl.label}</label>
              {fl.area ? (
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={input[fl.key]}
                  onChange={(e) => setField(fl.key, e.target.value)}
                  placeholder={fl.placeholder}
                />
              ) : (
                <input
                  className={inputCls}
                  value={input[fl.key]}
                  onChange={(e) => setField(fl.key, e.target.value)}
                  placeholder={fl.placeholder}
                />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
              <input type="checkbox" checked={withCTA} onChange={(e) => setWithCTA(e.target.checked)} className="accent-[var(--accent)]" />
              채널 멘트
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
              <input type="checkbox" checked={withDisc} onChange={(e) => setWithDisc(e.target.checked)} className="accent-[var(--accent)]" />
              면책
            </label>
            <button onClick={bumpAll} className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/[0.06]">
              🔄 전체 변주
            </button>
          </div>
          <p className="mono text-[9px] text-[var(--text-caption)]">
            {fmt === "proof" ? "⚠️ 결과 인증은 손실도 공개·권유 아님이 자동 삽입됩니다(사기 프레임 회피)." : "입력은 비워도 됩니다 — 자동 채움. 🔄로 말투를 계속 바꿀 수 있어요."}
          </p>
        </section>

        {/* 생성 블록 */}
        <section className="space-y-4">
          {meta.personas.map((p) => (
            <div key={p} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
              <div className="flex items-center justify-between mb-2.5 gap-2">
                <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">{p}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => bump(p)} className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)]" title="말투 변주">🔄</button>
                  <button onClick={() => copy(p)} className="rounded-md bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90">
                    {copied === key(p) ? "복사됨 ✓" : "복사"}
                  </button>
                </div>
              </div>
              <textarea
                value={text(p)}
                onChange={(e) => setEdited((s) => ({ ...s, [key(p)]: e.target.value }))}
                rows={Math.max(5, text(p).split("\n").length + 1)}
                className="w-full resize-y rounded-lg border border-transparent hover:border-[var(--border)] focus:border-[var(--accent)] focus:outline-none bg-transparent font-sans text-sm leading-relaxed text-[var(--text)] p-1"
              />
            </div>
          ))}
          <p className="mono text-[10px] text-[var(--text-caption)]">
            본문 직접 수정 가능. 질문형은 올린 뒤 첫 댓글에 텔레그램 링크 고정 권장(본문 링크는 도달 패널티).
          </p>
        </section>
      </div>
    </div>
  );
}
