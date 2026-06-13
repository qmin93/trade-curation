"use client";

import { useEffect, useState } from "react";
import type { UnifiedNewsItem } from "@/lib/news-fetcher";
import { dantaAngle } from "@/lib/danta-angle";
import { PERSONAS, threadsCaptionByPersona, type Persona } from "@/lib/threads-caption";
import { useOperator } from "@/lib/use-operator";

/**
 * 뉴스 캡처용 팝업 — 클릭한 뉴스를 깔끔한 카드로 띄운다.
 * 카드 영역만 스크린샷하면 그대로 Threads에 올릴 수 있게 디자인.
 */
export function NewsModal({
  news,
  stamp,
  onClose,
}: {
  news: UnifiedNewsItem;
  stamp: string;
  onClose: () => void;
}) {
  const isOperator = useOperator();
  const [persona, setPersona] = useState<Persona>(PERSONAS[0]);
  const caption = threadsCaptionByPersona(news, persona);
  const [copied, setCopied] = useState(false);
  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto"
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] shadow-lg"
        >
          ✕
        </button>

        {/* 캡처 카드 */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden shadow-2xl">
          {news.imageUrl && (
            <div className="w-full aspect-[16/9] bg-[var(--bg-subtle)] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={news.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3 text-[11px] mono uppercase tracking-widest">
              <span className="font-semibold text-[var(--accent)]">{news.source}</span>
              {news.keywords[0] && (
                <>
                  <span className="text-[var(--text-caption)]">·</span>
                  <span className="text-[var(--text-muted)]">#{news.keywords[0]}</span>
                </>
              )}
              <span className="ml-auto tabular-nums text-[var(--text-caption)]">{stamp}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold leading-snug text-[var(--text)] mb-3">
              {news.headline}
            </h2>

            {news.summary && (
              <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
                {news.summary}
              </p>
            )}

            {(() => {
              const angle = dantaAngle(news);
              return angle ? (
                <div className="mt-4 rounded-lg border border-[var(--accent)]/25 bg-[var(--accent)]/[0.06] px-4 py-3">
                  <div className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-1">
                    💡 단타 관점
                  </div>
                  <div className="text-sm font-medium text-[var(--text)]">{angle}</div>
                </div>
              ) : null;
            })()}

            {news.stocks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {news.stocks.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-[var(--bg-subtle)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* 브랜드 푸터 (캡처 시 출처) */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--border)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span className="text-xs font-semibold text-[var(--text)]">단타 트레이드</span>
              <span className="ml-auto mono text-[10px] text-[var(--text-caption)]">
                dantatrade.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Threads 본문 — 운영자 전용 (방문자에겐 숨김) */}
        {isOperator && (
        <div className="mt-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              ✍️ Threads 본문 · {persona}
            </span>
            <button
              onClick={copyCaption}
              className="rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
            >
              {copied ? "복사됨 ✓" : "본문 복사"}
            </button>
          </div>

          {/* 페르소나 선택 */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {PERSONAS.map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  persona === p
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text)]">
            {caption}
          </pre>
          <p className="mono text-[10px] text-[var(--text-caption)] mt-2">
            운영자 전용 · 카드 캡처 + 이 본문 복사 → Threads. 방문자에겐 안 보입니다.
          </p>
        </div>
        )}

        {/* 액션 (캡처 영역 밖) */}
        <div className="flex items-center mt-3">
          {isOperator && (
            <span className="mono text-[10px] text-[var(--text-caption)] uppercase tracking-widest">
              카드를 캡처해 올리세요
            </span>
          )}
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            출처 기사 ↗
          </a>
        </div>
      </div>
    </div>
  );
}
