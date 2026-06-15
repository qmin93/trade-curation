-- 운영자 콘솔(/ops) 클라우드 저장용 테이블.
-- Supabase 대시보드 → SQL Editor에 한 번 붙여넣고 실행하면 클라우드 저장이 켜진다.
-- (이 테이블이 없어도 /ops 로컬 자동저장은 정상 작동한다.)

create table if not exists ops_drafts (
  id          text primary key,        -- "{티커}-{YYYY-MM-DD}" (같은 날 같은 종목은 덮어쓰기)
  label       text,                    -- 저장 라벨
  pick_date   text,                    -- 픽 날짜(KST)
  payload     jsonb not null,          -- { pick: {...}, bodies: { 페르소나: 본문 } }
  updated_at  timestamptz default now()
);

-- service_role 키로만 접근(서버 라우트 경유)하므로 RLS는 기본 비활성으로 둔다.
-- 공개 anon 접근을 막으려면:
-- alter table ops_drafts enable row level security;
