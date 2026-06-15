"use client";

import { useEffect, useState } from "react";
import { useOperator } from "@/lib/use-operator";
import { ConsoleBody } from "@/components/ConsoleBody";

/**
 * 홈에서 띄우는 운영 콘솔 팝업 — 운영자에게만 떠 있는 플로팅 버튼 → 큰 모달로 콘솔 전체.
 * 픽 입력 + 콘텐츠 포맷을 /ops로 안 가도 홈에서 바로. 방문자에겐 버튼 자체가 안 보임.
 */
export function ConsolePopup() {
  const isOperator = useOperator();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!isOperator) return null;

  return (
    <>
      {/* 플로팅 버튼 (운영자만) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[150] inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90"
        >
          ✍️ 콘솔
        </button>
      )}

      {/* 모달 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[150] flex items-start justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="운영 콘솔"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl my-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur px-5 py-3 rounded-t-2xl">
              <span className="mono text-[11px] uppercase tracking-widest text-[var(--accent)] font-semibold">
                ✍️ 운영 콘솔 · 픽 + 콘텐츠 포맷
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-5">
              <ConsoleBody embedded />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
