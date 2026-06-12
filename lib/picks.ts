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
  date: "2026-06-12",
  stockName: "샘씨엔에스",
  ticker: "252990",
  entry: "16,210",
  targets: ["1차 +1.4%", "2차 +3.4%", "3차 +5.5%", "4차 +7.4%"],
  thesis:
    "다중 기술지표가 동시 돌파되며 세력 매집 흔적이 뚜렷한 자리. 손절 15,560원(-4.0%) 이탈 시 흐름 종료.",
  status: "live",
};
