-- v8 (0.30.4): a mars counts double in ghost games too
create or replace function public.ghost_round() returns void language plpgsql security definer set search_path = public as $$
declare
  h int := extract(hour from now() at time zone 'Europe/Kyiv');
  n int := case when h >= 18 then 30 when h >= 12 then 22 when h >= 8 then 14 when h < 2 then 12 else 6 end;
  a record; b record; e float; awin bool; mars bool; da int; db int; k int;
begin
  for k in 1..n loop
    select * into a from ghosts order by random() limit 1;
    select * into b from ghosts where id <> a.id and abs(rating - a.rating) < 700 order by random() limit 1;
    if b.id is null then continue; end if;
    e := 1.0 / (1 + power(10, (b.rating - a.rating) / 1500.0));
    -- who wins depends on the real strength; dice keep it a game (the same scale as the rating)
    awin := random() < 1.0 / (1 + power(10, (b.skill - a.skill) / 1500.0)); mars := random() < 0.15;
    if awin then da := round(60 * (1 - e)); db := -round(60 * (1 - e)); else da := -round(60 * e); db := round(60 * e); end if;
    if mars then da := da * 2; db := db * 2; end if;
    da := da + round((a.skill - a.rating) * 0.08); db := db + round((b.skill - b.rating) * 0.08);
    update ghosts set rating = greatest(100, rating + da), played = played + 1, won = won + (case when awin then 1 else 0 end), updated_at = now() where id = a.id;
    update ghosts set rating = greatest(100, rating + db), played = played + 1, won = won + (case when awin then 0 else 1 end), updated_at = now() where id = b.id;
  end loop;
end $$;
select 'ok' as v8;
