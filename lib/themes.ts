export interface Theme {
  slug: string;
  label: string;
  description: string;
  tier: 1 | 2 | 3;
  emoji?: string;
}

export const THEMES: Theme[] = [
  {
    slug: "반도체",
    label: "반도체",
    description: "삼성전자·SK하이닉스·HBM·D램 — 코스피 메가캡 라인.",
    tier: 1,
  },
  {
    slug: "AI-데이터센터",
    label: "AI 데이터센터",
    description: "JP모건 2026~2030 5조 달러 투자 전망·전력·메모리 수혜.",
    tier: 1,
  },
  {
    slug: "HBM",
    label: "HBM",
    description: "고대역폭 메모리·SK하이닉스 글로벌 1위·NVIDIA·AMD 수요.",
    tier: 1,
  },
  {
    slug: "원전-SMR",
    label: "원전·SMR",
    description: "두산에너빌리티·현대건설·미 에너지부 예산·2035년 650조 시장.",
    tier: 2,
  },
  {
    slug: "전력-인프라",
    label: "전력 인프라",
    description: "HD현대일렉·LS일렉트릭·효성중공업·북미 변압기 수출.",
    tier: 2,
  },
  {
    slug: "로봇",
    label: "휴머노이드·로봇",
    description: "두산로보틱스·로보스타·삼성·LG 단계 도입.",
    tier: 2,
  },
  {
    slug: "2차전지",
    label: "2차전지·배터리",
    description: "삼성SDI·LG에너지솔루션·엘앤에프·전기차 배터리.",
    tier: 3,
  },
  {
    slug: "ChatGPT",
    label: "ChatGPT·OpenAI",
    description: "삼성SDS·삼성 외부 AI 전면 도입·OpenAI 협력.",
    tier: 3,
  },
];

export function getThemeBySlug(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slug === slug);
}
