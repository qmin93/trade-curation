import type { PersonaSlug } from "./personas";

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
  personaComments: Partial<Record<PersonaSlug, string>>;
}

export const NEWS_MOCK: NewsItem[] = [
  {
    id: "20260609-hynix-rebound",
    date: "2026-06-09",
    headline: "美 반도체 반등…삼성전자 30만원·SK하닉 203만원 탈환",
    summary:
      "프리마켓 삼성전자 +6.09% (313,500원)·SK하이닉스 +8.06% (2,065,000원) 상승. 중동 지정학 리스크 완화 + 미 반도체주 반등이 트리거. 코스피 시초 +2.85% (7697.76)·코스닥 +2.89% (937.69).",
    source: "fnnews",
    sourceUrl: "https://www.fnnews.com/news/202606090818598575",
    keywords: ["하이닉스", "삼성전자", "시초가", "반등", "HBM"],
    stocks: ["SK하이닉스", "삼성전자"],
    personaComments: {
      signal:
        "어제 -10%대 폭락 후 반도체 시초가 강반등.\n- 삼성전자 +6.09% (313,500).\n- SK하이닉스 +8.06% (2,065,000).\n- 트리거: 미 반도체주 반등·중동 리스크 완화.\n\n본인 매매 룰에 맞다면 관심.",
      ist:
        "SK하이닉스 어제 -7.68% → 오늘 시초 +8.06% (2,065,000).\n하루 만에 자리 뒤집힌 라인입니다.\n\n이런 자리는 도망치면 답 없습니다.\n\n신호 검증 후만·무리한 추격 X.",
      scalper:
        "🟢 [06/09] 시초가 단발 이슈\n\n🔸 이슈\n코스피 7697.76·+2.85% 시초 출발\n코스닥 937.69·+2.89% 동반\n어제 폭락 후 갭 자극\n\n📊 자리\n단발 대응·추격 X\n\n시초가 갭 어디서?",
    },
  },
  {
    id: "20260609-sidecar",
    date: "2026-06-09",
    headline: "코스피 급반등·매수 사이드카 발동 (+4.21%)",
    summary:
      "6월 9일 9시 1분 코스피 +315.11p (+4.21%) 상승한 7799.52에서 매수 사이드카 발동. 어제 검은 월요일 -8.29% (7484) 마감 후 320p 회복.",
    source: "newspim",
    sourceUrl: "https://www.newspim.com/news/view/20260609000200",
    keywords: ["코스피", "매수 사이드카", "반등", "사이드카"],
    stocks: ["코스피"],
    personaComments: {
      daily:
        "[06/09] 오늘 짚어볼 시황\n\n검은 월요일 후 코스피 +4.21% 급반등 (+315p, 7799.52).\n\n1. 9시 1분 매수 사이드카 발동 — 올해 12번째\n2. 7480대 → 7799·320p 반등 회복\n3. 단타 관점: 단발 반등 자리. 추격 X·기준 검증 후.\n\n신호 검증 후만. 결정은 본인의 몫.",
    },
  },
  {
    id: "20260609-rebound-reason",
    date: "2026-06-09",
    headline: "코스피 7500선 위협…6월 후반 반등 가능성 주목 [모닝 리포트]",
    summary:
      "어제 -8.29% 폭락의 본질은 4월~6월 4일 필라델피아 반도체 +80% 차익실현 압력. 브로드컴 AI 가이드·미 고용지표는 빌미. 대신증권 — 서킷브레이커 후 D+5/20/60일 통계상 회복률 高.",
    source: "newspim",
    sourceUrl: "https://www.newspim.com/news/view/20260609000081",
    keywords: ["반도체", "외인", "FOMC", "검은 월요일"],
    stocks: ["삼성전자", "SK하이닉스"],
    personaComments: {
      lab:
        '어제 -8.29% 폭락의 진짜 이유, 짐작이나 가십니까?\n\n1. 브로드컴 AI 논란·미 고용지표 = 빌미일 뿐\n2. 4월~6월 4일 필라델피아 반도체 +80% — 차익실현 압력 폭발이 본질\n3. 대신증권 — 서킷브레이커 후 D+5·20·60일 통계상 회복률 高\n\n차트 뒤 진짜 판은 어디?',
    },
  },
  {
    id: "20260528-pension-20",
    date: "2026-05-28",
    headline: "국민연금, 국내주식 비중 14.9 → 20.8% 대폭 상향",
    summary:
      "기금운용위원회 5월 28일 확정. 코스피 25% 상승·실질 비중 19%대 도달로 매물 폭탄 우려 해소. 4개월 만 5.9%p 상향. 국내채권·대체투자는 0.3%p 하락.",
    source: "investchosun",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/28/2026052880186.html",
    keywords: ["연금", "국민연금", "외인", "코스피"],
    stocks: ["삼성전자", "SK하이닉스"],
    personaComments: {
      ist:
        "국민연금 국내 주식 비중 14.9 → 20.8% 상향 (5.9%p).\n하이닉스·삼성전자 매물 폭탄 우려 해소·매수 라인입니다.\n\n이런 자리는 도망치면 답 없습니다.\n\n오늘 연금이 받는 라인 어디서 풀릴까요?",
    },
  },
  {
    id: "20260609-samsung-sds",
    date: "2026-06-09",
    headline: "삼성, 전체 관계사 모든 업무에 외부 생성형 AI 도입 [속보]",
    summary:
      "삼성 6월부터 챗GPT·제미나이·클로드 등 외부 생성형 AI 전면 허용. DX부문 → 전 관계사 확대. 삼성SDS는 OpenAI 협력 ChatGPT 리셀러 자격 + 국가 AI 컴퓨팅센터 단독 입찰 기술평가 통과로 정통 수혜.",
    source: "naver",
    sourceUrl: "https://n.news.naver.com/mnews/article/374/0000514958?sid=101",
    keywords: ["삼성", "AI", "ChatGPT", "삼성SDS"],
    stocks: ["삼성SDS", "삼성전자"],
    personaComments: {
      pick:
        "삼성에스디에스 봤습니다.\n오늘 [속보] 삼성 외부 생성형 AI 전면 도입 (제미나이·챗GPT·클로드).\nSDS는 OpenAI 협력 ChatGPT 리셀러 자격 + 외부 AI 도입 정통 수혜주.\n\n오늘 자리 잘 잡혔으면 좋겠습니다. 이거 어디까지 갈까요?",
    },
  },
  {
    id: "20260609-7700-recovery",
    date: "2026-06-09",
    headline: "[속보] 코스피, 7700선 회복…매수 사이드카 발동",
    summary:
      "코스피가 9일 장 초반 급등하면서 매수 사이드카 발동. 전날 대폭 하락 후 시초가 갭으로 단타 투자자 매수 심리 자극.",
    source: "asiae",
    sourceUrl: "https://www.asiae.co.kr/article/2026060909155628162",
    keywords: ["코스피", "시초가", "갭", "매수 사이드카"],
    stocks: ["코스피"],
    personaComments: {},
  },
];

export function getNewsByKeyword(keywordLabel: string): NewsItem[] {
  return NEWS_MOCK.filter((n) =>
    n.keywords.some(
      (k) => k.toLowerCase() === keywordLabel.toLowerCase() || k.includes(keywordLabel),
    ),
  );
}

export function getRecentNews(limit = 10): NewsItem[] {
  return [...NEWS_MOCK]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
