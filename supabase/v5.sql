-- v5: ghost players with real ratings, achievements on the server, error log, scheduled cleanup.
-- Run once in Supabase → SQL Editor. Safe to run again.

-- 1. Ghost players (the strong "online" players). Everyone can read, only the server writes.
create table if not exists public.ghosts (
  id int primary key, name text not null, av text not null default '',
  rating int not null, skill int not null default 2000, played int not null default 0, won int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.ghosts enable row level security;
drop policy if exists ghosts_read on public.ghosts;
create policy ghosts_read on public.ghosts for select using (true);
alter table public.ghosts add column if not exists skill int not null default 2000;
revoke all on public.ghosts from anon, authenticated;
grant select (id, name, av, rating, played, won) on public.ghosts to anon, authenticated;
insert into public.ghosts (id, name, av, rating, skill, played, won) values
(0,'olezhka_kyiv','m1',3517,3517,59,33),
(1,'Marta L.','n2',2287,2287,100,59),
(2,'Dmytro_77','m4',2391,2391,141,86),
(3,'sanya.lviv','m7',2067,2067,80,51),
(4,'Ira Koval','n5',2010,2010,121,80),
(5,'nardist','m9',3545,3545,162,91),
(6,'Bogdan V','m2',2289,2289,101,59),
(7,'yulka_od','n8',2086,2086,142,87),
(8,'MaxPetrenko','m11',2559,2559,183,116),
(9,'artem23','m5',2128,2128,122,81),
(10,'Vika_Dnipro','n11',1848,1848,163,91),
(11,'Serhii K','m12',2440,2440,204,119),
(12,'kostya_zp','n4',2296,2296,59,36),
(13,'Anya M.','n11',2131,2131,100,64),
(14,'vovan','m6',2215,2215,141,93),
(15,'Oksana_T','n1',2230,2230,80,45),
(16,'Ruslan88','n8',2081,2081,121,71),
(17,'lesia.k','m3',2019,2019,162,99),
(18,'Nazar','m10',2098,2098,101,64),
(19,'den_kharkiv','n5',2017,2017,142,94),
(20,'Sofiia','n12',1934,1934,183,102),
(21,'andriy_lutsk','m7',1937,1937,122,71),
(22,'Yaroslav P','n2',1999,1999,163,99),
(23,'katia_kyiv','n9',1955,1955,204,130),
(24,'Mykhailo','m4',1780,1780,59,39),
(25,'tolik_nardy','m11',1861,1861,100,56),
(26,'Olena R.','n6',1893,1893,141,82),
(27,'dima.ua','m1',1755,1755,80,49),
(28,'Vitalik','m8',1672,1672,121,77),
(29,'zhenya_rivne','n3',1721,1721,162,107),
(30,'Halyna','n10',1683,1683,101,57),
(31,'Pasha_K','m5',1644,1644,142,83),
(32,'ivanko','m12',1555,1555,183,112),
(33,'Liza V.','n7',1599,1599,122,77),
(34,'Roma Shevchuk','m2',1641,1641,163,108),
(35,'oleg_ternopil','m9',1389,1389,204,114),
(36,'Natalka','n4',1430,1430,59,35),
(37,'stas_1990','n11',1543,1543,100,61),
(38,'Valentyn','m6',1394,1394,141,90),
(39,'marichka','n1',1305,1305,80,53),
(40,'Yurii Bondar','n8',1376,1376,121,68),
(41,'kolia_poltava','m3',1307,1307,162,95),
(42,'Tania','m10',1241,1241,101,62),
(43,'igor.vn','n5',1177,1177,142,90),
(44,'Nadiia_S','n12',1254,1254,183,121),
(45,'borys','m7',1263,1263,122,68),
(46,'Vlad_Kh','n2',1038,1038,163,95),
(47,'Alina Moroz','n9',1110,1110,204,124),
(48,'petro_ch','m4',1218,1218,59,37),
(49,'Khrystyna','m11',1013,1013,100,66),
(50,'Gevorg_A','n2',4127,4127,141,79),
(51,'Rustam N.','n7',4171,4171,80,47),
(52,'Elmira','n12',4137,4137,121,74),
(53,'tavla_pro','m5',4066,4066,162,103),
(54,'Vano','m10',3932,3932,101,67),
(55,'Lado K.','n3',4015,4015,142,80),
(56,'Karen A.','n8',4059,4059,183,107),
(57,'Nugzar','m1',3815,3815,122,74),
(58,'Tigran_7','m6',3835,3835,163,104),
(59,'Ayten','m11',3936,3936,204,135),
(60,'Murad','n4',3772,3772,59,33),
(61,'dice_king','n9',3714,3714,100,59),
(62,'Zurab','m2',3743,3743,141,86),
(63,'Anush','m7',3734,3734,80,51),
(64,'Fazil','m12',3655,3655,121,80),
(65,'Samvel','n5',3508,3508,162,91),
(66,'Leyla B.','n10',3607,3607,101,59),
(67,'Arsen_kyiv','m3',3649,3649,142,87)
on conflict (id) do nothing;

-- 2. Ghosts play each other: every 10 minutes a few games, more in the evening (Kyiv time).
--    Results follow each ghost's fixed strength (skill), so ratings move around it instead of drifting away.
create or replace function public.ghost_round() returns void language plpgsql security definer set search_path = public as $$
declare
  h int := extract(hour from now() at time zone 'Europe/Kyiv');
  n int := case when h >= 18 then 6 when h >= 12 then 4 when h >= 8 then 3 when h < 2 then 3 else 1 end;
  a record; b record; e float; awin bool; mars bool; ga float; gb float; da int; db int; k int;
begin
  for k in 1..n loop
    select * into a from ghosts order by random() limit 1;
    select * into b from ghosts where id <> a.id and abs(rating - a.rating) < 400 order by random() limit 1;
    if b.id is null then continue; end if;
    e := 1.0 / (1 + power(10, (b.rating - a.rating) / 400.0));
    awin := random() < 1.0 / (1 + power(10, (b.skill - a.skill) / 400.0)); mars := random() < 0.15;
    ga := case when a.rating <= 1000 then 50 when a.rating >= 1600 then 25 else 50 - 25.0 * (a.rating - 1000) / 600 end;
    gb := case when b.rating <= 1000 then 50 when b.rating >= 1600 then 25 else 50 - 25.0 * (b.rating - 1000) / 600 end;
    if awin then da := round(ga * (0.9 + 0.2 * (1 - e))); db := -round(gb * (0.9 + 0.2 * (1 - e)));
    else da := -round(ga * (0.9 + 0.2 * e)); db := round(gb * (0.9 + 0.2 * e)); end if;
    if mars then da := round(da * 1.2); db := round(db * 1.2); end if;
    -- a small pull towards the ghost's strength keeps the field stable over months
    da := da + round((a.skill - a.rating) * 0.06); db := db + round((b.skill - b.rating) * 0.06);
    update ghosts set rating = greatest(100, rating + da), played = played + 1, won = won + (case when awin then 1 else 0 end), updated_at = now() where id = a.id;
    update ghosts set rating = greatest(100, rating + db), played = played + 1, won = won + (case when awin then 0 else 1 end), updated_at = now() where id = b.id;
  end loop;
end $$;
revoke execute on function public.ghost_round() from public, anon, authenticated;

-- 3. Achievements are counted by the server (the "game" function); clients cannot change them.
alter table public.profiles add column if not exists ach jsonb not null default '{}'::jsonb;

-- 4. Error log: the site reports its own errors here (insert only, limited sizes).
create table if not exists public.client_errors (
  id bigserial primary key, at timestamptz not null default now(), uid uuid default auth.uid(),
  msg text check (char_length(msg) <= 500), stack text check (char_length(stack) <= 2000),
  url text check (char_length(url) <= 300), ua text check (char_length(ua) <= 300)
);
alter table public.client_errors enable row level security;
drop policy if exists client_errors_insert on public.client_errors;
create policy client_errors_insert on public.client_errors for insert to authenticated with check (uid = auth.uid());
revoke all on public.client_errors from anon, authenticated;
grant insert (msg, stack, url, ua) on public.client_errors to authenticated;
grant usage on sequence public.client_errors_id_seq to authenticated;

-- 5. Daily cleanup: abandoned games, old errors, guests who never played.
create or replace function public.daily_cleanup() returns void language plpgsql security definer set search_path = public, auth as $$
begin
  delete from public.games where updated_at < now() - interval '2 days';
  delete from public.client_errors where at < now() - interval '30 days';
  delete from public.profiles p using auth.users u
    where p.id = u.id and u.is_anonymous and u.created_at < now() - interval '30 days' and coalesce(p.played, 0) = 0;
  delete from auth.users u
    where u.is_anonymous and u.created_at < now() - interval '30 days'
      and not exists (select 1 from public.profiles p where p.id = u.id);
end $$;
revoke execute on function public.daily_cleanup() from public, anon, authenticated;

-- 6. Schedules (pg_cron).
create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule(jobid) from cron.job where jobname in ('ghost-games', 'daily-cleanup');
select cron.schedule('ghost-games', '*/10 * * * *', 'select public.ghost_round()');
select cron.schedule('daily-cleanup', '17 3 * * *', 'select public.daily_cleanup()');
