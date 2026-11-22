-- Тақырып тесті: өтсең — тақырыптың сөздері күнделікті қайталаудан шығады.
-- Аптасына бір әрекет тегін, қалғаны — 30 тиын.
create table if not exists public.topic_tests (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles on delete cascade,
  topic text not null,
  started_at timestamptz not null default now(),
  free boolean not null default false,
  score int,
  total int,
  passed boolean not null default false
);
create index if not exists topic_tests_user on public.topic_tests (user_id, started_at desc);
alter table public.topic_tests enable row level security;
drop policy if exists "topic tests own" on public.topic_tests;
create policy "topic tests own" on public.topic_tests for select to authenticated using (user_id = auth.uid());

-- Тестті бастау. Қайтарады: тест id (тегін немесе ақылы), тиын жетпесе — -1
create or replace function public.start_topic_test(p_topic text)
returns bigint
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  is_free boolean;
  new_id bigint;
begin
  if me is null then return -1; end if;
  is_free := not exists (select 1 from topic_tests where user_id = me and free and started_at > now() - interval '7 days');
  if not is_free then
    update profiles set coins = coins - 30 where id = me and coins >= 30;
    if not found then return -1; end if;
  end if;
  insert into topic_tests (user_id, topic, free) values (me, p_topic, is_free) returning id into new_id;
  return new_id;
end $$;

-- Тест нәтижесі (тек өз тестің, бір рет)
create or replace function public.finish_topic_test(p_id bigint, p_score int, p_total int)
returns boolean
language plpgsql security definer set search_path = public as $$
declare ok boolean := p_total > 0 and p_score >= ceil(p_total * 0.9);
begin
  update topic_tests set score = p_score, total = p_total, passed = ok
    where id = p_id and user_id = auth.uid() and score is null;
  return ok;
end $$;
