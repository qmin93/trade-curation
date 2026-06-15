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
  stockName: "한온시스템",
  ticker: "018880",
  entry: "5,230",
  targets: ["1차 +1.0%", "2차 +2.5%", "3차 +4.5%", "4차 +7.0%"],
  thesis:
    "종일용 전략 09:08 포착 — 일봉 +11.7%로 5·20일선 위, 분봉은 VWAP(5,217원) 위 유지. 거래대금·VWAP가 기준을 지키는지 확인이 관건. 손절 5,070원(-3.1%) 이탈 시 흐름 종료.",
  status: "live",
};
