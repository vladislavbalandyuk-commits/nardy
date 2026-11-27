-- read-only stats (27.11.2026): sign-ups by week, anonymous share, providers
select json_build_object(
 'users',(select count(*) from auth.users),
 'anon',(select count(*) from auth.users where is_anonymous),
 'prov',(select json_object_agg(p,n) from (select coalesce(raw_app_meta_data->>'provider','?') p,count(*) n from auth.users group by 1) x),
 'byweek',(select json_agg(json_build_array(w,n,a) order by w) from (select to_char(date_trunc('week',created_at),'MM-DD') w,count(*) n,count(*) filter (where is_anonymous) a from auth.users where created_at>now()-interval '10 weeks' group by date_trunc('week',created_at)) x)
) r;
