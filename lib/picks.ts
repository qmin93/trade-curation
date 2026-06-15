/**
 * 오늘의 픽 — 터미널에서 픽을 주면 ACTIVE_PICK을 갱신해 메인 상단 스포트라이트에 노출한다.
 * 픽이 없으면 null (스포트라이트 숨김).
 *
 * 갱신 흐름: 사용자가 터미널에 픽 전달 → Claude가 ACTIVE_PICK 수정 → git push → 메인 반영.
 */

export interface SitePick {
  date: string;
  stockName: string;
  ticker: string;
  /** 진입 자리 (예: "16,020") */
  entry?: string;
  /** 목표 (예: ["1차 +1.4%", "2차 +3.4%"]) */
  targets?: string[];
  /** 픽 근거 한두 줄 */
  thesis: string;
  /** live = 진행 중, done = 마감(결과 확정) */
  status: "live" | "done";
  /** 마감 시 결과 수익률 (%) */
  resultPercent?: number;
}

export const ACTIVE_PICK: SitePick | null = {
  date: "2026-06-15",
  stockName: "예스티",
  ticker: "122640",
  entry: "32,100",
  targets: ["1차 +1.4%", "2차 +3.4%", "3차 +5.5%", "4차 +7.4%"],
  thesis:
    "세력감지 전략 12:00 포착 — 일봉 +8.4%로 5·20일선 위(20일 고점 대비 -5.3%), 분봉은 VWAP(30,892원) 위. 단기 이평 정배열·중기 추세선 위. 분봉 거래량·VWAP가 기준을 지키는지 확인이 관건. 손절 30,800원(-4.0%) 이탈 시 흐름 종료.",
  status: "live",
};
