-- 단타 트레이드 큐레이션 — Supabase 스키마
-- 실행: Supabase Dashboard → SQL Editor → New Query → 붙여넣기 → Run

-- 1. 뉴스 테이블
create table if not exists public.news (
  id text primary key,
  date date not null,
  headline text not null,
  summary text not null default '',
  source text not null,
  source_url text not null unique,
  keywords text[] not null default '{}',
  stocks text[] not null default '{}',
  origin text not null default 'naver',
  created_at timestamptz not null default now()
);

create index if not exists news_date_idx on public.news(date desc);
create index if not exists news_keywords_idx on public.news using gin(keywords);
create index if not exists news_stocks_idx on public.news using gin(stocks);

-- 2. 추천 결과 테이블 (일자별·종목별)
create table if not exists public.pick_results (
  date date not null,
  rank int not null,
  stock_name text not null,
  ticker text not null,
  target_reached int not null default 0,
  result_percent numeric not null default 0,
  status text not null check (status in ('hit', 'stop', 'pending')),
  note text,
  total_return numeric,
  summary text,
  created_at timestamptz not null default now(),
  primary key (date, ticker)
);

create index if not exists pick_results_date_idx on public.pick_results(date desc);

-- 3. 월간 누적 (집계 뷰)
create or replace view public.monthly_stats as
select
  to_char(date, 'YYYY-MM') as month,
  count(*) filter (where status = 'hit') as hit_count,
  count(*) filter (where status = 'stop') as miss_count,
  round(
    (count(*) filter (where status = 'hit'))::numeric * 100 /
    nullif(count(*), 0),
    1
  ) as win_rate,
  round(sum(result_percent), 2) as cumulative_return
from public.pick_results
group by to_char(date, 'YYYY-MM');

-- 4. RLS (모든 사용자 읽기 가능·쓰기는 service_role만)
alter table public.news enable row level security;
alter table public.pick_results enable row level security;

create policy "Public read news" on public.news
  for select using (true);

create policy "Public read picks" on public.pick_results
  for select using (true);
