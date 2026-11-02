-- Nardy: database schema (run once in Supabase SQL editor)

-- Player profiles: nickname + stats
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 24),
  played int not null default 0,
  won int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select to authenticated using (true);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Games: whole game state as JSON, two player slots
create table if not exists public.games (
  id text primary key check (char_length(id) between 4 and 16),
  p1 uuid not null references auth.users(id) on delete cascade,
  p2 uuid references auth.users(id) on delete set null,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists games_p1_idx on public.games(p1);
create index if not exists games_p2_idx on public.games(p2);
alter table public.games enable row level security;
drop policy if exists "games readable" on public.games;
create policy "games readable" on public.games for select to authenticated using (true);
drop policy if exists "create own game" on public.games;
create policy "create own game" on public.games for insert to authenticated with check (auth.uid() = p1);
drop policy if exists "players update" on public.games;
create policy "players update" on public.games for update to authenticated
  using (auth.uid() = p1 or auth.uid() = p2 or p2 is null)
  with check (auth.uid() = p1 or auth.uid() = p2);

-- Live updates
alter table public.games replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.games;
exception when duplicate_object then null; end $$;
