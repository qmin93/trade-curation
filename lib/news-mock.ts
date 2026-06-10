import type { PersonaSlug } from "./personas";

export interface NewsItem {
  id: string;
  date: string;
  /** 원본 기사 실제 게시 시각 (ISO·KST 권장, 예: "2026-06-10T07:40:00+09:00"). 카드에 날짜+시각으로 표시. */
  publishedAt?: string;
  headline: string;
  summary: string;
  source: string;
  sourceUrl: string;
  keywords: string[];
  stocks: string[];
  personaComments: Partial<Record<PersonaSlug, string>>;
}

export const NEWS_MOCK: NewsItem[] = [
  // ── 발굴 채널(FastStockNews·여의도스토리·타자 등) → 원본 기사 출처 + 직접 요약 (2026-06-10) ──
  {
    id: "20260610-alchera-physicalai",
    date: "2026-06-10",
    publishedAt: "2026-06-10T11:34:00+09:00",
    headline: "알체라, 340억 '피지컬 AI' 국책과제 참여…LG전자 주관 컨소시엄",
    summary:
      "알체라가 총 340억원 규모의 '피지컬 AI 선도기술개발' 국책 컨소시엄에 참여한다고 밝혔습니다(2026.5~2027.12). LG전자가 주관하고 마음AI·로보티즈·KT·KAIST·서울대 등 10개 산학연이 함께하는데, 알체라는 피지컬 AI 데이터 수집·정제·품질검증 등 데이터 파이프라인 공급을 맡습니다. 휴머노이드·로봇 파운데이션 모델(RFM) 테마에서 데이터 쪽 수혜 라인으로 봅니다.",
    source: "v.daum.net",
    sourceUrl: "https://v.daum.net/v/20260610113443576",
    keywords: ["알체라", "피지컬AI", "로봇", "LG전자"],
    stocks: ["알체라", "LG전자"],
    personaComments: {},
  },
  {
    id: "20260610-samsung-foundry",
    date: "2026-06-10",
    headline: "TSMC 병목에 삼성 파운드리 반사수혜…구글, 인텔에 TPU 300만개 위탁",
    summary:
      "TSMC가 1분기 파운드리 점유율 73%로 압도적이지만 빅테크 AI칩 주문 폭증에 캐파가 한계에 달했습니다. 구글이 자체 TPU의 2027~2028년 예상 물량 600만개 중 300만개 이상을 인텔에 맡기기로 하면서, 2위 삼성전자(점유율 7%)에도 낙수 기대가 붙었습니다. 삼성은 엔비디아 자율주행·그록 칩 협력에 미국 테일러 2나노 양산을 앞두고 있어 파운드리 부문 3분기 흑자전환 가능성이 거론됩니다.",
    source: "heraldcorp.com",
    sourceUrl: "https://biz.heraldcorp.com/article/10768088",
    keywords: ["삼성전자", "파운드리", "TSMC", "AI"],
    stocks: ["삼성전자"],
    personaComments: {},
  },
  {
    id: "20260610-hwashin-robot",
    date: "2026-06-10",
    headline: "화신정공, 보스턴다이나믹스 휴머노이드 공급망 기대에 상한가",
    summary:
      "현대차그룹 계열 보스턴다이나믹스가 국내 협력사 휴머노이드 부품 공급망 점검에 나선 가운데, 엔지니어들이 지난 5일 현대차 협력사 화신정공(경북 영천)을 비공개 방문한 사실이 알려지며 8일 상한가(+29.95%·2,625원)를 찍었습니다. 아틀라스 로봇 부품 공급망 편입 기대가 주가에 반영된 것으로, 휴머노이드 테마 단타 라인입니다. 다만 아직 계약이 아닌 '방문·점검' 단계라 재료 확정 전 변동성에는 유의할 자리로 봅니다.",
    source: "newspim.com",
    sourceUrl: "https://www.newspim.com/news/view/20260608000306",
    keywords: ["화신정공", "보스턴다이나믹스", "휴머노이드", "로봇"],
    stocks: ["화신정공"],
    personaComments: {},
  },
  {
    id: "20260610-saltware-claude",
    date: "2026-06-10",
    headline: "앤트로픽, 국내 '클로드' 리셀러 6곳 선정…솔트웨어 등 수혜",
    summary:
      "앤트로픽이 지난해 말 국내 클로드 리셀러 파트너 6곳을 선정한 사실이 확인됐습니다. LG CNS·삼성SDS·엔디에스·솔트웨어 등이 포함됐는데, 국가별 쿼터 할당 + 글로벌 본사가 사업 파이프라인을 직접 검증하는 방식으로 뽑혔습니다. 클로드 국내 상륙 본격화 기대에 솔트웨어 등 관련주가 강세를 보인 흐름으로, 앤트로픽·클로드 테마 단타 라인입니다.",
    source: "ddaily.co.kr",
    sourceUrl: "https://www.ddaily.co.kr/page/view/2026060907463571946",
    keywords: ["솔트웨어", "앤트로픽", "클로드", "AI"],
    stocks: ["솔트웨어", "삼성SDS"],
    personaComments: {},
  },
  {
    id: "20260610-spire-spacex",
    date: "2026-06-10",
    publishedAt: "2026-06-10T10:56:00+09:00",
    headline: "스피어, 美 우주항공 발사업체에 특수합금 공급계약 또 체결 (매출 대비 21.08%)",
    summary:
      "스피어가 미국 글로벌 우주항공 발사업체와 특수합금 공급계약(최근 매출 대비 21.08%·약 5.4억원)을 또 체결했다고 6월 10일 공시했습니다. 작년 12월부터 19~21%대 규모의 동일 계약을 반복 수주하며 52주 신고가를 찍어온 종목으로, 스페이스X 상장 D-2 분위기와 맞물린 우주항공 테마 단타 라인입니다. 다만 건당 규모(5억원대)가 크지 않아 재료 소멸·차익실현 변동성에는 유의할 자리로 봅니다.",
    source: "dart.fss.or.kr",
    sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260610901022",
    keywords: ["스피어", "우주항공", "스페이스X", "특수합금"],
    stocks: ["스피어"],
    personaComments: {},
  },
  {
    id: "20260610-wf6-husteel",
    date: "2026-06-10",
    publishedAt: "2026-06-10T05:43:00+09:00",
    headline: "반도체 소재 '육불화텅스텐' 품귀…후성·SK스페셜티 가격 70~90% 인상 통보",
    summary:
      "반도체 금속배선 공정 핵심 원료인 육불화텅스텐(WF6) 가격이 1년 새 232.7% 폭등했습니다. 중국의 텅스텐 수출 규제로 원재료 APT는 557%, 텅스텐 파우더는 6~7배 뛰었고, 글로벌 공급의 25%를 맡던 일본 업체들이 하반기 감산을 예고하면서 품귀가 심해졌습니다. 국내 생산사인 후성·SK스페셜티는 삼성전자·SK하이닉스 등 고객사에 올해 계약가를 70~90% 올리겠다고 통보한 상태라, 가격 전가가 그대로 실적으로 잡히는 구조로 봅니다.",
    source: "theguru.co.kr",
    sourceUrl: "https://www.theguru.co.kr/mobile/article.html?no=102878",
    keywords: ["후성", "반도체", "소재", "텅스텐"],
    stocks: ["후성", "SK스페셜티"],
    personaComments: {},
  },
  {
    id: "20260610-tsmc-may-rev",
    date: "2026-06-10",
    publishedAt: "2026-06-10T06:08:00+09:00",
    headline: "TSMC 5월 매출 +30%…AI 칩 공급부족에 파운드리 '쟁탈전'",
    summary:
      "TSMC의 5월 매출이 416억9750만 대만달러(약 20조원)로 전년 대비 30.1% 늘었고, 1~5월 누적도 30% 증가했습니다. 단순 업황 회복이 아니라 엔비디아·AMD·브로드컴·애플의 AI 서버용 GPU·ASIC 수요가 한꺼번에 몰리며 첨단공정 캐파가 부족해진 게 본질입니다. TSMC 독점에도 균열 조짐이 보이는데, 엔비디아·구글이 인텔 파운드리를 예비 공급선으로 검토하고 삼성전자도 차세대 파운드리 협력 확대를 논의 중입니다.",
    source: "inews24.com",
    sourceUrl: "https://www.inews24.com/view/1975415",
    keywords: ["TSMC", "AI", "파운드리", "삼성전자"],
    stocks: ["삼성전자", "TSMC"],
    personaComments: {},
  },
  {
    id: "20260610-webzen-buyback",
    date: "2026-06-10",
    publishedAt: "2026-06-10T06:11:00+09:00",
    headline: "웹젠, 100억 자사주 추가 매입…올해 주주환원 1000억",
    summary:
      "웹젠이 약 100억원(110만주) 규모 자사주 추가 매입을 발표했습니다. 5월 363만주(유통주식 10.5%·장부가 529억) 소각, 3월 203억원 배당에 이은 조치로 올해 누적 주주환원은 1000억원, 시총의 약 31%에 달합니다. 게임 본업 모멘텀보다 강한 주주환원 카드로 수급 바닥을 다지려는 흐름으로 봅니다.",
    source: "edaily.co.kr",
    sourceUrl: "https://www.edaily.co.kr/news/newspath.asp?newsid=04372246645480408",
    keywords: ["웹젠", "자사주", "주주환원", "게임"],
    stocks: ["웹젠"],
    personaComments: {},
  },
  {
    id: "20260610-hanwha-tcbonder",
    date: "2026-06-10",
    publishedAt: "2026-06-10T06:21:00+09:00",
    headline: "한화세미텍, SK하이닉스에 HBM4용 TC 본더 공급",
    summary:
      "한화세미텍이 SK하이닉스에 6세대 HBM4용 열압착(TC) 본더를 공급합니다. 비상장사라 공시는 없지만 경쟁사 한미반도체가 8일 공시한 442억원과 비슷한 규모로 파악됩니다. HBM4는 엔비디아 차세대 플랫폼 '베라 루빈'에 탑재되고 메모리 3사 모두 품질평가를 통과해 양산 중인 단계라 본더 장비주에 직접 수혜로 연결됩니다. 한화세미텍 올해 산업장비 매출은 작년 4600억 대비 20% 이상 성장이 전망됩니다.",
    source: "zdnet.co.kr",
    sourceUrl: "https://zdnet.co.kr/view/?no=20260610151635",
    keywords: ["한화세미텍", "HBM", "하이닉스", "장비"],
    stocks: ["한화세미텍", "SK하이닉스"],
    personaComments: {},
  },
  {
    id: "20260610-pamicell-nvidia",
    date: "2026-06-10",
    publishedAt: "2026-06-10T07:02:00+09:00",
    headline: "파미셀, 엔비디아 AI서버용 CCL 소재 두산에 독점 공급",
    summary:
      "파미셀이 두산의 AI 서버용 동박적층판(CCL)에 들어가는 핵심 소재(저유전 수지·경화제)를 독점 공급합니다. '파미셀 소재 → 두산 CCL → 엔비디아 AI서버'로 이어지는 구조로, 1분기 매출이 367억원(+36%)·그중 저유전 소재가 260억원(71%)을 차지했습니다. 공급 개시 시점 대비 약 7.6배 성장했고, 울산 3공장(300억 투자)이 2027년 1분기 가동되면 캐파가 두 배로 늘어납니다.",
    source: "thelec.kr",
    sourceUrl: "https://www.thelec.kr/news/articleView.html?idxno=57879",
    keywords: ["파미셀", "엔비디아", "AI", "소재"],
    stocks: ["파미셀", "두산"],
    personaComments: {},
  },
  {
    id: "20260610-hanwha-hybridbond",
    date: "2026-06-10",
    publishedAt: "2026-06-10T07:40:00+09:00",
    headline: "한화세미텍, 하이닉스에 하이브리드 본딩 통합시스템 공급",
    summary:
      "한화세미텍이 SK하이닉스에 다이-투-웨이퍼(D2W) 하이브리드 본딩 클러스터('SHB2 나노')를 공급해 4월 반입 후 품질평가 중입니다. 하이브리드 본딩은 나노 단위 초미세 접합 기술로 차세대 HBM 적층의 핵심인데, 경쟁 제품(어플라이드-베시 '키넥스')이 150억~200억원대인 고부가 장비입니다. 앞서의 HBM4용 TC 본더 수주와 함께, 하이닉스 장비 공급망에서 한화세미텍 비중이 확대되는 흐름입니다.",
    source: "thelec.kr",
    sourceUrl: "https://www.thelec.kr/news/articleView.html?idxno=57884",
    keywords: ["한화세미텍", "하이브리드본딩", "하이닉스", "HBM"],
    stocks: ["한화세미텍", "SK하이닉스"],
    personaComments: {},
  },
  {
    id: "20260609-hynix-rebound",
    date: "2026-06-09",
    headline: "美 반도체 반등…삼성전자 30만원·SK하닉 203만원 탈환",
    summary:
      "어제 -10%대 폭락의 충격이 하루 만에 되돌려졌습니다. 프리마켓에서 삼성전자가 +6%, SK하이닉스가 +8% 뛰며 각각 30만원·203만원 선을 되찾았고, 코스피·코스닥도 +2.8%대로 출발했습니다. 미국 반도체주 반등과 중동 지정학 리스크 완화가 동시에 작용한 결과인데, 폭락 직후 나온 갭 반등인 만큼 추격보다는 본인 매매 룰에 맞는 자리인지부터 확인하는 게 안전합니다.",
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
      "개장 1분 만에 코스피가 +4.21%(+315p) 치솟으며 올해 12번째 매수 사이드카가 걸렸습니다. 전날 '검은 월요일' -8.29%로 7484까지 밀렸던 지수가 단숨에 320p를 회복한 건데, 낙폭과대에 따른 단발성 반등 성격이 짙습니다. 기준 없이 따라붙기엔 부담스러운 구간이라 보고 있습니다.",
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
      "폭락의 진짜 원인은 뉴스가 아니라 수급이었습니다. 브로드컴 AI 가이드 논란과 미 고용지표는 빌미였을 뿐, 4월부터 6월 초까지 필라델피아 반도체지수가 +80% 오르며 쌓인 차익실현 압력이 한꺼번에 터진 게 본질이라는 분석입니다. 대신증권은 과거 서킷브레이커 이후 5·20·60일 통계상 회복률이 높았던 점을 들어 6월 후반 반등 가능성에 무게를 뒀습니다.",
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
      "국민연금이 국내주식 목표 비중을 14.9%에서 20.8%로 4개월 만에 5.9%p나 끌어올렸습니다(5/28 기금운용위 확정). 코스피가 25% 오르며 실질 비중이 이미 19%대에 닿아 '연금 매물 폭탄' 우려가 컸는데, 이번 상향으로 오히려 매수 여력이 생긴 셈입니다. 삼성전자·SK하이닉스 같은 대형주엔 수급 측면에서 분명한 호재로 봅니다.",
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
      "삼성이 6월부터 전 관계사 업무에 챗GPT·제미나이·클로드 등 외부 생성형 AI를 전면 허용합니다. DX부문에서 시작해 그룹 전체로 확대하는 구조입니다. 직접 수혜로는 삼성SDS가 꼽히는데, OpenAI와 협력해 ChatGPT 리셀러 자격을 갖췄고 국가 AI 컴퓨팅센터 단독 입찰 기술평가도 통과한 상태라 가장 정통한 라인으로 보입니다.",
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
      "코스피가 장 초반 급등해 7700선을 회복하면서 매수 사이드카가 발동됐습니다. 전날 대폭 하락 뒤 나온 큰 시초가 갭이 단타 매수 심리를 자극한 흐름입니다. 같은 사이드카 이슈가 매체별로 반복 보도되는 만큼, 새로운 재료라기보단 동일 이벤트의 후속 기사로 보는 게 맞습니다.",
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
