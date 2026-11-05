-- v6 (beta): server-held wallet. Run once in the Supabase SQL editor, then redeploy the "game" function.
-- Only the edge function (service role) writes; a player can read their own row.
create table if not exists public.wallets (
  uid uuid primary key references auth.users(id) on delete cascade,
  w jsonb not null,
  v integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.wallets enable row level security;
drop policy if exists wallets_read_own on public.wallets;
create policy wallets_read_own on public.wallets for select to authenticated using (uid = auth.uid());
revoke insert, update, delete on public.wallets from anon, authenticated;
grant select on public.wallets to authenticated;
