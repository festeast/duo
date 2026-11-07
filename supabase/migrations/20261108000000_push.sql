-- Еске салу хабарландырулары (Web Push): әр құрылғының жазылымы
create table if not exists public.push_subs (
  endpoint text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;

drop policy if exists "push own select" on public.push_subs;
drop policy if exists "push own insert" on public.push_subs;
drop policy if exists "push own update" on public.push_subs;
drop policy if exists "push own delete" on public.push_subs;
create policy "push own select" on public.push_subs for select using (user_id = auth.uid());
create policy "push own insert" on public.push_subs for insert with check (user_id = auth.uid());
create policy "push own update" on public.push_subs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "push own delete" on public.push_subs for delete using (user_id = auth.uid());
