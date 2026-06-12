/**
 * Open DART 실시간 공시 fetcher — 기사보다 빠른 단타 재료(수주·공급계약·유증·자사주).
 *
 * 환경변수 DART_API_KEY 필요 (https://opendart.fss.or.kr 무료 발급).
 * 키 없으면 안전하게 [] 반환 → 사이트는 기존 소스로만 동작.
 */

const DART_LIST_API = "https://opendart.fss.or.kr/api/list.json";

/** 단타 관심 공시(보고서명 부분일치). 기사화 전 가장 빠른 재료. */
const DANTA_REPORT_KEYWORDS = [
  "공급계약", // 단일판매·공급계약체결
  "단일판매",
  "수주",
  "유상증자",
  "무상증자",
  "자기주식취득", // 자사주
  "자기주식소각",
  "전환사채",
  "투자판단", // 투자판단관련 주요경영사항
  "특허",
  "임상",
  "공동개발",
  "양수도",
];

export interface DartDisclosure {
  corpName: string;
  stockCode: string;
  reportNm: string;
  rceptNo: string;
  rceptDt: string; // YYYYMMDD
}

interface DartListItem {
  corp_name: string;
  stock_code: string;
  report_nm: string;
  rcept_no: string;
  rcept_dt: string;
}

function yyyymmdd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * 단타 재료가 실리는 공시유형(pblntf_ty)만 조회.
 * - I: 거래소공시(수시) — 단일판매ㆍ공급계약·수주·자기주식·투자판단 등
 * - B: 주요사항보고서 — 유상증자결정·전환사채 등
 * 기본 전체 조회는 최근 100건이 정형 보고서(증권발행실적·감사보고서)로 꽉 차
 * 단타 공시를 놓치므로 유형을 좁혀야 한다.
 */
const DART_PBLNTF_TYPES = ["I", "B"] as const;

async function fetchDartByType(
  key: string,
  pblntfTy: string,
  bgnDe: string,
  endDe: string,
): Promise<DartListItem[]> {
  const params = new URLSearchParams({
    crtfc_key: key,
    bgn_de: bgnDe,
    end_de: endDe,
    pblntf_ty: pblntfTy,
    page_count: "100",
    sort: "date",
    sort_mth: "desc",
  });
  try {
    const res = await fetch(`${DART_LIST_API}?${params.toString()}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      console.warn(`[dart] HTTP ${res.status} (ty=${pblntfTy})`);
      return [];
    }
    const json: { status: string; message: string; list?: DartListItem[] } =
      await res.json();
    // status "000" = 정상. "013" = 데이터 없음.
    if (json.status !== "000" || !json.list) return [];
    return json.list;
  } catch (err) {
    console.warn(`[dart] fetch failed (ty=${pblntfTy})`, err);
    return [];
  }
}

/** 최근 N일 단타 관심 상장사 공시. 키 없으면 []. */
export async function fetchRecentDartDisclosures(
  days = 2,
  maxItems = 20,
): Promise<DartDisclosure[]> {
  const key = process.env.DART_API_KEY;
  if (!key) return [];

  const now = new Date();
  const bgnDe = yyyymmdd(new Date(now.getTime() - days * 86_400_000));
  const endDe = yyyymmdd(now);

  const lists = await Promise.all(
    DART_PBLNTF_TYPES.map((ty) => fetchDartByType(key, ty, bgnDe, endDe)),
  );

  const seen = new Set<string>();
  return lists
    .flat()
    .filter((it) => {
      if (!it.stock_code || it.stock_code.trim() === "") return false; // 상장사만
      // DART report_nm은 NFC 한글 — includes 매칭 정상.
      if (!DANTA_REPORT_KEYWORDS.some((k) => it.report_nm.includes(k)))
        return false;
      if (seen.has(it.rcept_no)) return false;
      seen.add(it.rcept_no);
      return true;
    })
    // 접수번호(YYYYMMDD+seq) 내림차순 = 최신 공시 우선. 홈 도배 방지 위해 상한.
    .sort((a, b) => b.rcept_no.localeCompare(a.rcept_no))
    .slice(0, maxItems)
    .map((it) => ({
      corpName: it.corp_name.trim(),
      stockCode: it.stock_code.trim(),
      reportNm: it.report_nm.trim(),
      rceptNo: it.rcept_no.trim(),
      rceptDt: it.rcept_dt.trim(),
    }));
}

/** 공시 뷰어 URL (사이트 카드 "출처 가기"용). */
export function dartViewerUrl(rceptNo: string): string {
  return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`;
}
