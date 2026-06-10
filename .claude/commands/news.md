---
description: 통합 /news — ① Threads 6페르소나 카피 생성 ② FastStockNews 발굴→원본 기사 직접 요약→dantatrade 사이트 카드(news-mock.ts) 갱신. 한 번 호출로 둘 다 산출.
---

# /news (통합본) — Threads 카피 + dantatrade 사이트 큐레이션

이 커맨드는 **두 산출물을 한 번에** 만든다:
- **(파트 A)** Threads 활성 6페르소나 게시용 본문 (복붙용)
- **(파트 B)** dantatrade.vercel.app 사이트의 큐레이션 카드 (`lib/news-mock.ts`)

> ⚠️ corpus·페르소나 docs·배치 스크립트는 **managerkim(autowork) repo**에 있다. 이 커맨드는 trade-curation repo에 살지만, 아래 **절대경로**로 그 파일들을 참조하므로 어느 폴더에서 실행해도 작동한다.
> - autowork 루트: `C:/Users/yangjong/OneDrive/바탕 화면/autowork`
> - trade-curation 루트: `C:/Users/yangjong/OneDrive/바탕 화면/trade-curation`

추가 인자(선택): `$ARGUMENTS`

---

# ════════ 파트 A — Threads 6페르소나 카피 ════════

## 📚 페르소나 corpus 참조 (의무)

카피 작성 직전, 해당 페르소나 corpus 읽고 시그니처 표현·이모지·줄바꿈 패턴 학습. (절대경로)

- 짭짭단타복서 → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/jabjab.boxer.md`
- 단타민족 → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/dantabaedal.md`
- 단타데일리 → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/dailydanta7.md`
- 단타Lab → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/danta_lab.md`
- 단타Pick → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/dantapick.md`
- 스캘퍼 → `C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas-corpus/dantascalper.md`

corpus 갱신 필요 시 `/corpus` 또는 `/corpus <slug>` 호출 (수동).

⚠️ **2026-05-28 운영 변경**: T레이더 (Ch3 @t_radar1) 영구 정지 → 활성 페르소나 6개 (짭짭·민족·데일리·Lab·Pick·스캘퍼). 단타트레이더(Ch4)·단타데스크(Ch6)는 기존 정지. _news_batch.py는 9채널 모두 fetch하지만 **카피 생성·게시는 활성 6개만**.

## 🚨 발사 전 검증 (필수)

1. **오늘 날짜·요일·휴장 확인** — WebSearch로 "오늘 한국 주식시장 휴장" 또는 KRX 영업일 확인
2. **평일·개장일 아니면 STOP** — 사용자에게 "오늘 휴장/주말입니다. 진행 안 함" 알림
3. **평일·개장일이면 진행**

## 1단계: _news_batch.py 실행

```bash
python C:/Users/yangjong/.cokacdir/workspace/xsz664nk/_news_batch.py
```

이 스크립트가 9채널에서 자동 추출:

| Ch | 텔방 channel | 페르소나 |
|----|-------------|---------|
| 1 | FastStockNews | 짭짭단타복서 |
| 2 | jeilstock | 단타민족 |
| 3 | YeouidoStory2 | T레이더 (정지) |
| 4 | tazastock | 단타트레이더 (정지) |
| 5 | slav_insight | 단타데일리 |
| 6 | realtime_stock_news | 단타데스크 (정지) |
| 7 | stock_messenger | 단타Lab |
| 8 | FastStockNews | 단타Pick |
| 9 | tazastock | 스캘퍼 |

- 출력물:
  - 사진: `_news_<acc_id>_<channel>.jpg` (예 `_news_1_FastStockNews.jpg`)
  - stdout: `[N] {계정명}` + `text: {본문 120자}` + `article_url: {URL}`

## 2단계: URL 검증 (★★★★ 절대 룰)

각 채널의 `article_url`이 다음 중 하나여야:
- ✅ `n.news.naver.com/mnews/article/XXX/YYYYYYY` (네이버 뉴스 기사 ID 포함 full URL)
- ✅ `naver.me/XXXX` (네이버 단축 링크 — 8자 이상)
- ✅ 매체 직링크 + 기사 path/ID 포함 (예 `theguru.co.kr/news/article.html?no=102261`)

거부 (root URL은 절대 X):
- ❌ `https://blockmedia.co.kr` (홈페이지) / `https://hankyung.com` (홈페이지) / 로고만 뜨는 root 도메인

