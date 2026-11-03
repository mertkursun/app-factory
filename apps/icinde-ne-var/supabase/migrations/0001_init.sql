-- supabase/migrations/0001_init.sql

-- =============================================
-- 1. Profiller
-- =============================================
create table public.profiller (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audiences text[] not null default '{}',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiller_user_id_unique unique (user_id)
);
alter table public.profiller enable row level security;

create policy "Kullanici kendi profilini okur"
  on public.profiller for select
  using (auth.uid() = user_id);

create policy "Kullanici kendi profilini olusturur"
  on public.profiller for insert
  with check (auth.uid() = user_id);

create policy "Kullanici kendi profilini gunceller"
  on public.profiller for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- 2. Maddeler (Ingredient veritabani)
-- =============================================
create table public.maddeler (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  es_anlamlilar text[] not null default '{}',
  kategori text not null check (kategori in ('gida', 'kozmetik', 'temizlik', 'genel')),
  islev text not null default '',
  risk_seviyesi text not null check (risk_seviyesi in ('guvenli', 'dikkat', 'sakincali')),
  kaynak text,
  kitle_bayraklari jsonb,
  created_at timestamptz not null default now()
);
alter table public.maddeler enable row level security;

create policy "Herkes maddeleri okur"
  on public.maddeler for select
  using (true);

create policy "Sadece servis yazabilir"
  on public.maddeler for insert
  with check (false);

create policy "Sadece servis guncelleyebilir"
  on public.maddeler for update
  using (false)
  with check (false);

create index maddeler_es_anlamlilar_idx on public.maddeler using gin (es_anlamlilar);
create index maddeler_ad_idx on public.maddeler using btree (lower(ad));

-- =============================================
-- 3. Urun Analizleri (Onbellek)
-- =============================================
create table public.urun_analizleri (
  id uuid primary key default gen_random_uuid(),
  barkod text,
  urun_adi text,
  kategori text not null check (kategori in ('gida', 'kozmetik', 'temizlik', 'genel')),
  skor text not null check (skor in ('yesil', 'sari', 'kirmizi')),
  aciklama text not null,
  maddeler jsonb not null,
  profil_uyarilari jsonb not null,
  bilinmeyenler text[] not null default '{}',
  kaynak_url text,
  created_at timestamptz not null default now()
);
alter table public.urun_analizleri enable row level security;

create policy "Herkes analizleri okur"
  on public.urun_analizleri for select
  using (true);

create policy "Sadece servis analiz yazabilir"
  on public.urun_analizleri for insert
  with check (false);

create index urun_analizleri_barkod_idx on public.urun_analizleri using btree (barkod);

-- =============================================
-- 4. Tarama Gecmisi
-- =============================================
create table public.tarama_gecmisi (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analiz_id uuid not null references public.urun_analizleri(id),
  barkod text,
  urun_adi text,
  skor text not null check (skor in ('yesil', 'sari', 'kirmizi')),
  created_at timestamptz not null default now()
);
alter table public.tarama_gecmisi enable row level security;

create policy "Kullanici kendi gecmisini okur"
  on public.tarama_gecmisi for select
  using (auth.uid() = user_id);

create policy "Kullanici kendi gecmisini olusturur"
  on public.tarama_gecmisi for insert
  with check (auth.uid() = user_id);

create index tarama_gecmisi_user_idx on public.tarama_gecmisi using btree (user_id, created_at desc);

-- =============================================
-- 5. Kullanim (Kota)
-- =============================================
create table public.kullanim (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  donem text not null,
  sorgu_sayisi integer not null default 0,
  constraint kullanim_user_donem_unique unique (user_id, donem)
);
alter table public.kullanim enable row level security;

create policy "Kullanici kendi kotasini okur"
  on public.kullanim for select
  using (auth.uid() = user_id);

create policy "Sadece servis kota yazabilir"
  on public.kullanim for insert
  with check (false);

create policy "Sadece servis kota guncelleyebilir"
  on public.kullanim for update
  using (false)
  with check (false);

-- =============================================
-- 6. Abonelikler
-- =============================================
create table public.abonelikler (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  durum text not null check (durum in ('aktif', 'suresi_dolmus', 'iptal_edildi', 'deneme')),
  bitis timestamptz not null,
  magaza text not null check (magaza in ('app_store', 'play_store')),
  revenuecat_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint abonelikler_user_id_unique unique (user_id)
);
alter table public.abonelikler enable row level security;

create policy "Kullanici kendi aboneligini okur"
  on public.abonelikler for select
  using (auth.uid() = user_id);

create policy "Sadece servis abonelik yazabilir"
  on public.abonelikler for insert
  with check (false);

create policy "Sadece servis abonelik guncelleyebilir"
  on public.abonelikler for update
  using (false)
  with check (false);

-- =============================================
-- 7. Fonksiyonlar
-- =============================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiller_updated_at
  before update on public.profiller
  for each row execute function public.set_updated_at();

create trigger abonelikler_updated_at
  before update on public.abonelikler
  for each row execute function public.set_updated_at();
