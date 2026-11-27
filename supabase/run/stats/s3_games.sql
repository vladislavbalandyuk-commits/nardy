-- read-only: games by day and kind, last 14 days
select json_build_object(
 'total',(select count(*) from public.games),
 'byday',(select json_agg(json_build_array(d,h,b,c) order by d) from (select to_char(date_trunc('day',created_at),'MM-DD') d, count(*) filter (where p2 is not null) h, count(*) filter (where state->>'p2' like 'bot:%') b, count(*) filter (where p2 is null and coalesce(state->>'p2','') not like 'bot:%') c from public.games where created_at>now()-interval '14 days' group by 1) x),
 'botkinds',(select json_object_agg(k,n) from (select coalesce(state->>'p2','?') k,count(*) n from public.games where created_at>now()-interval '14 days' and state->>'p2' like 'bot:%' group by 1) x),
 'finished14',(select count(*) from public.games where created_at>now()-interval '14 days' and state->>'phase'='over')
) r;
