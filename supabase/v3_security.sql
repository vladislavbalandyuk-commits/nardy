-- v3: the server is the only writer of online games and of rating/stats.
-- Run AFTER the "game" edge function is deployed and the new site is live.

-- 1) Players may only change their own name and avatar; rating, games and wins are written by the server.
revoke update on public.profiles from authenticated, anon;
grant update (name, av, updated_at) on public.profiles to authenticated;
revoke insert on public.profiles from authenticated, anon;
grant insert (id, name, av, updated_at) on public.profiles to authenticated;

-- 2) Games can be read by their players, but no longer written by clients directly.
drop policy if exists "create own game" on public.games;
drop policy if exists "players update" on public.games;
revoke insert, update, delete on public.games from authenticated, anon;

-- 3) Legacy rows with impossible values are reset (optional, review before running):
-- update public.profiles set rating = 1000, rgames = 0 where rating > 5000 or rating < 100;
