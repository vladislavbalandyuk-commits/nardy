-- 0.70: nicknames — a short list of offensive roots (Ukrainian, Russian, English); only checked when the name is set or changed
create or replace function public.nick_ok() returns trigger language plpgsql as $$
begin
  if new.name is not null and (tg_op = 'INSERT' or new.name is distinct from old.name)
     and lower(new.name) ~ '(хуй|хуя|хуё|пизд|бляд|блят|єбан|ебан|ёбан|йоба|мудак|мудил|сука|шлюх|підор|пидор|пидар|гандон|залуп|fuck|shit|bitch|cunt|nigg|fagg|whore|pussy|hitler)' then
    raise exception 'bad_nick' using errcode = '22023';
  end if;
  return new;
end $$;
drop trigger if exists profiles_nick_ok on public.profiles;
create trigger profiles_nick_ok before insert or update of name on public.profiles for each row execute function public.nick_ok();
