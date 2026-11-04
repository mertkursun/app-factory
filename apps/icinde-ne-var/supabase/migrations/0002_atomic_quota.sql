-- Atomik kota kontrolü ve artırımı
-- Race condition'ı önlemek için tek sorguda kontrol + artırım yapar

create or replace function public.increment_quota_atomic(
  p_user_id uuid,
  p_donem text,
  p_limit integer default 5
)
returns table(allowed boolean, remaining integer)
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  -- Mevcut kaydı bul ve kilitle (FOR UPDATE ile race condition önlenir)
  select k.sorgu_sayisi into v_count
  from public.kullanim k
  where k.user_id = p_user_id and k.donem = p_donem
  for update;

  if v_count is null then
    -- Kayıt yok, yeni oluştur (sorgu_sayisi = 1)
    insert into public.kullanim (user_id, donem, sorgu_sayisi)
    values (p_user_id, p_donem, 1)
    on conflict (user_id, donem)
    do update set sorgu_sayisi = public.kullanim.sorgu_sayisi + 1
    where public.kullanim.sorgu_sayisi < p_limit
    returning
      public.kullanim.sorgu_sayisi <= p_limit as allowed,
      greatest(p_limit - public.kullanim.sorgu_sayisi, 0) as remaining
    into allowed, remaining;

    -- INSERT başarılı oldu
    if allowed is null then
      -- ON CONFLICT tetiklenmedi, INSERT başarılı (yeni kayıt, sorgu_sayisi = 1)
      allowed := true;
      remaining := p_limit - 1;
    end if;

    return next;
    return;
  end if;

  -- Kayıt var, limit kontrolü
  if v_count >= p_limit then
    allowed := false;
    remaining := 0;
    return next;
    return;
  end if;

  -- Atomik artırım
  update public.kullanim k
  set sorgu_sayisi = k.sorgu_sayisi + 1
  where k.user_id = p_user_id
    and k.donem = p_donem
    and k.sorgu_sayisi < p_limit;

  allowed := true;
  remaining := p_limit - v_count - 1;
  return next;
  return;
end;
$$;
