-- 캐시 테이블 — Claude 요약·OG 이미지 영구 저장
-- 실행: Supabase Dashboard → SQL Editor → 붙여넣기 → Run

-- 5. Claude 요약 캐시
create table if not exists public.news_summary_cache (
  source_url text primary key,
  headline text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists news_summary_cache_created_idx on public.news_summary_cache(created_at desc);

-- 6. OG 이미지 캐시
create table if not exists public.og_image_cache (
  source_url text primary key,
  image_url text,
  fetched_null boolean not null default false,
  fetched_at timestamptz not null default now()
);

create index if not exists og_image_cache_fetched_idx on public.og_image_cache(fetched_at desc);

-- RLS 허용
alter table public.news_summary_cache enable row level security;
alter table public.og_image_cache enable row level security;

create policy "Public read summary" on public.news_summary_cache for select using (true);
create policy "Public read og" on public.og_image_cache for select using (true);
