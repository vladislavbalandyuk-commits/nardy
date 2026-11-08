-- v6: weaker ghost players (650–990) so new players meet people of their level,
--     and ghosts play each other more often (every 5 minutes, up to 14 games), so the rating table moves.
insert into public.ghosts (id, name, av, rating, skill, played, won) values
(68,'misha_bila','m4',985,985,12,5),
(69,'Taras P.','m8',960,960,19,8),
(70,'nina_vin','n3',940,940,26,11),
(71,'Kolya','m2',915,915,33,15),
(72,'roma.ternopil','m11',895,895,40,18),
(73,'Halyna','n6',870,870,47,18),
(74,'stas_99','m5',850,850,14,6),
(75,'Dasha K.','n9',830,830,21,9),
(76,'ivan_ch','m12',805,805,28,12),
(77,'Lilia','n4',785,785,35,16),
(78,'yarik','m7',760,760,42,16),
(79,'Olena S.','n10',740,740,49,20),
(80,'petro_uzh','m9',715,715,16,7),
(81,'katya_poltava','n1',695,695,23,10),
(82,'Vitalik','m6',670,670,30,14),
(83,'zhenya_rv','n7',650,650,37,14)
on conflict (id) do nothing;

create or replace function public.ghost_round() returns void language plpgsql security definer set search_path = public as $$
declare
  h int := extract(hour from now() at time zone 'Europe/Kyiv');
  n int := case when h >= 18 then 14 when h >= 12 then 10 when h >= 8 then 7 when h < 2 then 6 else 3 end;
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
    da := da + round((a.skill - a.rating) * 0.06); db := db + round((b.skill - b.rating) * 0.06);
    update ghosts set rating = greatest(100, rating + da), played = played + 1, won = won + (case when awin then 1 else 0 end), updated_at = now() where id = a.id;
    update ghosts set rating = greatest(100, rating + db), played = played + 1, won = won + (case when awin then 0 else 1 end), updated_at = now() where id = b.id;
  end loop;
end $$;
revoke execute on function public.ghost_round() from public, anon, authenticated;

select cron.unschedule(jobid) from cron.job where jobname = 'ghost-games';
select cron.schedule('ghost-games', '*/5 * * * *', 'select public.ghost_round()');
select count(*) as ghosts, min(rating), max(rating) from public.ghosts;
