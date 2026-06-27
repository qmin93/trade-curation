/**
 * 장전(場前) 대시보드 데이터 — 장 시작 전 흩어진 글로벌 신호를 한 곳에.
 * 미국 증시 마감 · 나스닥 선물 · 원/달러 · 김치프리미엄 · 코스피 예상 시초가.
 *
 * 소스: Yahoo Finance(지수·선물·환율) · Upbit/Binance(김프). 전부 무인증.
 */

const YAHOO = "https://query1.finance.yahoo.com/v8/finance/chart/";

import { fetchLeverageEtfEstimates, type LeverageEtfData } from "./leverage-etf";

export interface Quote {
  label: string;
  symbol: string;
  price: number;
  prevClose: number;
  changePercent: number;
}

export interface PremarketData {
  usClose: Quote[]; // 다우·S&P·나스닥·SOX
  futures: Quote[]; // 나스닥·S&P·다우 선물
  usdkrw: Quote | null;
  kimchi: { premiumPercent: number; upbitKrw: number; fairKrw: number } | null;
  kospi: {
    prevClose: number;
    estimatedChangePercent: number;
    estimatedOpen: number;
  } | null;
  leverageEtfs: LeverageEtfData | null;
  fetchedAt: string;
}

async function fetchYahoo(symbol: string, label: string): Promise<Quote | null> {
  try {
    const res = await fetch(`${YAHOO}${encodeURIComponent(symbol)}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = Number(meta.regularMarketPrice);
    const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose);
    if (!price || !prevClose) return null;
    return {
      label,
      symbol,
      price,
      prevClose,
      changePercent: ((price - prevClose) / prevClose) * 100,
    };
  } catch {
    return null;
  }
}

async function fetchKimchi(
  usdkrw: number | null,
): Promise<PremarketData["kimchi"]> {
  if (!usdkrw) return null;
  try {
    const [upbitRes, binRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", {
        next: { revalidate: 60 },
      }),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
        next: { revalidate: 60 },
      }),
    ]);
    if (!upbitRes.ok || !binRes.ok) return null;
    const upbit = await upbitRes.json();
    const bin = await binRes.json();
    const upbitKrw = Number(upbit?.[0]?.trade_price);
    const binanceUsd = Number(bin?.price);
    if (!upbitKrw || !binanceUsd) return null;
    const fairKrw = binanceUsd * usdkrw;
    return {
      premiumPercent: (upbitKrw / fairKrw - 1) * 100,
      upbitKrw,
      fairKrw,
    };
  } catch {
    return null;
  }
}

export async function fetchPremarket(): Promise<PremarketData> {
  const [dow, sp, nasdaq, sox, nqF, esF, ymF, krw, kospi] = await Promise.all([
    fetchYahoo("^DJI", "다우"),
    fetchYahoo("^GSPC", "S&P500"),
    fetchYahoo("^IXIC", "나스닥"),
    fetchYahoo("^SOX", "필라델피아 반도체"),
    fetchYahoo("NQ=F", "나스닥100 선물"),
    fetchYahoo("ES=F", "S&P500 선물"),
    fetchYahoo("YM=F", "다우 선물"),
    fetchYahoo("KRW=X", "원/달러"),
    fetchYahoo("^KS11", "코스피"),
  ]);

  const usdkrw = krw?.price ?? null;
  const kimchi = await fetchKimchi(usdkrw);

  // 레버리지 ETF 예상 시초가 — SOX 프록시 자동 추정(참고용).
  const leverageEtfs = await fetchLeverageEtfEstimates(sox?.changePercent);

  // 코스피 예상 시초가 — 나스닥100 선물 등락률에 단순 가중(참고용 추정).
  let kospiEst: PremarketData["kospi"] = null;
  if (kospi && nqF) {
    const est = nqF.changePercent * 0.5; // 코스피의 나스닥 추종 대략치
    kospiEst = {
      prevClose: kospi.price, // 한국 장 마감 후엔 regularMarketPrice = 전일 종가
      estimatedChangePercent: est,
      estimatedOpen: kospi.price * (1 + est / 100),
    };
  }

  return {
    usClose: [dow, sp, nasdaq, sox].filter(Boolean) as Quote[],
    futures: [nqF, esF, ymF].filter(Boolean) as Quote[],
    usdkrw: krw,
    kimchi,
    kospi: kospiEst,
    leverageEtfs,
    fetchedAt: new Date().toISOString(),
  };
}
