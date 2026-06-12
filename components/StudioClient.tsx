"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CAPTION_TONES,
  type CaptionTone,
  chartCaption,
  newsCaption,
  pickCaption,
  perfCaption,
  themeCaption,
  screenerCaption,
} from "@/lib/card-caption";

type CardType = "chart" | "news" | "pick" | "perf" | "theme" | "screener";

const TYPES: { key: CardType; label: string; hint: string }[] = [
  { key: "theme", label: "테마 주도주", hint: "장중 글" },
  { key: "screener", label: "급등·신고가", hint: "장중 글" },
  { key: "chart", label: "종목 차트", hint: "급등주 글" },
  { key: "news", label: "뉴스", hint: "뉴스 글" },
  { key: "pick", label: "오늘의 픽", hint: "픽 글" },
  { key: "perf", label: "성과", hint: "신뢰 글" },
];

const DEFAULTS = {
  chart: { name: "삼성전자", ticker: "005930", change: "12.21", note: "외인 순매수에 갭 상승·거래량 폭증" },
  news: {
    headline: "코스피, 외인 순매수에 2,900선 회복…반도체 주도",
    summary: "외국인이 반도체 대형주를 중심으로 순매수에 나서며 지수가 반등했습니다.",
    source: "연합뉴스",
  },
  pick: { name: "샘씨엔에스", ticker: "252990", entry: "16,210", target: "1차 +1.4%", stop: "15,560" },
};