**URL이 root인 채널 처리**: 그 채널 글 발행 X · 또는 동일 종목 다른 채널 URL로 대체 · 또는 본문에서 종목명+호재로 WebSearch해 정식 기사 URL 확보.
**article_url 없는 채널** (Ch2·4·5·7·9 종종): 1차 본문 텍스트→WebSearch로 정식 기사 URL / 2차 못 찾으면 그 채널 글 발행 X.

## 3단계: 본문 룰 — 수동글 톤

⚠️ **5단 정형 구조 의무 폐기**. 수동글 톤 우선 — AI 양산형 X.

### 페르소나별 본문 길이·구조
| 페르소나 | 길이 | 구조 |
|---------|------|------|
| 짭짭·민족·Pick·스캘퍼 | 3~5줄 | 자유 (자연스럽게 흐름) |
| Lab | 3~5줄 | 큰따옴표 1줄 + 반박·통찰 |
| 데일리 | 5~7줄 | 격식체 + 1./2./3. 번호 OK (의무 X) |

### 🎯 최종 벤치 매핑 (2026-06-09 락)
6 페르소나 다 단일 벤치만 따른다·시그너처 결합 X·짧음(3~6줄)·1만+·viral 검증·단타·국내.

| 페르소나 | 단일 벤치 | 시그너처 |
|---------|--------|--------|
| 단타시그널 (jabjab.boxer) | s_trader91 | 짧음·dash list·"본인 기준에 맞다면 관심" |
| 단타이스트 (dantabaedal) | insights_trader86 | 격언+감정·"도망치면 답 없음" |
| 단타데일리 (dailydanta7) | 원본 시그너처 | "오늘의 데일리 픽 / 1./2./3. / 결정은 본인의 몫" |
| 단타Lab (danta_lab) | badakstock | "진짜 이유 짐작이나 가십니까?" 시리즈 |
| 단타Pick (dantapick) | junseokstock | 친근 자기확신·"오늘 자리 잘 잡혔으면" |
| 스캘퍼 (dantascalper) | heoyoopapa | 🟢 [MM/DD] / 🔸 / 📊 인포그래픽 카드 |

- 각 페르소나 단일 벤치만 (혼합 X) · 본문 2~4줄 · 시그너처 결합 X · 1만+ viral 100+ 채널만 · 단타·급등주·국내만(미국주식·자산배분 X).
- 톤 보강(회전): asset.x2(친근 일상+투자 비유, 주2~3회·이스트·Pick) / bstory(D-Day hook+매크로, 주1회·데일리·Lab). 메인 시그너처 70% + 보강 30% 회전. 7일 같은 톤 반복 X.

### 🎯 진중 모드 (2026-06-08·우선)
촐싹·캐릭터화·코믹 X. 차분·정직·신중.
1 자음 절제(ㅋㅋ·ㄷㄷ 1게시 1회) · 2 이모지 시그너처 1개만(🛵 민족·⚡ 스캘퍼) · 3 슬랭 X · 4 캐릭터 패러디 X · 5 헤더 차분 · 6 결말 차분 의문 · 7 본인 매매 정직(손절 숨김 X) · 8 신호 검증 강조("근거 분명한 자리만"·"무리한 추격 X").

### 📰 뉴스 자료 필터 (필수)
✅ 한국 상장사 호재(실적·M&A·계약·수주) · 단타 테마(스테이블코인·AI 데이터센터·로봇·반도체·바이오·원전·방산) · 시초가 갭 자극 이벤트 · 코스닥 급등주.
❌ 매크로 단순(FOMC 결정만) · 미국 빅테크 단순 보도 · 증여세·세무 · 환율·금리 단독(단 Lab·데일리 매크로 통찰은 OK).

### ❓ 본문 끝 의문형 의무
모든 페르소나 마지막 줄 의문형. 명령형·단정형 X → 의문형 변형. 시그니처 이모지 같이.

