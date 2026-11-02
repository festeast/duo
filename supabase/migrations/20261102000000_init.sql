-- ДУО: база құрылымы
-- Профильдер, сабақ прогресі, күнделікті белсенділік, достар, бірге диалогтар.

-- ---------- Профиль ----------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  friend_code text not null unique,
  cat jsonb not null default '{"fur":"ginger","eyes":"green"}'::jsonb,
  xp int not null default 0,
  coins int not null default 20,
  owned text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Достық код: MYS-4821 сияқты, оқуға жеңіл
create or replace function public.gen_friend_code() returns text
language plpgsql as $$
declare
  code text;
begin
  loop
    code := 'DUO-' || lpad((floor(random() * 10000))::int::text, 4, '0');
    exit when not exists (select 1 from public.profiles where friend_code = code);
  end loop;
  return code;
end $$;

-- Тіркелгенде профиль автоматты түрде жасалады
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, friend_code)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''), public.gen_friend_code());
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Прогресс ----------
create table public.lesson_progress (
  user_id uuid not null references public.profiles on delete cascade,
  lesson_id text not null,
  stars int not null check (stars between 1 and 3),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.activity (
  user_id uuid not null references public.profiles on delete cascade,
  day date not null,
  xp int not null default 0,
  primary key (user_id, day)
);

-- ---------- Достар ----------
create table public.friendships (
  id bigint generated always as identity primary key,
  requester uuid not null references public.profiles on delete cascade,
  addressee uuid not null references public.profiles on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (requester, addressee),
  check (requester <> addressee)
);

create or replace function public.is_friend(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester = a and addressee = b) or (requester = b and addressee = a))
  )
$$;

-- ---------- Бірге диалог ----------
create table public.dialog_sessions (
  id uuid primary key default gen_random_uuid(),
  dialog_id text not null,
  host uuid not null references public.profiles on delete cascade,
  guest uuid not null references public.profiles on delete cascade,
  host_role text not null default 'A' check (host_role in ('A', 'B')),
  status text not null default 'invited' check (status in ('invited', 'active', 'done', 'declined')),
  turns text not null check (turns ~ '^[AB]+$'), -- репликалар кезегі, мысалы 'ABABAB'
  step int not null default 0,
  log jsonb not null default '[]'::jsonb, -- [{step, by, answer, tries}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.activity enable row level security;
alter table public.friendships enable row level security;
alter table public.dialog_sessions enable row level security;

-- Профильдерді (аты, мысығы, XP) кірген кез келген адам көре алады — достық код арқылы іздеу үшін
create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "progress own or friend" on public.lesson_progress for select to authenticated
  using (user_id = auth.uid() or public.is_friend(user_id, auth.uid()));

create policy "activity own or friend" on public.activity for select to authenticated
  using (user_id = auth.uid() or public.is_friend(user_id, auth.uid()));

create policy "friendships involved" on public.friendships for select to authenticated
  using (auth.uid() in (requester, addressee));
create policy "friendships delete" on public.friendships for delete to authenticated
  using (auth.uid() in (requester, addressee));

create policy "dialogs involved" on public.dialog_sessions for select to authenticated
  using (auth.uid() in (host, guest));
create policy "dialogs create" on public.dialog_sessions for insert to authenticated
  with check (host = auth.uid() and public.is_friend(host, guest));

-- Жазудың қалғаны тек төмендегі функциялар арқылы жүреді (ереже сақталуы үшін).

-- ---------- Функциялар (RPC) ----------

-- Сабақ аяқталды: XP, тиын, жұлдыз, күнделікті белсенділік
create or replace function public.complete_lesson(p_lesson text, p_stars int, p_xp int, p_coins int, p_day date)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  result public.profiles;
begin
  if me is null then raise exception 'not authenticated'; end if;
  p_xp := least(greatest(p_xp, 0), 50);
  p_coins := least(greatest(p_coins, 0), 50);

  insert into lesson_progress (user_id, lesson_id, stars) values (me, p_lesson, least(greatest(p_stars, 1), 3))
  on conflict (user_id, lesson_id) do update
    set stars = greatest(lesson_progress.stars, excluded.stars), updated_at = now();

  insert into activity (user_id, day, xp) values (me, p_day, p_xp)
  on conflict (user_id, day) do update set xp = activity.xp + excluded.xp;

  update profiles set xp = xp + p_xp, coins = coins + p_coins where id = me returning * into result;
  return result;
end $$;

-- Дүкеннен сатып алу
create or replace function public.buy_item(p_item text, p_price int)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  result public.profiles;
begin
  update profiles
    set coins = coins - p_price, owned = array_append(owned, p_item)
    where id = auth.uid() and coins >= p_price and not (p_item = any(owned))
    returning * into result;
  if result.id is null then raise exception 'cannot buy'; end if;
  return result;
end $$;

-- Достық код бойынша дос қосу. Қайтарады: 'sent' | 'accepted' | 'already' | 'not_found' | 'self'
create or replace function public.add_friend(p_code text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  other uuid;
  existing public.friendships;
begin
  select id into other from profiles where upper(friend_code) = upper(trim(p_code));
  if other is null then return 'not_found'; end if;
  if other = me then return 'self'; end if;

  select * into existing from friendships
    where (requester = me and addressee = other) or (requester = other and addressee = me);

  if existing.id is not null then
    if existing.status = 'accepted' then return 'already'; end if;
    if existing.addressee = me then
      update friendships set status = 'accepted' where id = existing.id;
      return 'accepted';
    end if;
    return 'sent';
  end if;

  insert into friendships (requester, addressee) values (me, other);
  return 'sent';
end $$;

create or replace function public.accept_friend(p_id bigint)
returns void
language sql security definer set search_path = public as $$
  update friendships set status = 'accepted' where id = p_id and addressee = auth.uid();
$$;

-- Диалог шақыруына жауап
create or replace function public.respond_dialog(p_id uuid, p_accept boolean)
returns void
language sql security definer set search_path = public as $$
  update dialog_sessions
    set status = case when p_accept then 'active' else 'declined' end, updated_at = now()
    where id = p_id and guest = auth.uid() and status = 'invited';
$$;

-- Диалогта өз репликаңды айту. Кезек базада тексеріледі.
create or replace function public.dialog_say(p_id uuid, p_step int, p_answer text, p_tries int)
returns public.dialog_sessions
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  s public.dialog_sessions;
  my_role text;
begin
  select * into s from dialog_sessions where id = p_id for update;
  if s.id is null or me not in (s.host, s.guest) then raise exception 'not found'; end if;
  if s.status <> 'active' or s.step <> p_step then return s; end if;

  my_role := case when me = s.host then s.host_role else (case s.host_role when 'A' then 'B' else 'A' end) end;
  if substr(s.turns, s.step + 1, 1) <> my_role then raise exception 'not your turn'; end if;

  update dialog_sessions
    set step = step + 1,
        log = log || jsonb_build_object('step', p_step, 'by', me, 'answer', left(p_answer, 200), 'tries', p_tries),
        status = case when step + 1 >= length(turns) then 'done' else 'active' end,
        updated_at = now()
    where id = p_id
    returning * into s;
  return s;
end $$;

create or replace function public.dialog_quit(p_id uuid)
returns void
language sql security definer set search_path = public as $$
  update dialog_sessions set status = 'declined', updated_at = now()
    where id = p_id and auth.uid() in (host, guest) and status in ('invited', 'active');
$$;

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.friendships, public.dialog_sessions, public.activity, public.profiles;
