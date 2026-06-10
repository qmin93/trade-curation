"use client";

import { useState } from "react";

type EntryType = "news" | "pick" | "result";

export default function CuratePage() {
  const [type, setType] = useState<EntryType>("news");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // shared
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // news
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [stocks, setStocks] = useState("");

  // pick / result
  const [stockName, setStockName] = useState("");
  const [ticker, setTicker] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [target1, setTarget1] = useState("");
  const [target2, setTarget2] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [resultPercent, setResultPercent] = useState("");
  const [targetReached, setTargetReached] = useState("0");
  const [pickTime, setPickTime] = useState("09:05");
  const [note, setNote] = useState("");

  async function submit() {
    setStatus("");
    setSubmitting(true);
    try {
      let body: Record<string, unknown> = { type, date };
      if (type === "news") {
        body = {
          ...body,
          headline,
          summary,
          source,
          sourceUrl,
          keywords: keywords
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          stocks: stocks
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
      } else if (type === "pick") {
        body = {
          ...body,
          stockName,
          ticker,
          time: pickTime,
          entryPrice: Number(entryPrice),
          target1: Number(target1),
          target2: Number(target2),
          stopLoss: Number(stopLoss),
          note,
        };
      } else {
        body = {
          ...body,
          stockName,
          ticker,
          entryPrice: Number(entryPrice),
          resultPercent: Number(resultPercent),
          targetReached: Number(targetReached),
          note,
        };
      }
      const res = await fetch("/api/admin/curate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`❌ ${data.error ?? "오류"}`);
      } else {
        setStatus(`✅ ${data.message ?? "저장 완료"}`);
        // reset minimal
        if (type === "news") {
          setHeadline("");
          setSummary("");
          setSourceUrl("");
        }
      }
    } catch (err) {
      setStatus(
        `❌ ${err instanceof Error ? err.message : "Network error"}`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-caption)] mb-2">
          Admin · Curate
        </div>
        <h1 className="text-3xl font-bold tracking-tight">큐레이션 입력</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          뉴스·픽·결과 입력 후 저장 → 사이트 자동 반영. 인증 토큰 필요.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 space-y-4">
        <Field label="Admin Token">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={inputCls}
            placeholder="Vercel 환경변수 ADMIN_TOKEN 값"
          />
        </Field>

        <div className="flex gap-2">
          {(["news", "pick", "result"] as EntryType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                type === t
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t === "news" ? "뉴스" : t === "pick" ? "픽" : "결과"}
            </button>
          ))}
        </div>

        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>

        {type === "news" && (
          <>
            <Field label="헤드라인 (수동 요약)">
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="요약 (3~4문장)">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="매체 단축명">
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="fnnews"
                  className={inputCls}
                />
              </Field>
              <Field label="기사 URL">
                <input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="키워드 (쉼표 구분)">
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="하이닉스, 삼성전자, HBM"
                className={inputCls}
              />
            </Field>
            <Field label="종목 (쉼표 구분)">
              <input
                value={stocks}
                onChange={(e) => setStocks(e.target.value)}
                placeholder="SK하이닉스, 삼성전자"
                className={inputCls}
              />
            </Field>
          </>
        )}

        {type === "pick" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="종목명">
                <input
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="종목코드">
                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="093370"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="픽 시간 (HH:MM)">
                <input
                  value={pickTime}
                  onChange={(e) => setPickTime(e.target.value)}
                  placeholder="09:05"
                  className={inputCls}
                />
              </Field>
              <Field label="포착가">
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="1차">
                <input
                  type="number"
                  value={target1}
                  onChange={(e) => setTarget1(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="2차">
                <input
                  type="number"
                  value={target2}
                  onChange={(e) => setTarget2(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="손절">
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="설명">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="다중 기술지표 돌파·세력 매집"
                className={inputCls}
              />
            </Field>
          </>
        )}

        {type === "result" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="종목명">
                <input
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="종목코드">
                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="포착가">
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="결과 %">
                <input
                  type="number"
                  step="0.01"
                  value={resultPercent}
                  onChange={(e) => setResultPercent(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="도달 차수 (0-4)">
              <input
                type="number"
                min="0"
                max="4"
                value={targetReached}
                onChange={(e) => setTargetReached(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="설명">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="1차·2차 모두 달성"
                className={inputCls}
              />
            </Field>
          </>
        )}

        <button
          onClick={submit}
          disabled={submitting || !token}
          className="w-full px-4 py-3 bg-[var(--accent)] hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "저장 중…" : "저장"}
        </button>

        {status && (
          <div
            className={`text-sm p-3 rounded-md ${status.startsWith("✅") ? "bg-[var(--red)]/10 text-[var(--red)]" : "bg-[var(--green)]/10 text-[var(--green)]"}`}
          >
            {status}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-[var(--text-caption)] space-y-1">
        <p>· Supabase 키 미설정 시: 입력은 가능하지만 저장 X·콘솔 로그만</p>
        <p>· 키 설정: Vercel 환경변수 NEXT_PUBLIC_SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY·ADMIN_TOKEN</p>
        <p>· schema: lib/db/schema.sql 참조</p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder:text-[var(--text-caption)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mono text-[10px] uppercase tracking-widest text-[var(--text-caption)] mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}
