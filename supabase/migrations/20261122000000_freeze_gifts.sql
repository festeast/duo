-- 1) Серияны сақтау («мұз»), 2) кейіпкерді досқа сыйлау, 3) тиынды тек сервер өзгертеді.

-- ---------- Кейіпкер бағасы (клиентке сенбейміз) ----------
create or replace function public.char_price(p_item text)
returns int language sql immutable as $$
  select case p_item
    when 'char-smart' then 80 when 'char-sleepy' then 80 when 'char-chef' then 120
    when 'char-cool' then 150 when 'char-muscle' then 200 when 'char-ninja' then 250
    when 'char-rocker' then 250 when 'char-wizard' then 300 when 'char-samurai' then 400
    else null end
$$;

-- Сатып алу: кейіпкер болса — сервердегі баға
create or replace function public.buy_item(p_item text, p_price int)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  result public.profiles;
  price int := coalesce(public.char_price(p_item), p_price);
begin
  if price is null or price < 0 then raise exception 'bad price'; end if;
  update profiles
    set coins = coins - price, owned = array_append(owned, p_item)
    where id = auth.uid() and coins >= price and not (p_item = any(owned))
    returning * into result;
  if result.id is null then raise exception 'cannot buy'; end if;
  return result;
end $$;

-- Профильде пайдаланушы өзі тек атын және мысығын өзгерте алады (тиынды емес)
revoke update on public.profiles from authenticated;
grant update (name, cat) on public.profiles to authenticated;

-- ---------- Серияны сақтау ----------
alter table public.profiles add column if not exists freezes int not null default 0;
alter table public.profiles add column if not exists frozen date[] not null default '{}';

-- Мұз сатып алу: 50 тиын, қолда ең көбі 2
create or replace function public.buy_freeze()
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare result public.profiles;
begin
  update profiles set coins = coins - 50, freezes = freezes + 1
    where id = auth.uid() and coins >= 50 and freezes < 2
    returning * into result;
  if result.id is null then raise exception 'cannot buy'; end if;
  return result;
end $$;

-- Өткен күндерді мұзбен жабу (сабақ оқылмаған, соңғы 3 күн ішіндегі, бүгіннен бұрынғы күндер)
create or replace function public.use_freezes(p_days date[], p_today date)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  d date;
  result public.profiles;
begin
  if abs(p_today - current_date) > 1 then raise exception 'bad day'; end if;
  foreach d in array p_days loop
    if d >= p_today or d < p_today - 3 then continue; end if;
    if exists (select 1 from activity where user_id = me and day = d and xp > 0) then continue; end if;
    update profiles set freezes = freezes - 1, frozen = array_append(frozen, d)
      where id = me and freezes > 0 and not (d = any(frozen));
  end loop;
  select * into result from profiles where id = me;
  return result;
end $$;

-- ---------- Сыйлықтар ----------
create table if not exists public.gifts (
  id bigint generated always as identity primary key,
  sender uuid not null references public.profiles on delete cascade,
  receiver uuid not null references public.profiles on delete cascade,
  item text not null,
  seen boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.gifts enable row level security;
drop policy if exists "gifts involved" on public.gifts;
create policy "gifts involved" on public.gifts for select to authenticated using (auth.uid() in (sender, receiver));

-- Досыңа кейіпкер сыйлау. Қайтарады: 'ok' | 'not_friend' | 'owned' | 'no_coins' | 'bad_item'
create or replace function public.gift_char(p_friend uuid, p_item text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  price int := public.char_price(p_item);
begin
  if price is null then return 'bad_item'; end if;
  if not public.is_friend(me, p_friend) then return 'not_friend'; end if;
  if exists (select 1 from profiles where id = p_friend and p_item = any(owned)) then return 'owned'; end if;
  update profiles set coins = coins - price where id = me and coins >= price;
  if not found then return 'no_coins'; end if;
  update profiles set owned = array_append(owned, p_item) where id = p_friend;
  insert into gifts (sender, receiver, item) values (me, p_friend, p_item);
  return 'ok';
end $$;

-- Сыйлықты көрдім деп белгілеу
create or replace function public.gifts_seen()
returns void
language sql security definer set search_path = public as $$
  update gifts set seen = true where receiver = auth.uid() and not seen
$$;

do $$ begin
  alter publication supabase_realtime add table public.gifts;
exception when others then null;
end $$;
