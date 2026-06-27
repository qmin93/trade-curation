/**
 * 레버리지 ETF 예상 시초가 — SOX(필라델피아 반도체) 프록시 자동 추정.
 *
 * 원리: 단일종목 레버리지 ETF는 기초자산(삼성전자)의 일일 수익률을 N배 추종한다.
 *  1) 삼성전자 야간 예상 변동률 ≈ SOX 변동률 × beta (반도체 동조 근사)
 *  2) 레버리지 ETF 예상 변동률 = 삼성전자 예상 변동률 × 레버리지 배수
 *  3) 예상가 = ETF 직전 종가 × (1 + 예상 변동률)
 *
 * ⚠️ 참고용 추정. 레버리지는 일일복리·추적오차·NAV 괴리가 있어 실제와 다를 수 있다.
 */

const NAVER = "https://m.stock.naver.com/api/stock";

// 기초자산 vs SOX 동조 계수(근사). 삼성은 가전·디스플레이 포함이라 1보다 낮게, 하이닉스는 순수 메모리라 높게.
const SAMSUNG_BETA = 0.9;
const HYNIX_BETA = 1.15;

interface LevEtfDef {
  ticker: string;
  name: string;
  lev: number; // 레버리지 배수
  underlying: string;
  beta: number; // 기초자산 vs SOX
}

// 삼전닉스 단일종목 레버리지 ETF(2X) — 티커는 네이버 기준 확인됨.
const LEV_ETFS: LevEtfDef[] = [
  { ticker: "0193W0", name: "KODEX 삼성전자레버리지", lev: 2, underlying: "삼성전자", beta: SAMSUNG_BETA },
  { ticker: "0195R0", name: "TIGER 삼성전자레버리지", lev: 2, underlying: "삼성전자", beta: SAMSUNG_BETA },
  { ticker: "0192M0", name: "RISE 삼성전자레버리지", lev: 2, underlying: "삼성전자", beta: SAMSUNG_BETA },
  { ticker: "0194M0", name: "ACE 삼성전자레버리지", lev: 2, underlying: "삼성전자", beta: SAMSUNG_BETA },
  { ticker: "0193T0", name: "KODEX SK하이닉스레버리지", lev: 2, underlying: "SK하이닉스", beta: HYNIX_BETA },
  { ticker: "0195S0", name: "TIGER SK하이닉스레버리지", lev: 2, underlying: "SK하이닉스", beta: HYNIX_BETA },
  { ticker: "0194T0", name: "ACE SK하이닉스레버리지", lev: 2, underlying: "SK하이닉스", beta: HYNIX_BETA },
];

export interface LevEtfEstimate {
  name: string;
  ticker: string;
  underlying: string;
  prevClose: number;
  estPrice: number;
  estPct: number; // ETF 예상 변동률
}

export interface LeverageEtfData {
  soxPct: number;
  samsungPct: number; // 삼성전자 예상 변동률
  hynixPct: number; // SK하이닉스 예상 변동률
  etfs: LevEtfEstimate[];
}

async function fetchPrevClose(ticker: string): Promise<number | null> {
  try {
    const res = await fetch(`${NAVER}/${ticker}/basic`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const d = await res.json();
    const n = Number(String(d?.closePrice ?? "").replace(/,/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/** SOX 변동률(%)을 받아 레버리지 ETF 예상가를 추정한다. SOX 없으면 null. */
export async function fetchLeverageEtfEstimates(
  soxPct: number | null | undefined,
): Promise<LeverageEtfData | null> {
  if (soxPct == null || !Number.isFinite(soxPct)) return null;
  const results = await Promise.all(
    LEV_ETFS.map(async (e) => {
      const prevClose = await fetchPrevClose(e.ticker);
      if (prevClose == null) return null;
      const estPct = soxPct * e.beta * e.lev; // = 기초변동 × 배수
      const estPrice = Math.round(prevClose * (1 + estPct / 100));
      return { name: e.name, ticker: e.ticker, underlying: e.underlying, prevClose, estPrice, estPct };
    }),
  );
  const etfs = results.filter(Boolean) as LevEtfEstimate[];
  if (etfs.length === 0) return null;
  return {
    soxPct,
    samsungPct: soxPct * SAMSUNG_BETA,
    hynixPct: soxPct * HYNIX_BETA,
    etfs,
  };
}
