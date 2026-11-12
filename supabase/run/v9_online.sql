-- v9 (0.54): real online — the highest number of people on the site in each 5-minute slot (for the admin page)
create table if not exists public.online_log (b timestamptz primary key, n int not null default 0);
alter table public.online_log enable row level security;
