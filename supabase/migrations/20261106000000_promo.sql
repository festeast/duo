-- Промокодтар: код енгізсең — тиын беріледі. Әр адам бір кодты бір рет қана қолдана алады.
-- Кодтар кестесін ешкім оқи алмайды (RLS қосулы, саясат жоқ) — тек redeem_promo функциясы арқылы.
create table if not exists public.promo_codes (
  code text primary key,           -- бас әріппен сақталады
  coins int not null check (coins > 0),
  max_uses int,                    -- null — шектеусіз
  uses int not null default 0,
  active boolean not null default true
);
alter table public.promo_codes enable row level security;

create table if not exists public.promo_redemptions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  code text not null references public.promo_codes(code) on delete cascade,
  at timestamptz not null default now(),
  primary key (user_id, code)
);
alter table public.promo_redemptions enable row level security;

-- Қайтарады: 'ok:<тиын>' | 'not_found' | 'used' | 'limit'
create or replace function public.redeem_promo(p_code text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  pc public.promo_codes;
begin
  if me is null then return 'not_found'; end if;
  select * into pc from promo_codes where code = upper(trim(p_code)) and active for update;
  if pc.code is null then return 'not_found'; end if;
  if exists (select 1 from promo_redemptions where user_id = me and code = pc.code) then return 'used'; end if;
  if pc.max_uses is not null and pc.uses >= pc.max_uses then return 'limit'; end if;
  insert into promo_redemptions (user_id, code) values (me, pc.code);
  update promo_codes set uses = uses + 1 where code = pc.code;
  update profiles set coins = coins + pc.coins where id = me;
  return 'ok:' || pc.coins;
end $$;

revoke all on function public.redeem_promo(text) from public, anon;
grant execute on function public.redeem_promo(text) to authenticated;

-- Бастапқы код: DUO1000 → 1000 тиын
insert into public.promo_codes (code, coins) values ('DUO1000', 1000) on conflict (code) do nothing;
