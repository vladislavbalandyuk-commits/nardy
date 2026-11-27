-- read-only: where players came from and which platform they play on
select json_build_object(
 'src',(select json_object_agg(k,n) from (select coalesce(ach->>'src','-') k,count(*) n from public.profiles group by 1) x),
 'plat',(select json_object_agg(k,n) from (select coalesce(left((ach->'plat')::text,40),'-') k,count(*) n from public.profiles group by 1) x),
 
 'ghosts',(select count(*) from public.ghosts)
) r;
