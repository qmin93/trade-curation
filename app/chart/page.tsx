"use client";

import { useState } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";

/**
 * 차트 캡처 도구 — TradingView 위젯으로 KRX 종목 차트를 띄우고,
 * 테마·인터벌·스타일을 바꿔 5계정용 서로 다른 차트 이미지를 캡처한다.
 */
const INTERVALS: { v: string; label: string }[] = [
  { v: "1", label: "1분" },
  { v: "5", label: "5분" },
  { v: "15", label: "15분" },
  { v: "60", label: "60분" },
  { v: "D", label: "일봉" },
  { v: "W", label: "주봉" },
];
const STYLES: { v: string; label: string }[] = [
  { v: "1", label: "캔들" },
  { v: "8", label: "영역" },
  { v: "3", label: "라인" },
  { v: "2", label: "바" },
];
// 5계정용 빠른 프리셋(테마·인터벌·스타일이 다 다름 → 캡처 5장이 안 겹침)
const PRESETS: { name: string; theme: "dark" | "light"; interval: string; style: string }[] = [
  { name: "① 다크·일봉·캔들", theme: "dark", interval: "D", style: "1" },
  { name: "② 라이트·일봉·캔들", theme: "light", interval: "D", style: "1" },
  { name: "③ 다크·15분·영역", theme: "dark", interval: "15", style: "8" },
  { name: "④ 라이트·5분·라인", theme: "light", interval: "5", style: "3" },
  { name: "⑤ 다크·주봉·캔들", theme: "dark", interval: "W", style: "1" },
];

export default function ChartPage() {
  const [code, setCode] = useState("005930");
  const [input, setInput] = useState("005930");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [interval, setInterval] = useState("D");
  const [style, setStyle] = useState("1");

  const symbol = `KRX:${code.replace(/\D/g, "").slice(0, 6)}`;

  const btn = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-[var(--accent)] text-white"
        : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-5">
      <div>
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--accent)] mb-1">차트 캡처 도구</div>
        <h1 className="text-2xl font-bold text-[var(--text)]">TradingView 차트</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          종목코드 입력 → 아래 프리셋으로 테마·인터벌 바꿔가며 <b>5장 캡처</b>하면 계정마다 다른 차트 이미지가 됩니다.
        </p>
      </div>

      {/* 종목 입력 */}
      <form
        onSubmit={(e) => { e.preventDefault(); setCode(input); }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="종목코드 6자리 (예: 122640)"
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          조회
        </button>
      </form>

      {/* 5계정 프리셋 */}
      <div>
        <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5">📸 5계정 프리셋 (눌러서 바꾸고 캡처)</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const active = p.theme === theme && p.interval === interval && p.style === style;
            return (
              <button
                key={p.name}
                onClick={() => { setTheme(p.theme); setInterval(p.interval); setStyle(p.style); }}
                className={btn(active)}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 수동 토글 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex gap-1.5">
          <button onClick={() => setTheme("dark")} className={btn(theme === "dark")}>다크</button>
          <button onClick={() => setTheme("light")} className={btn(theme === "light")}>라이트</button>
        </div>
        <div className="flex gap-1.5">
          {INTERVALS.map((i) => (
            <button key={i.v} onClick={() => setInterval(i.v)} className={btn(interval === i.v)}>{i.label}</button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {STYLES.map((s) => (
            <button key={s.v} onClick={() => setStyle(s.v)} className={btn(style === s.v)}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* 차트 */}
      <TradingViewWidget symbol={symbol} theme={theme} interval={interval} style={style} />

      <p className="mono text-[10px] text-[var(--text-caption)]">
        ⚠️ TradingView 실시간(지연) 데이터 · 정보 제공 목적 · 매매 본인 책임. 같은 종목도 프리셋을 바꿔 캡처하면 5장이 안 겹쳐 봇 감지를 피합니다.
      </p>
    </div>
  );
}
