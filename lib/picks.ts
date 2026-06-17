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
  date: "2026-06-17",
  stockName: "예스티",
  ticker: "122640",
  entry: "32,400",
  targets: ["1차 +1.4%", "2차 +3.4%", "3차 +5.5%", "4차 +7.4%"],
  thesis:
    "세력 포착 09:46 — 신호 포착 시점 차트 조회가 지연돼 자리 미확인 상태에서 추격은 보류, 기준 우선으로 접근. 이후 1·2·3차 목표가 달성(+5.5%). 신호와 자리는 다르다는 원칙을 지킨 자리.",
  status: "done",
  resultPercent: 5.5,
};
