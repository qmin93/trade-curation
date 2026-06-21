export type PersonaSlug =
  | "signal"
  | "ist"
  | "daily"
  | "lab"
  | "pick"
  | "scalper";

export interface Persona {
  slug: PersonaSlug;
  name: string;
  benchmark: string;
  benchmarkFollowers: string;
  signature: string;
  toneDescription: string;
  emoji?: string;
  color: string;
}

export const PERSONAS: Persona[] = [
  {
    slug: "signal",
    name: "단타시그널",
    benchmark: "s_trader91",
    benchmarkFollowers: "21만 / viral 456",
    signature: "본인 매매 룰에 맞다면 관심",
    toneDescription: "짧음·dash list·시초가 단발 자리·진중",
    color: "#1e3a8a",
  },
  {
    slug: "ist",
    name: "단타이스트",
    benchmark: "insights_trader86",
    benchmarkFollowers: "6만 / viral 318",
    signature: "도망치면 답 없습니다",
    toneDescription: "격언+감정·자리 통찰·진중",
    color: "#7f1d1d",
  },
  {
    slug: "daily",
    name: "단타데일리",
    benchmark: "원본 시그너처",
    benchmarkFollowers: "",
    signature: "신호 검증 후만. 결정은 본인의 몫",
    toneDescription: "[MM/DD]·1./2./3.·격식체 시황 종합",
    color: "#1f2937",
  },
  {
    slug: "lab",
    name: "단타Lab",
    benchmark: "badakstock",
    benchmarkFollowers: "5.3만 / viral 207",
    signature: "진짜 이유 짐작이나 가십니까?",
    toneDescription: "큰따옴표 헤더·통찰·메커니즘 분석",
    color: "#581c87",
  },
  // 단타Pick(slug: "pick", junseokstock) — 2026-06-13 정지. 로스터에서 제외(필요 시 복구).
  // PersonaSlug 타입엔 "pick" 유지(다른 코드 호환). threads-caption.ts PERSONAS도 동일하게 제외됨.
  {
    slug: "scalper",
    name: "스캘퍼",
    benchmark: "heoyoopapa",
    benchmarkFollowers: "1.3만 / 정형 검증",
    signature: "시초가 갭 어디서?",
    toneDescription: "🟢 [MM/DD] · 🔸 · 📊 인포그래픽 카드",
    emoji: "🟢",
    color: "#15803d",
  },
];

export function getPersonaBySlug(slug: PersonaSlug): Persona | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}