### 수동글 11원칙 (필수)
1 자연스럽게 3~5줄(데일리만 5~7) · 2 감정 자음 적절 · 3 슬랭 적절 · 4 개인 멘트 1줄 의무 · 5 말투 페르소나별 · 6 종목명·숫자·이벤트 정확(헤드라인 복붙 X·톤만 변주) · 7 ⛔AI 양산어 X("위험자산 선호↑·추격 위험·회복 자리·검증 통과·갭 소화") · 8 ⛔픽·시그널 톤 X("답이다·끊는다·잡는다·단발·자리 잡힌다") · 9 사실+맥락 결합 · 10 변주 라이브러리 활용 · 11 약속 멘트 가끔만(3건당 1건).

### 페르소나 시그니처
- 짭짭: "자, [컨텍스트]" + ㅋㅋ / 민족: "🛵 손님~" / 데일리: "[MM/DD] [상황]" + 출처 URL 의무 / Lab: `"통념?"` + 반박 / Pick: 반말 + 😊 / 스캘퍼: "⚡" + 화살표 →

### 🔄 자연 톤 회전 라이브러리
매 호출 시 페르소나별 5옵션 중 다른 톤 회전 → 6개가 매번 다른 시점·각도.
- 반말(짭짭·Pick·스캘퍼): A 실시간 발견 / B 차트 보다가 / C 친구 카톡 / D 혼잣말 / E 자기 검색 회고
- 친근 존댓말(민족): F 배달 콜 / G 배달 회고 / H 주방 톤 / I 출근길 / J 한 박자 늦게
- 격식체(데일리): K 관전 포인트 / L 시황 정리 / M 분기점 / N 한 줄 정리 / O 매크로 메모
- 통찰 격식(Lab): P 통념 반박 / Q 큰따옴표 관찰 / R 표면 vs 진짜 / S 자금 흐름 / T 패턴 발견
- 룰: 매 호출 6 페르소나 다 다른 알파벳 · 7일간 같은 옵션 반복 X.

## 4단계: 재작성 룰 (★★★★)
- 원문 헤드라인 복붙 절대 금지 → 핵심 사실만 추출 → 페르소나 톤으로 풀어쓰기. 종목명·숫자·이벤트 정확.
- 패턴화 금지: 같은 페르소나 2건+ 시 고정 문구 반복 X.

## 5단계: 페르소나 톤 매핑
`C:/Users/yangjong/OneDrive/바탕 화면/autowork/docs/threads-personas.md` 카드 참조. **활성 6개**: 짭짭/민족/데일리/Lab/Pick/스캘퍼. **정지 3개**(T레이더·단타트레이더·단타데스크): 카피 X, 텔방 fetch만(참조용).

## 6단계: 출력 형식 (★★★★ 복붙용)
```
[1/6] 짭짭단타복서
```
{본문}

출처: {기사 URL}
```
사진: C:/Users/yangjong/.cokacdir/workspace/xsz664nk/_news_1_FastStockNews.jpg
```
... (활성 6개 반복) — **본문 외 설명·해설 출력 금지**.

## 7단계: 검증 체크리스트 (출력 직전)
- [ ] 인용 헤드라인이 news_batch 결과와 일치 / 종목명·숫자 정확 / URL 룰 준수(root 0건) / 페르소나 시그니처 적용 / 6개가 매번 다른 표현.

## 8단계: stop-slop 검사 (의무)
전체 카피 작성 후 **stop-slop skill 1회 invoke**로 AI 양산 단어 검사 → 발견 시 자연어 수정 → 재검사 → 통과 후 출력.

## 법적 주의 (자동 적용)
"정보 공유·교육" 톤 · 면책 멘트 자동 삽입 · 추측·소문 X·출처 URL 명시.

---

# ════════ 파트 B — dantatrade 사이트 큐레이션 ════════

파트 A 본문 출력 직후·매 호출 의무. 결과물: `C:/Users/yangjong/OneDrive/바탕 화면/trade-curation/lib/news-mock.ts`의 `NEWS_MOCK` 배열 갱신.

## 🔑 핵심 원칙 (반드시)

