-- read-only: real online — peak per day and average by hour (Kyiv time), last 14 days
select json_build_object(
 'peak',(select json_agg(json_build_array(d,m,a) order by d) from (select to_char(date_trunc('day',b at time zone 'Europe/Kiev'),'MM-DD') d,max(n) m,round(avg(n),1) a from public.online_log where b>now()-interval '14 days' group by 1) x),
 'hour',(select json_agg(json_build_array(h,a) order by h) from (select extract(hour from b at time zone 'Europe/Kiev')::int h,round(avg(n),1) a from public.online_log where b>now()-interval '14 days' group by 1) x)
) r;
