# 단타 트레이드 — 키워드 큐레이션 터미널

하이닉스·삼성전자·연금·HBM·코스피 — 단타 트레이더가 직접 큐레이션하는 키워드 뉴스 사이트. **Bloomberg + Robinhood 영감 다크 트레이딩 터미널** 톤.

## 빠른 시작

```bash
npm install
cp .env.local.example .env.local      # 키 채워넣기
npm run dev                            # http://localhost:3001
```

## 디자인 시스템

| 토큰 | 값 | 용도 |
|------|----|----|
| `--bg` | `#0a0e1a` | 메인 배경 (네이비 다크) |
| `--bg-elevated` | `#131829` | 카드·헤더 |
| `--accent` | `#3e6ae1` | 메인 CTA·링크·Tier 3 |
| `--red` | `#ef4444` | 시초 상승·Tier 1 |
| `--green` | `#10b981` | 시초 하락 |
| `--amber` | `#f59e0b` | Tier 2 |

폰트: **Pretendard** (한글) + **JetBrains Mono** (시세·날짜).

## 라우트 구조 (26 routes)

```
/                          메인 (성과·Movers·키워드·뉴스·캘린더·테마)
/keyword/[slug]            키워드 5개 (하이닉스·삼성전자·연금·HBM·코스피)
/stock/[ticker]            종목 10개 (시세 + 스파크라인 + 관련 뉴스)
/theme/[slug]              테마 8개 (반도체·AI 데이터센터·HBM·SMR·전력·로봇·2차전지·ChatGPT)
/results                   누적 성과 + 일자별 결과 목록
/results/[date]            일자별 결과 상세 (대원강업 +1.4% 등)
/search?q=…                통합 검색 (키워드+종목+테마+뉴스)
/api/refresh               캐시 갱신 endpoint (Vercel Cron 호출)
/sitemap.xml /robots.txt /opengraph-image  SEO
```

---

## 🔄 자동 갱신 메커니즘

| 레이어 | 갱신 주기 | 트리거 |
|------|--------|------|
| **ISR** (`revalidate = 1800`) | 30분 | 사용자 페이지 접속 시 백그라운드 갱신 |
| 네이버 API fetch cache | 30분 | 자동 |
| 매체 RSS fetch cache | 30분 | 자동 |
| **Vercel Cron** (`/api/refresh`) | **매 30분** | 사용자 접속 X에도 강제 갱신 (배포 후 자동) |

배포 후 사용자가 사이트 방문하지 않아도 매 30분 뉴스가 자동으로 흡수·갱신됨.

### Vercel Cron 인증
프로덕션에서는 `CRON_SECRET` 환경변수로 인증:
```bash
vercel env add CRON_SECRET production
# → 랜덤 문자열 입력 (예: openssl rand -hex 32)
```

---

## 🔑 네이버 검색 API (필수)

