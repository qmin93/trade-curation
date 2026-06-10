"use client";

import { useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_GREETING =
  "안녕하세요. 단타 트레이드 어시스턴트입니다. 키워드·종목·시황 질문해주세요.\n예: \"오늘 핫 종목 뭐?\" / \"HBM 라인 정리해줘\" / \"CPI 발표 영향?\"";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "오류가 발생했습니다.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "네트워크 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--accent)] hover:bg-blue-700 text-white shadow-[0_8px_32px_rgba(62,106,225,0.4)] flex items-center justify-center transition-all hover:scale-105"
        aria-label="챗봇 토글"
      >
        <span className="text-2xl">{open ? "×" : "💬"}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[var(--border)] bg-[var(--bg)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] pulse-dot" />
              <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)]">
                Trader Assistant · Claude Haiku
              </span>
            </div>
            <div className="text-sm font-semibold text-[var(--text)] mt-0.5">
              단타 어시스턴트
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-subtle)] text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-caption)] pulse-dot" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--text-caption)] pulse-dot"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--text-caption)] pulse-dot"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="질문 입력…"
                disabled={loading}
                className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-[var(--accent)] hover:bg-blue-700 text-white text-sm rounded-md transition-colors disabled:opacity-40"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
