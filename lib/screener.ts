/**
 * 장중 스크리너 — 급등 종목 + 52주 신고가. 멘토(reload.kospi)의
 * "신고가 뚫는 종목 / 추세 따라가는 종목" 발굴.
 * m.stock 랭킹 API(무인증). ETF·ETN·레버리지는 단타 발굴에서 제외.
 */
const M_STOCK = "https://m.stock.naver.com/api/stocks/";

export interface RankedStock {
  ticker: string;
  name: string;
  price: string;
  changePercent: number;
  direction: "up" | "down" | "flat";
}

interface RawStock {
  itemCode: string;
  stockName: string;
  closePrice: string;
  fluctuationsRatio: string;
  compareToPreviousPrice?: { code?: string };
}

// ETF/ETN/레버리지/지수상품 제외 (단타 개별주만)
const NON_STOCK =
  /(ETF|ETN|레버리지|인버스|선물|TR\b|TOP\s?\d|KODEX|TIGER|RISE|ACE|PLUS|SOL\b|KOSEF|ARIRANG|HANARO|KBSTAR|TIMEFOLIO|1Q|KIWOOM|UNICORN|마이다스|채권|리츠|스팩|액티브|커버드콜|공급망|강소기업|생성형|고배당|그룹주)/i;

function dir(code?: string): "up" | "down" | "flat" {
  if (code === "1" || code === "2") return "up";
  if (code === "4" || code === "5") return "down";
  return "flat";
}

function normalize(list: RawStock[], limit: number): RankedStock[] {
  const out: RankedStock[] = [];
  for (const x of list) {
    if (NON_STOCK.test(x.stockName)) continue;
    const d = dir(x.compareToPreviousPrice?.code);
    const mag = Math.abs(parseFloat(x.fluctuationsRatio) || 0);
    out.push({
      ticker: x.itemCode,
      name: x.stockName,
      price: x.closePrice,
      changePercent: d === "down" ? -mag : mag,
      direction: d,
    });
    if (out.length >= limit) break;
  }
  return out;
}

async function fetchRanking(path: string, limit: number): Promise<RankedStock[]> {
  try {
    const res = await fetch(`${M_STOCK}${path}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json: { stocks?: RawStock[] } = await res.json();
    return normalize(json.stocks ?? [], limit);
  } catch {
    return [];
  }
}

/** 급등 종목(등락률 상위). */
export function fetchRising(limit = 10): Promise<RankedStock[]> {
  return fetchRanking("up", limit);
}

/** 52주 신고가 종목. */
export function fetchNewHighs(limit = 10): Promise<RankedStock[]> {
  return fetchRanking("high52week", limit);
}
