/**
 * 네이버 금융 실시간 인기 검색 종목 — "지금 사람들이 뭘 검색하나" = 실시간 트래픽 신호.
 *
 * m.stock.naver.com 모바일 JSON API (UTF-8). 키 불필요.
 * 단타 관점: 검색 상위 = 지금 시장 관심이 쏠린 종목 → 콘텐츠·픽 우선순위 신호.
 */

const SEARCH_TOP_API = "https://m.stock.naver.com/api/stocks/searchTop";

export interface TrendingStock {
  rank: number;
  name: string;
  ticker: string;
  price: string; // "334,500"
  changePercent: number; // +11.87 / -2.30 (부호 포함)
  direction: "up" | "down" | "flat";
}

interface NaverSearchTopStock {
  itemCode: string;
  stockName: string;
  closePrice: string;
  fluctuationsRatio: string; // 절대값 "11.87"
  compareToPreviousPrice?: { code?: string; name?: string };
}

/** code: 1 상한·2 상승·3 보합·4 하한·5 하락 */
function directionFromCode(code?: string): "up" | "down" | "flat" {
  if (code === "1" || code === "2") return "up";
  if (code === "4" || code === "5") return "down";
  return "flat";
}

/** 실시간 인기 검색 상위 종목. 실패 시 []. */
export async function fetchTrendingStocks(limit = 10): Promise<TrendingStock[]> {
  try {
    const res = await fetch(SEARCH_TOP_API, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.warn(`[naver-trending] HTTP ${res.status}`);
      return [];
    }
    const json: { stocks?: NaverSearchTopStock[] } = await res.json();
    const stocks = json.stocks ?? [];
    return stocks.slice(0, limit).map((s, i) => {
      const dir = directionFromCode(s.compareToPreviousPrice?.code);
      const mag = Math.abs(parseFloat(s.fluctuationsRatio) || 0);
      return {
        rank: i + 1,
        name: s.stockName,
        ticker: s.itemCode,
        price: s.closePrice,
        changePercent: dir === "down" ? -mag : mag,
        direction: dir,
      };
    });
  } catch (err) {
    console.warn("[naver-trending] fetch failed", err);
    return [];
  }
}

/** 네이버 금융 종목 페이지 (실시간 시세·차트). */
export function naverStockUrl(ticker: string): string {
  return `https://finance.naver.com/item/main.naver?code=${ticker}`;
}