### 발급 4단계
1. [https://developers.naver.com/main/](https://developers.naver.com/main/) → 로그인
2. **Application > 애플리케이션 등록**
3. **사용 API**: `검색` 체크 (데이터랩 X·**검색** ✓)
4. **WEB 서비스 URL**: `http://localhost:3001` (배포 후 실제 도메인 추가)

### `.env.local` 입력
```env
NAVER_CLIENT_ID=발급_ID
NAVER_CLIENT_SECRET=발급_SECRET
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

**무료 한도**: 일 25,000회.

---

## 🗄 Supabase DB 통합 (선택·영속화)

mock 데이터 + 네이버/RSS 실시간만으로도 동작·하지만 텔방 corpus·결과 영속화하려면 Supabase.

### 셋업 4단계

#### 1. 프로젝트 생성
[https://supabase.com/dashboard](https://supabase.com/dashboard) → New Project (무료 500MB DB).

#### 2. 키 복사
**Settings > API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `service_role` (Secret) → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. 스키마 실행
**SQL Editor > New Query** → `lib/db/schema.sql` 내용 붙여넣기 → Run.

→ `news`·`pick_results` 테이블 + `monthly_stats` 뷰 + RLS 정책 자동 생성.

#### 4. `.env.local` 추가
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

`npm run dev` 재시작 → 자동 활성.

---

## 🚀 Vercel 배포 (5분)

### 옵션 A — GitHub repo (자동 배포·추천)

```bash
gh repo create trade-curation --public --source=. --push
```

→ [vercel.com/new](https://vercel.com/new) → repo 선택 → Import:
- 환경변수 **모두** 입력 (네이버·Supabase·CRON_SECRET·SITE_URL)
- Region: **icn1** (서울)
- Deploy

→ 이후 `git push` 시 자동 배포.

### 옵션 B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel link
vercel env add NAVER_CLIENT_ID production
vercel env add NAVER_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add CRON_SECRET production
vercel --prod
```

→ `https://trade-curation-xxx.vercel.app` 발급.

### 배포 후 환경변수 갱신
1. Vercel Dashboard → Project → Settings → Environment Variables
2. `NEXT_PUBLIC_SITE_URL`을 배포 도메인으로 수정
3. Redeploy

---

## 🌐 도메인 결정

| 옵션 | 비용 | 비고 |
|------|----|----|
| `trade.managerkim.com` | ₩0 (서브도메인) | managerkim DNS에 CNAME 추가만 |
| `dantatrade.com` | ~₩20k/년 | 신규·짧음 |
| `keywordkospi.com` | ~₩20k/년 | 키워드 직관적 |
| `장전키워드.com` | ~₩30k/년 | 한글 IDN |

### Vercel에 도메인 연결
1. Project → Settings → Domains
2. "Add Domain" → 입력
3. DNS 안내 (CNAME 또는 A 레코드) 따르기
4. SSL 자동 발급

---

## 🔍 Google Search Console 등록 (배포 후)

1. [search.google.com/search-console](https://search.google.com/search-console)
2. URL 접두어 → 도메인 입력
3. HTML 메타 태그 인증 (Vercel 배포 시 layout.tsx에 추가) 또는 DNS TXT
4. **Sitemap 제출**: `https://your-domain/sitemap.xml`

→ 약 1~2주 내 크롤링 시작·키워드별 트래픽 모니터링.

---

## 📦 폴더 구조

```
app/
  page.tsx                  메인
  layout.tsx                글로벌 (TickerBar + Header + Footer + metadata)
  globals.css               다크 디자인 시스템 + 애니메이션
  sitemap.ts                동적 sitemap (26+ URL)
  robots.ts                 robots.txt
  opengraph-image.tsx       다크 OG (1200x630·Edge)
  api/refresh/route.ts      캐시 갱신 endpoint (Vercel Cron)
  keyword/[slug]/page.tsx
  stock/[ticker]/page.tsx
  theme/[slug]/page.tsx
  results/page.tsx
  results/[date]/page.tsx
  search/page.tsx
  not-found.tsx
  loading.tsx

components/
  TickerBar / Header / HeroSection / SearchInput / MobileNav
  KeywordGrid / KeywordChip / SectionHeader
  NewsCard / StockCard / SparklineChart
  ResultCard / PerformanceStats
  EventTimeline

lib/
  keywords.ts               키워드 매트릭스 + Tier 1~4 + 6월 이벤트
  stocks.ts                 10 종목 + 스파크라인 + 테마
  themes.ts                 8 테마
  personas.ts               6 페르소나 (Day 3에 활성)
  results.ts                일자별·월간 결과
  news-mock.ts              텔방 corpus 본문 요약
  naver-search.ts           네이버 검색 API
  rss-fetcher.ts            매경·연합·한경 RSS
  news-fetcher.ts           통합 (mock + 네이버 + RSS dedup)
  supabase.ts               Supabase 클라이언트
  db/schema.sql             테이블 스키마
```

---

## 📊 다음 단계 로드맵

### 이번 주
- [x] Day 1~2: Next.js init + 5 키워드 + 10 종목 + 8 테마 + 검색
- [x] Day 3: 다크 트레이딩 터미널 디자인
- [x] Day 4: 결과 페이지 + 자동 갱신 + Supabase 셋업
- [ ] 네이버 키 발급·`.env.local` 입력 ✅
- [ ] Vercel 배포·도메인 연결

### Week 2~3
- [ ] Supabase 프로젝트 생성·스키마 실행·키 입력
- [ ] 텔방 corpus → Supabase 자동 적재 (cron)
- [ ] Claude API 6 페르소나 코멘트 자동 생성 (옵션)
- [ ] Google Search Console 등록·Sitemap 제출

### Week 4+
- [ ] 키워드 트래픽 분석 대시보드
- [ ] Threads/텔방 funnel 측정
- [ ] 광고 (애드센스) 또는 VIP funnel
