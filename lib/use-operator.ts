"use client";

import { useEffect, useState } from "react";

/**
 * 운영자 모드 — 운영 전용 UI(예: Threads 본문 생성기)를 방문자에게 숨긴다.
 * **주소창에 `?op=<SECRET>` 가 있을 때만** 노출. 저장 안 함 → plain URL은 항상 깨끗.
 * 운영자는 `dantatrade.vercel.app/?op=qmin-ops-2026` 를 북마크해서 쓴다.
 *
 * ⚠️ 클라이언트 게이트라 강력한 보안은 아님(코드 뜯으면 SECRET 노출). 일반 방문자에게
 *    운영 도구를 가리는 용도로는 충분하다. 완벽 보안 필요 시 서버 로그인 필요.
 */
const SECRET = "qmin-ops-2026";
const KEY = "op";

export function useOperator(): boolean {
  const [op, setOp] = useState(false);

  useEffect(() => {
    try {
      // 과거 저장 플래그가 남아 있으면 정리(이제 저장 방식 안 씀).
      localStorage.removeItem(KEY);
      const param = new URL(window.location.href).searchParams.get("op");
      setOp(param === SECRET);
    } catch {
      /* noop */
    }
  }, []);

  return op;
}
