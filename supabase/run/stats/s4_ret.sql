-- read-only: retention — of users who signed up 8-30 days ago, how many came back on a later day (last sign-in at least 1 / 7 days after sign-up), and cohort played
select json_build_object(
 'cohort',(select count(*) from auth.users where created_at between now()-interval '30 days' and now()-interval '8 days'),
 'back1',(select count(*) from auth.users where created_at between now()-interval '30 days' and now()-interval '8 days' and last_sign_in_at>created_at+interval '1 day'),
 'back7',(select count(*) from auth.users where created_at between now()-interval '30 days' and now()-interval '8 days' and last_sign_in_at>created_at+interval '7 days'),
 'played0',(select count(*) from auth.users u join public.profiles p on p.id=u.id where u.created_at between now()-interval '30 days' and now()-interval '8 days' and p.played=0),
 'top_played',(select json_agg(n order by n desc) from (select played n from public.profiles order by played desc limit 15) x),
 'ach_keys',(select json_object_agg(k,n) from (select k,count(*) n from public.profiles, jsonb_object_keys(ach) k group by k order by n desc limit 40) x)
) r;
