select json_build_object(
 'ghosts', (select json_build_object('n',count(*),'min',min(rating),'max',max(rating),'avg',round(avg(rating)),'skmin',min(skill),'skmax',max(skill),'played',sum(played)) from ghosts),
 'ghost_buckets', (select json_agg(x) from (select (rating/500)*500 as b, count(*) n from ghosts group by 1 order by 1) x),
 'players', (select json_agg(x) from (select (rating/500)*500 as b, count(*) n from profiles where played>0 group by 1 order by 1) x),
 'top', (select json_agg(x) from (select name, rating, played, won from profiles order by rating desc limit 8) x),
 'cols', (select json_agg(column_name) from information_schema.columns where table_name='ghosts')
) as r;
