-- ДУО: сөздерді аралықпен қайталау (spaced repetition)

create table if not exists public.word_progress (
  user_id uuid not null references public.profiles on delete cascade,
  word text not null,                -- түрікше сөз
  stage int not null default 1,      -- 1..7: қаншалықты бекіген
  due_on date not null,              -- келесі қайталау күні
  first_seen date not null,
  last_seen date not null,
  correct int not null default 0,
  wrong int not null default 0,
  primary key (user_id, word)
);

alter table public.word_progress enable row level security;

drop policy if exists "words own or friend" on public.word_progress;
create policy "words own or friend" on public.word_progress for select to authenticated
  using (user_id = auth.uid() or public.is_friend(user_id, auth.uid()));
drop policy if exists "words insert own" on public.word_progress;
create policy "words insert own" on public.word_progress for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "words update own" on public.word_progress;
create policy "words update own" on public.word_progress for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- XP мен тиын қосу (күнделікті жаттығу, әңгіме оқу)
create or replace function public.add_xp(p_xp int, p_coins int, p_day date)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  result public.profiles;
begin
  if me is null then raise exception 'not authenticated'; end if;
  p_xp := least(greatest(p_xp, 0), 60);
  p_coins := least(greatest(p_coins, 0), 50);
  insert into activity (user_id, day, xp) values (me, p_day, p_xp)
  on conflict (user_id, day) do update set xp = activity.xp + excluded.xp;
  update profiles set xp = xp + p_xp, coins = coins + p_coins where id = me returning * into result;
  return result;
end $$;
