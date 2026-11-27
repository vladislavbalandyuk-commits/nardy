-- read-only: active players by day (last sign-in / profile update), last 14 days
select json_build_object(
 'dau_signin',(select json_agg(json_build_array(d,n) order by d) from (select to_char(date_trunc('day',last_sign_in_at),'MM-DD') d,count(*) n from auth.users where last_sign_in_at>now()-interval '14 days' group by 1) x),
 'prof_upd',(select json_agg(json_build_array(d,n) order by d) from (select to_char(date_trunc('day',updated_at),'MM-DD') d,count(*) n from public.profiles where updated_at>now()-interval '14 days' group by 1) x),
 'profiles',(select count(*) from public.profiles),
 'named',(select count(*) from public.profiles where name<>''),
 'played_dist',(select json_object_agg(b,n) from (select case when played=0 then '0' when played=1 then '1' when played<=3 then '2-3' when played<=10 then '4-10' when played<=50 then '11-50' else '50+' end b,count(*) n from public.profiles group by 1) x)
) r;
