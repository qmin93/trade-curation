/**
 * 종목 실시간 등락률 배치 조회 — 네이버 polling(무인증).
 * 테마별 주도주·장중 발굴 화면의 라이브 데이터 소스.
 */
const POLLING = "https://polling.finance.naver.com/api/realtime/domestic/stock/";

export interface LiveQuote {
  ticker: string;
  name: string;
  price: number;
  changePercent: number; // 부호 포함
  direction: "up" | "down" | "flat";
}

interface PollingDatum {
  itemCode: string;
  stockName: string;
  closePrice: string; // "322,500"
  fluctuationsRatio: string; // 절대값 "7.86"
  compareToPreviousPrice?: { code?: string };
}

function dir(code?: string): "up" | "down" | "flat" {
  if (code === "1" || code === "2") return "up";
  if (code === "4" || code === "5") return "down";
  return "flat";
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/** 티커 배열 → 종목코드별 라이브 시세 맵. 실패분은 빠진다. */
export async function fetchQuotes(
  tickers: string[],
): Promise<Map<string, LiveQuote>> {
  const map = new Map<string, LiveQuote>();
  const groups = chunk([...new Set(tickers)], 25);
  await Promise.all(
    groups.map(async (group) => {
      try {
        const res = await fetch(`${POLLING}${group.join(",")}`, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: "https://finance.naver.com",
          },
          next: { revalidate: 60 },
        });
        if (!res.ok) return;
        const json: { datas?: PollingDatum[] } = await res.json();
        for (const d of json.datas ?? []) {
          const price = Number(d.closePrice.replace(/,/g, ""));
          const mag = Math.abs(parseFloat(d.fluctuationsRatio) || 0);
          const direction = dir(d.compareToPreviousPrice?.code);
          map.set(d.itemCode, {
            ticker: d.itemCode,
            name: d.stockName,
            price,
            changePercent: direction === "down" ? -mag : mag,
            direction,
          });
        }
      } catch {
        /* skip group */
      }
    }),
  );
  return map;
}
