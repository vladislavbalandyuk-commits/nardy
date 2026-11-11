-- v7 (0.26.1): the new rating. 100 ghost players on every level (≈ 550 … 6400, 13 of them above 5000, 14 at 4000–5000),
-- they play each other more often with the new Elo (K 60, scale 1500) and drift back to their real strength (skill);
-- players' ratings are softly reset: 1000 + (rating − 1000) / 2, the order stays the same.
insert into public.ghosts (id, name, av, rating, skill, played, won) values
(0,'olezhka_kyiv','m1',3426,3460,260,142),
(1,'Marta L.','n2',3089,3169,208,112),
(2,'Dmytro_77','m4',3274,3329,205,114),
(3,'sanya.lviv','m7',2731,2691,246,120),
(4,'Ira Koval','n5',2276,2322,228,103),
(5,'nardist','m9',3764,3714,254,143),
(6,'Bogdan V','m2',3261,3224,240,125),
(7,'yulka_od','n8',2560,2529,189,95),
(8,'MaxPetrenko','m11',3443,3394,211,113),
(9,'artem23','m5',2864,2904,185,94),
(10,'Vika_Dnipro','n11',2200,2136,155,73),
(11,'Serhii K','m12',3281,3283,256,130),
(12,'kostya_zp','n4',3157,3102,215,112),
(13,'Anya M.','n11',2936,3019,214,113),
(14,'vovan','m6',3008,2973,202,106),
(15,'Oksana_T','n1',2882,2813,228,117),
(16,'Ruslan88','m3',2888,2875,201,97),
(17,'lesia.k','n10',2750,2746,230,111),
(18,'Nazar','m10',2549,2625,228,117),
(19,'den_kharkiv','m6',2647,2589,235,111),
(20,'Sofiia','n12',2395,2411,215,98),
(21,'andriy_lutsk','m7',2388,2462,171,79),
(22,'Yaroslav P','m9',2290,2375,217,104),
(23,'katia_kyiv','n9',2325,2271,174,83),
(24,'Mykhailo','m4',2229,2238,212,104),
(25,'tolik_nardy','m11',2234,2167,191,83),
(26,'Olena R.','n6',2100,2035,217,101),
(27,'dima.ua','m1',2160,2066,151,65),
(28,'Vitalik','m8',1866,1976,146,67),
(29,'zhenya_rivne','n3',1927,1856,174,79),
(30,'Halyna','n10',1914,1905,173,72),
(31,'Pasha_K','m5',1841,1948,202,85),
(32,'ivanko','m12',1812,1815,209,85),
(33,'Liza V.','n7',1680,1715,157,72),
(34,'Roma Shevchuk','m2',1791,1756,162,70),
(35,'oleg_ternopil','m9',1720,1676,166,68),
(36,'Natalka','n9',1640,1647,132,58),
(37,'stas_1990','m10',1540,1576,197,87),
(38,'Valentyn','m6',1688,1597,129,57),
(39,'marichka','n1',1461,1506,155,68),
(40,'Yurii Bondar','n3',1565,1491,182,74),
(41,'kolia_poltava','m3',1466,1442,173,75),
(42,'Tania','n5',1290,1385,185,70),
(43,'igor.vn','m2',1380,1424,169,66),
(44,'Nadiia_S','n12',1284,1342,156,60),
(45,'borys','m7',1211,1292,164,68),
(46,'Vlad_Kh','m5',1162,1259,159,64),
(47,'Alina Moroz','n9',1177,1245,176,76),
(48,'petro_ch','m4',1258,1182,176,66),
(49,'Khrystyna','n12',1073,1174,185,78),
(50,'Gevorg_A','m9',4724,4759,313,195),
(51,'Rustam N.','m10',4585,4682,286,174),
(52,'Elmira','n12',4537,4621,292,176),
(53,'tavla_pro','m5',4466,4536,259,158),
(54,'Vano','m10',4536,4466,316,189),
(55,'Lado K.','n3',4305,4379,236,136),
(56,'Karen A.','m1',4302,4307,303,171),
(57,'Nugzar','m1',4151,4246,304,178),
(58,'Tigran_7','m6',4128,4177,302,169),
(59,'Ayten','n12',4180,4102,268,162),
(60,'Murad','n4',4121,4041,222,125),
(61,'dice_king','m6',4066,3981,272,158),
(62,'Zurab','m2',3976,3914,259,154),
(63,'Anush','n6',3831,3851,286,163),
(64,'Fazil','m12',3810,3793,276,152),
(65,'Samvel','m10',3597,3670,285,159),
(66,'Leyla B.','n10',3600,3582,207,118),
(67,'Arsen_kyiv','m3',3425,3518,257,146),
(68,'misha_bila','m4',1059,1133,176,72),
(69,'Taras P.','m8',1043,1099,130,53),
(70,'nina_vin','n1',1122,1050,114,41),
(71,'Kolya','m2',983,1032,101,39),
(72,'roma.ternopil','m11',1004,994,126,49),
(73,'Halyna','n6',888,947,132,49),
(74,'stas_99','m5',897,906,127,47),
(75,'Dasha K.','n9',940,874,99,34),
(76,'ivan_ch','m12',838,817,100,39),
(77,'Lilia','n10',897,801,132,51),
(78,'yarik','m7',782,764,139,51),
(79,'Olena S.','n10',654,705,106,41),
(80,'petro_uzh','m9',626,684,143,50),
(81,'katya_poltava','n1',625,634,88,30),
(82,'Vitalik','m6',569,597,163,59),
(83,'zhenya_rv','n4',471,576,118,42),
(84,'Hrant M.','pt23',4860,4820,278,165),
(85,'shesh_besh','pt28',4855,4895,275,176),
(86,'Kamran_baku','pt16',4925,4973,277,179),
(87,'Nika Tbilisi','pt13',5023,5039,333,202),
(88,'Aram_888','pt34',5127,5147,333,214),
(89,'Davit G.','pt6',5183,5267,290,186),
(90,'long_nardy_pro','pt25',5460,5370,316,210),
(91,'Ilham','pt20',5496,5482,314,204),
(92,'Sevil','pt21',5577,5579,323,214),
(93,'Arevik','pt9',5707,5690,323,214),
(94,'Gela','pt17',5893,5795,371,254),
(95,'Rafael_T','pt26',5907,5918,331,236),
(96,'Mariam K.','pt12',6023,6009,345,244),
(97,'Teymur','pt33',6178,6116,379,256),
(98,'Levan_ge','pt8',6224,6243,360,266),
(99,'Narine','pt1',6300,6343,336,248)
on conflict (id) do update set name = excluded.name, av = excluded.av, rating = excluded.rating, skill = excluded.skill, played = excluded.played, won = excluded.won, updated_at = now();
delete from public.ghosts where id >= 100;

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
    if mars then da := round(da * 1.2); db := round(db * 1.2); end if;
    da := da + round((a.skill - a.rating) * 0.08); db := db + round((b.skill - b.rating) * 0.08);
    update ghosts set rating = greatest(100, rating + da), played = played + 1, won = won + (case when awin then 1 else 0 end), updated_at = now() where id = a.id;
    update ghosts set rating = greatest(100, rating + db), played = played + 1, won = won + (case when awin then 0 else 1 end), updated_at = now() where id = b.id;
  end loop;
end $$;
revoke execute on function public.ghost_round() from public, anon, authenticated;
select cron.unschedule(jobid) from cron.job where jobname = 'ghost-games';
select cron.schedule('ghost-games', '*/5 * * * *', 'select public.ghost_round()');

update public.profiles set rating = round(1000 + (rating - 1000) / 2.0) where rating <> 1000;
select (select count(*) from ghosts) as ghosts, (select max(rating) from ghosts) as gmax, (select json_agg(x) from (select name, rating from profiles order by rating desc limit 5) x) as top;