export function StudioClient() {
  const [type, setType] = useState<CardType>("chart");
  const [brand, setBrand] = useState(true);
  const [portrait, setPortrait] = useState(false);
  const [tone, setTone] = useState<CaptionTone>("담백");

  const [chart, setChart] = useState(DEFAULTS.chart);
  const [news, setNews] = useState(DEFAULTS.news);
  const [pick, setPick] = useState(DEFAULTS.pick);

  // 카드 이미지 URL (타이핑 디바운스 — 매 글자마다 og 렌더 방지)
  const liveSrc = useMemo(() => {
    const p = new URLSearchParams();
    if (type === "chart") {
      p.set("name", chart.name);
      p.set("ticker", chart.ticker);
      p.set("change", chart.change);
      if (chart.note) p.set("note", chart.note);
    } else if (type === "news") {
      p.set("headline", news.headline);
      p.set("summary", news.summary);
      p.set("source", news.source);
    } else if (type === "pick") {
      p.set("name", pick.name);
      p.set("ticker", pick.ticker);
      p.set("entry", pick.entry);
      p.set("target", pick.target);
      p.set("stop", pick.stop);
    }
    p.set("brand", brand ? "1" : "0");
    if (portrait) p.set("ratio", "portrait");
    return `/api/card/${type}?${p.toString()}`;
  }, [type, brand, portrait, chart, news, pick]);

  const [src, setSrc] = useState(liveSrc);
  useEffect(() => {
    const t = setTimeout(() => setSrc(liveSrc), 600);
    return () => clearTimeout(t);
  }, [liveSrc]);

  const caption = useMemo(() => {
    if (type === "chart") return chartCaption(chart.name, Number(chart.change) || 0, tone);
    if (type === "news") return newsCaption(news.headline, news.source, tone);
    if (type === "pick") return pickCaption(pick.name, tone);
    if (type === "theme") return themeCaption(tone);
    if (type === "screener") return screenerCaption(tone);
    return perfCaption(tone);
  }, [type, tone, chart, news, pick]);

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dlName = `${type}${portrait ? "-9x16" : ""}${brand ? "-brand" : ""}.png`;

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      {/* 좌: 컨트롤 */}
      <div className="space-y-6">
        {/* 카드 종류 */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                type === t.key
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 입력 필드 */}
        <div className="space-y-3">
          {type === "chart" && (
            <>
              <Field label="종목명" value={chart.name} onChange={(v) => setChart({ ...chart, name: v })} />
              <Field label="종목코드" value={chart.ticker} onChange={(v) => setChart({ ...chart, ticker: v })} />
              <Field label="등락률(%)" value={chart.change} onChange={(v) => setChart({ ...chart, change: v })} />
              <Field label="한줄 코멘트" value={chart.note} onChange={(v) => setChart({ ...chart, note: v })} />
            </>
          )}
          {type === "news" && (
            <>
              <Field label="헤드라인" value={news.headline} onChange={(v) => setNews({ ...news, headline: v })} />
              <Field label="요약" value={news.summary} onChange={(v) => setNews({ ...news, summary: v })} textarea />
              <Field label="출처" value={news.source} onChange={(v) => setNews({ ...news, source: v })} />
            </>
          )}
          {type === "pick" && (
            <>
              <Field label="종목명" value={pick.name} onChange={(v) => setPick({ ...pick, name: v })} />
              <Field label="종목코드" value={pick.ticker} onChange={(v) => setPick({ ...pick, ticker: v })} />
              <Field label="진입가" value={pick.entry} onChange={(v) => setPick({ ...pick, entry: v })} />
              <Field label="목표" value={pick.target} onChange={(v) => setPick({ ...pick, target: v })} />
              <Field label="손절가" value={pick.stop} onChange={(v) => setPick({ ...pick, stop: v })} />
            </>
          )}
          {type === "perf" && (
            <p className="text-sm text-[var(--text-muted)] rounded-lg border border-dashed border-[var(--border)] p-4">
              성과 카드는 사이트 실데이터(누적·승률·적중·손절)를 자동 반영합니다.
            </p>
          )}
          {type === "theme" && (
            <p className="text-sm text-[var(--text-muted)] rounded-lg border border-dashed border-[var(--border)] p-4">
              테마 주도주 카드는 지금 강한 테마와 종목 등락률을 실시간으로 자동
              반영합니다. (세로형 권장)
            </p>
          )}
          {type === "screener" && (
            <p className="text-sm text-[var(--text-muted)] rounded-lg border border-dashed border-[var(--border)] p-4">
              급등·신고가 카드는 오늘 등락률 상위와 52주 신고가 종목을 실시간으로
              자동 반영합니다.
            </p>
          )}
        </div>

        {/* 옵션 */}
        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
          <Toggle label="브랜드 워터마크" sub={brand ? "유입용" : "무브랜드 · 페르소나용"} on={brand} onToggle={() => setBrand(!brand)} />
          <Toggle label="세로형 (1080×1350)" sub={portrait ? "세로" : "정사각 1080²"} on={portrait} onToggle={() => setPortrait(!portrait)} />
        </div>

        {/* 문구 톤 */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <div className="text-xs font-semibold text-[var(--text-caption)] uppercase tracking-wider">본문 초안 톤</div>
          <div className="flex gap-2">
            {CAPTION_TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  tone === t ? "bg-[var(--text)] text-[var(--bg-base)]" : "bg-[var(--bg-subtle)] text-[var(--text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 우: 미리보기 + 문구 */}
      <div className="space-y-5">
        <div className="relative rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-subtle)] max-w-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="카드 미리보기" className="w-full block" />
        </div>

        <div className="flex flex-wrap gap-3 max-w-[520px]">
          <a
            href={src}
            download={dlName}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            ↓ 이미지 다운로드
          </a>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-subtle)]"
          >
            새 탭에서 열기
          </a>
        </div>

        {/* 본문 초안 */}
        <div className="max-w-[520px] rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-caption)] uppercase tracking-wider">
              본문 초안 ({tone})
            </span>
            <button
              onClick={copy}
              className="rounded-md bg-[var(--bg-subtle)] px-3 py-1 text-xs font-semibold text-[var(--text)] hover:bg-[var(--muted)]"
            >
              {copied ? "복사됨 ✓" : "복사"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-[var(--text)] leading-relaxed font-sans">
            {caption}
          </pre>
          <p className="mono text-[10px] text-[var(--text-caption)] mt-3">
            초안입니다. 그대로 박지 말고 본인 톤으로 다듬어 게시하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[var(--text-caption)]">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] resize-none focus:outline-none focus:border-[var(--accent)]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  sub,
  on,
  onToggle,
}: {
  label: string;
  sub: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex w-full items-center justify-between text-left">
      <div>
        <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
        <div className="text-xs text-[var(--text-caption)]">{sub}</div>
      </div>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? "bg-[var(--accent)]" : "bg-[var(--muted)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}
