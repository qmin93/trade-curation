import { ConsoleBody } from "@/components/ConsoleBody";

/** 운영자 전용 콘솔 페이지 — `#op=` 해시로만 열린다. 본체는 ConsoleBody(팝업과 공유). */
export default function OpsPage() {
  return <ConsoleBody />;
}
