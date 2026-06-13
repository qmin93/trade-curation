"use client";

import { useEffect, useState } from "react";

/**
 * 운영자 모드 — 운영 전용 UI(예: Threads 본문 생성기)를 방문자에게 숨긴다.
 * 비밀 URL `?op=<SECRET>` 로 1회 접속하면 그 브라우저에 플래그 저장 → 이후 계속 노출.
 * `?op=off` 로 끌 수 있다. 방문자는 플래그가 없어 절대 안 보임.
 *
 * ⚠️ 클라이언트 플래그라 강력한 보안은 아님(코드 뜯으면 SECRET 노출). 다만
 *    일반 방문자에게 운영 도구를 가리는 용도로는 충분하다.
 */
const SECRET = "qmin-ops-2026";
const KEY = "op";

export function useOperator(): boolean {
  const [op, setOp] = useState(false);

  useEffect(() => {
    try {
      const param = new URL(window.location.href).searchParams.get("op");
      if (param === SECRET) localStorage.setItem(KEY, "1");
      else if (param === "off") localStorage.removeItem(KEY);
      setOp(localStorage.getItem(KEY) === "1");
    } catch {
      /* localStorage 접근 불가 시 비활성 */
    }
  }, []);

  return op;
}
