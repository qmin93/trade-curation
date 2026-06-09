# 단타 트레이드 — 키워드 큐레이션 터미널

하이닉스·삼성전자·연금·HBM·코스피 — 단타 트레이더가 직접 큐레이션하는 키워드 뉴스 사이트. **Bloomberg + Robinhood 영감 다크 트레이딩 터미널** 톤.

## 빠른 시작

```bash
npm install
npm run dev    # http://localhost:3001
```

## 디자인 시스템

| 토큰 | 값 | 용도 |
|------|----|----|
| `--bg` | `#0a0e1a` | 메인 배경 (네이비 다크) |
| `--bg-elevated` | `#131829` | 카드·헤더 |
| `--bg-subtle` | `#1c2236` | 보조 표면 |
| `--accent` | `#3e6ae1` | 메인 CTA·링크·Tier 3 |
| `--red` | `#ef4444` | 시초 상승·Tier 1 |
| `--green` | `#10b981` | 시초 하락 |
| `--amber` | `#f59e0b` | Tier 2 |

폰트: **Pretendard** (한글) + **JetBrains Mono** (시세·날짜).

## 폴더 구조

```
app/
  page.tsx                  메인 (Hero + KeywordGrid + EventTimeline + NewsFeed)
  layout.tsx                글로벌 (TickerBar + Header + Footer + metadata)
  globals.css               다크 디자인 시스템 + 애니메이션
  sitemap.ts                동적 sitemap
  robots.ts                 robots.txt
  opengraph-image.tsx       다크 OG (Edge Runtime · 1200x630)
  keyword/[slug]/page.tsx   키워드 페이지 (Hero gradient + News grid + ISR 30분)

components/
  TickerBar.tsx             상단 실시간 시세 ticker (스크롤 애니메이션)
  Header.tsx                다크 헤더 + 네비 + KRX OPEN 인디케이터
  HeroSection.tsx           메인 히어로 (gradient + radial bg)
  KeywordGrid.tsx           키워드 카드 그리드 (tier 그라데이션 + 호버 글로우)
  KeywordChip.tsx           키워드 칩 (인라인)
  NewsCard.tsx              뉴스 카드 (다크 + 호버 lift + accent 글로우)
  EventTimeline.tsx         6월 이벤트 타임라인 (세로 줄)
  SectionHeader.tsx         섹션 헤더 (mono label + title + href)

lib/
  keywords.ts               키워드 매트릭스 + Tier 1~4 + 6월 이벤트
  personas.ts               6 페르소나 시그너처 (Day 3에 재활성)
  news-mock.ts              텔방 corpus 본문 요약 (6/9 6건)
  naver-search.ts           네이버 검색 API 클라이언트
  rss-fetcher.ts            매경·연합·한경 RSS
  news-fetcher.ts           통합 fetcher (mock + 네이버 + RSS dedup)
```

---

## 🔑 네이버 검색 API 발급 (10분)

실시간 키워드 뉴스 흡수를 위한 무료 API.

### 1단계 — 가입
[https://developers.naver.com/main/](https://developers.naver.com/main/) 접속 → 우측 상단 **로그인** (네이버 계정).

### 2단계 — Application 등록
1. 상단 **"Application > 애플리케이션 등록"** 클릭
2. 약관 동의
3. **애플리케이션 이름**: `단타 트레이드 큐레이션`
4. **사용 API**: `검색` 체크
5. **비로그인 오픈 API 서비스 환경**:
   - WEB 설정 → 웹 서비스 URL: `http://localhost:3001` (개발용·배포 후 수정)

### 3단계 — 키 저장
등록 완료 → "Client ID" + "Client Secret" 표시됨.

```bash
# trade-curation 폴더에서
cp .env.local.example .env.local
```

`.env.local`에 키 입력:
```env
NAVER_CLIENT_ID=발급받은_ID
NAVER_CLIENT_SECRET=발급받은_SECRET
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### 4단계 — 재시작
```bash
# Ctrl+C로 dev 서버 종료 후
npm run dev
```

→ 자동으로 키워드별 실시간 뉴스 흡수.

**무료 한도**: 일 25,000회 호출 (충분).

---

## 🚀 Vercel 배포 (5분)

### 옵션 A — Vercel CLI

```bash
npm install -g vercel
cd "C:/Users/yangjong/OneDrive/바탕 화면/trade-curation"
vercel login    # GitHub 연결 권장
vercel link     # 새 프로젝트 생성
```

환경변수 추가:
```bash
vercel env add NAVER_CLIENT_ID production
vercel env add NAVER_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production
# → 입력: https://your-vercel-domain.vercel.app
```

배포:
```bash
vercel --prod
```

→ `https://trade-curation-xxx.vercel.app` 무료 도메인 발급.

### 옵션 B — GitHub repo 연결 (자동 배포·추천)

```bash
git init
git add .
git commit -m "feat: 단타 트레이드 키워드 큐레이션 초기 셋업"
gh repo create trade-curation --public --source=. --push
```

→ [vercel.com/new](https://vercel.com/new) → GitHub repo 선택 → "Import" → 환경변수 설정 → Deploy.

→ 이후 `git push` 시 자동 배포.

---

## 🌐 도메인 결정 (옵션)

Vercel 무료 도메인 사용 가능. 자체 도메인 원할 시:

### 추천 도메인
- `trade.managerkim.com` (managerkim 서브도메인 — DNS만 추가)
- `dantatrade.com` (신규·약 ₩20k/년)
- `keywordkospi.com`
- `장전키워드.com` (한글)

### 적용 (Vercel 대시보드)
1. Project → Settings → Domains
2. "Add Domain" → 도메인 입력
3. DNS 레코드 추가 안내 따르기 (CNAME 또는 A 레코드)
4. SSL 자동 발급 (Let's Encrypt)

---

## 🔍 Google Search Console 등록

배포 후:
1. [search.google.com/search-console](https://search.google.com/search-console) 접속
2. URL 접두어 방식 → 도메인 입력
3. 소유권 확인 (HTML 메타 또는 DNS 레코드)
4. **Sitemap 제출**: `https://your-domain.com/sitemap.xml`

→ 약 1~2주 내 크롤링 시작.

---

## 📊 다음 단계 로드맵

### 즉시 (오늘)
- [x] Day 1: Next.js 14 init + 5 키워드 페이지
- [x] Day 2: 텔방 corpus mock + 네이버 API + RSS 통합
- [x] 다크 트레이딩 터미널 디자인 완성
- [ ] 네이버 API 키 발급 + .env.local 설정
- [ ] Vercel 배포

### 이번 주
- [ ] Google Search Console 등록
- [ ] 자체 도메인 결정·연결
- [ ] OG 이미지 시각 검증·조정

### 다음 주 (Week 2~3)
- [ ] 텔방 corpus → Supabase DB 자동 적재 (cron)
- [ ] Claude API 6 페르소나 코멘트 자동 생성 (Day 3 활성)
- [ ] 종목별 페이지 추가 (`/stock/[ticker]`)
- [ ] 테마별 페이지 추가 (`/theme/[slug]`)

### Week 4+
- [ ] 일자별 아카이브 (`/archive/[date]`)
- [ ] 키워드 트래픽 분석 대시보드
- [ ] Threads/텔방 funnel 측정
- [ ] 광고 (애드센스) 또는 VIP funnel
