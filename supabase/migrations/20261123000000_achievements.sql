-- Жетістіктер (төсбелгілер): әрқайсысы бір рет, сыйлық тиыны серверде анықталады.
create table if not exists public.achievements (
  user_id uuid not null references public.profiles on delete cascade,
  id text not null,
  at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.achievements enable row level security;
drop policy if exists "achievements own or friend" on public.achievements;
create policy "achievements own or friend" on public.achievements for select to authenticated
  using (user_id = auth.uid() or public.is_friend(user_id, auth.uid()));

create or replace function public.achievement_reward(p_id text)
returns int language sql immutable as $$
  select case p_id
    when 'w10' then 10 when 'w50' then 20 when 'w100' then 40 when 'w300' then 80 when 'w500' then 120 when 'w1000' then 200
    when 's3' then 15 when 's7' then 30 when 's30' then 100 when 's100' then 300
    when 'd1' then 15 when 'd5' then 40 when 'series' then 150
    when 'st1' then 10 when 'st5' then 40 when 'stall' then 120
    when 'f1' then 20 when 'l5' then 50 when 'l10' then 120 when 'hard' then 30
    else null end
$$;

-- Жетістікті алу: қайтарады — берілген тиын (0 — бұрын алынған немесе белгісіз)
create or replace function public.claim_achievement(p_id text)
returns int
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  reward int := public.achievement_reward(p_id);
begin
  if me is null or reward is null then return 0; end if;
  insert into achievements (user_id, id) values (me, p_id) on conflict do nothing;
  if not found then return 0; end if;
  update profiles set coins = coins + reward where id = me;
  return reward;
end $$;