1. **출처 = 원본 기사**. FastStockNews(텔레그램) 링크를 sourceUrl로 쓰지 말 것. 파트 A 2단계에서 검증한 **원본 기사 직링크**를 쓴다.
2. **요약 = 직접 작성 (중립·객관)**. 페르소나 톤 X. 원본 기사를 WebFetch로 읽고 사람이 직접 정리한 톤으로 2~4문장. 단타 투자자가 보기 쉽게. 헤드라인 복붙 X.
3. **off-topic 제외**. 증시·종목·거시경제·기업 공시와 무관한 사회/연예/사건사고 뉴스는 추가 X.
4. **검증 못 한 건 버린다**. 원본 기사 본문을 WebFetch로 못 읽으면(차단 등) 추가 X·추측 요약 X. DART 공시처럼 뷰어가 안 열리면 WebSearch로 정식 기사 교차검증 후, 그래도 확인 안 되면 제외.

## B-1: 소스 확보
- 1차: 파트 A에서 이미 모은 6채널 기사 URL 재사용 (검증 끝난 직링크).
- 2차(선택): FastStockNews 추가 게시물 — WebFetch `https://t.me/s/FastStockNews`로 최근 게시물 + 외부 기사 URL 수집(증시·종목·테마만).

## B-2: 중복 제거
`lib/news-mock.ts`를 읽어 기존 `sourceUrl`·`id`와 겹치면 skip.

## B-3: 원본 읽고 직접 요약
남은 항목의 원본 기사 URL을 WebFetch(병렬)로 읽고, 핵심 팩트(종목명·구체 수치 %/원/억·수혜 구조·이유) 기반 **중립 2~4문장 요약**을 직접 작성. 끝에 "~로 봅니다"·"~흐름입니다" 같은 에디터 관점 한 줄 OK. 읽기 실패 항목은 추가 X → 보고에 "제외: 사유".

## B-4: news-mock.ts에 추가
`NEWS_MOCK` 배열 맨 앞(최신)에 추가:
```ts
{
  id: "YYYYMMDD-<slug>",
  date: "YYYY-MM-DD",                 // 오늘
  headline: "직접 다듬은 헤드라인",     // 원문 복붙 X·핵심만·중립
  summary: "직접 작성한 2~4문장 중립 요약",
  source: "<원본 매체 도메인>",        // 예: thelec.kr·edaily.co.kr·dart.fss.or.kr (텔레그램 X)
  sourceUrl: "<원본 기사 전체 URL>",
  keywords: ["종목/테마", "..."],      // 2~4개
  stocks: ["관련 종목", "..."],
  personaComments: {},                // 비워둠 (페르소나 카피는 파트 A 산출물)
},
```
- 매일 6~10건. 6 미만이면 1~2건만 추가도 OK. mock 비대 방지.
- 카드 UI는 펼침형 + "출처 가기" 버튼 (`components/NewsListItem.tsx`·`HeroNews.tsx`).
- 자동수집(naver/RSS)은 `lib/claude-summarize.ts`가 요약하며 off-topic이면 `__OFF_TOPIC__` 센티널로 자동 제외됨. 이 파트는 그와 별개의 **수동 큐레이션 카드**.

## B-5: 검증 + (선택) 배포
```bash
cd "C:/Users/yangjong/OneDrive/바탕 화면/trade-curation"
npx tsc --noEmit
```
- ⚠️ **trade-curation은 worktree/브랜치 워크플로**. master 직접 push 금지. 커밋/배포는 **사용자 확인 후** 브랜치+PR로 진행한다 (자동 push X).

## B-6: 보고 형식
- ✅ 추가: 종목/테마 + 원본 매체 (표)
- ⛔ 제외: 사유 (차단 / off-topic / 중복 / root URL)
- 다음: `npm run dev`로 홈 확인 (카드 클릭→펼침, "출처 가기"→원본 기사)

---

## 출력 후 다음 액션
- (Threads) "복사해서 활성 6계정에 시간 분산 게시" · 장중 신호 → `/pick` · 마감 → `/wrap`
- (사이트) 커밋/배포 여부 사용자에게 확인
