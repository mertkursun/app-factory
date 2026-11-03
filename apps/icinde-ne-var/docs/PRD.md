# İçinde Ne Var? — PRD

**Slug:** `icinde-ne-var` · **Tarih:** 2026-11-03 · **Sürüm:** MVP

## 1. Problem ve hedef kullanıcı

Türkiye'deki tüketiciler market rafındaki ürünlerin içindekiler listesini okuduklarında kimyasal isimleri anlamlandıramıyor, kendileri veya aileleri için (bebek, hamile, alerjik, vegan, diyabet vb.) hangisinin güvenli olduğunu bilemiyorlar. İçinde Ne Var?, barkod veya fotoğraf ile içeriğin anında sade Türkçe'ye çevrilmesini ve kişiye özel risk uyarısını sağlayan bir mobil uygulamadır. Hedef kullanıcılar: bilinçsiz tüketimden kaçınmak isteyen ebeveynler, hamileler, alerji/diyabet hastaları, vegan/temiz güzellik tercihindeki tüketiciler.

## 2. MVP kapsamı (en fazla 5)

1. **Barkod tarama ve fotoğraf ile içerik çıkartma** — `expo-camera` CameraView ile barkod okuma; bulunamazsa içindekiler etiketinin fotoğrafını çekip Claude API ile içerik listesini JSON olarak çıkarma.
2. **4 adımlı analiz hattı** — Edge Function'da: OKU (Open Food/Beauty/Products Facts + Claude OCR fallback) → EŞLEŞTİR (maddeler tablosu) → KURALLAR (deterministik skor + profil bayrakları) → ANLAT (Claude ile 3-4 cümle açıklama). Sonuçlar önbelleklenir.
3. **Çoklu kitle profili ve sonuç kartı** — Kullanıcı profilinde birden fazla kitle seçimi (bebek, hamile, hassas cilt, gıda alerjileri, vegan, diyabet vb.); sonuç kartında tek renk skor (yeşil/sarı/kırmızı), profil eşleşme uyarıları, katkı detayları.
4. **Aylık kota + paywall + RevenueCat abonelik** — Ücretsiz plan: ayda 5 yeni ürün analizi; Pro (aylık 69 TL): sınırsız. RevenueCat SDK ile App Store/Google Play aboneliği; webhook ile Edge Function üzerinden abonelik durumu senkronize.
5. **Onboarding, auth ve tarama geçmişi** — 4 slaytlık ilk açılış onboarding; e-posta OTP + Google + Apple girişi; geçmiş taramalar listesi.

### Sonraki sürüm (MVP dışı)

- Yıllık abonelik planı
- Alternatif ürün önerisi (aynı kategoride daha temiz skor)
- Favoriler listesi
- Bilinmeyen maddeleri topluluk katkısıyla ekleme (crowd-sourced)
- Paylaşılabilir ürün kartı (sosyal medya görsel + deep link)
- Push bildirim (geri gelme hatırlatması, yeni özellik duyurusu)
- Analitik entegrasyonu

## 3. Ekranlar

| # | Ekran | Route | Amaç | Ana bileşenler | Gittiği ekranlar |
|---|-------|-------|------|----------------|------------------|
| 1 | Splash | (native, expo-splash-screen) | Tasarım token'larından statik açılış ekranı | Uygulama logosu + arka plan | Onboarding veya Tabs |
| 2 | Onboarding | `app/(onboarding)/index.tsx` | İlk açılışta 4 slaytlık tanıtım | OnboardingSlider, SlideItem (SVG illüstrasyon + başlık + açıklama), Atla/Devam/Başla butonları | Auth veya Tabs |
| 3 | Login | `app/(auth)/login.tsx` | Giriş ekranı: e-posta OTP, Google, Apple | EmailInput, OTPRequestButton, GoogleSignInButton, AppleSignInButton, KVKK linki | VerifyOTP, Tabs |
| 4 | Verify OTP | `app/(auth)/verify-otp.tsx` | 6 haneli OTP doğrulama | OTPInput (6 hane), ResendButton, geri sayım | Tabs (profil yoksa Profile) |
| 5 | Scanner (Home) | `app/(tabs)/index.tsx` | Barkod tarama + fotoğraf çekme | CameraView (barcode scanner), PhotoCaptureButton, FlashToggle, kalan kota badge, QuotaBar | IngredientConfirm, AnalysisResult, Paywall |
| 6 | Ingredient Confirm | `app/ingredient-confirm.tsx` | Fotoğraftan çıkarılan içerikleri onaylatma | IngredientList (düzenlenebilir), ConfirmButton, fotoğraf önizleme | AnalysisResult |
| 7 | Analysis Result | `app/analysis/[id].tsx` | Sonuç kartı: skor + uyarı + açıklama | ScoreCircle (yeşil/sarı/kırmızı), ProfileWarnings, ExplanationCard, IngredientDetails (accordion), DisclaimerNote, SaveToHistoryButton | Scanner |
| 8 | History | `app/(tabs)/history.tsx` | Geçmiş taramalar listesi | HistoryList (FlashList), HistoryCard (ürün adı, skor badge, tarih), boş durum | AnalysisResult |
| 9 | Profile | `app/(tabs)/profile.tsx` | Kullanıcı profili, kitle seçimi, hesap yönetimi | AudienceSelector (multi-chip), kotaBilgisi, ProBadge, hesap bilgileri, ayarlar linki | Settings, Paywall |
| 10 | Settings | `app/settings.tsx` | Uygulama ayarları | ThemeToggle (gelecek), OnboardingReplay, abonelik yönetimi linki, KVKK linki, kullanım şartları, uygulama sürümü, çıkış yap | Paywall, Legal |
| 11 | Paywall | `app/paywall.tsx` | Pro abonelik satın alma | PricingCard, FeatureList, PurchaseButton, RestorePurchasesButton, yasal linkler | Tabs |
| 12 | Privacy Policy | `app/legal/privacy.tsx` | KVKK aydınlatma metni | ScrollView + Markdown içerik | — |
| 13 | Terms of Use | `app/legal/terms.tsx` | Kullanım şartları | ScrollView + Markdown içerik | — |

## 4. Navigasyon ağacı

```
app/
  _layout.tsx                    # Root: QueryClientProvider, SafeAreaProvider, Supabase auth listener, theme
  (onboarding)/
    _layout.tsx                  # Stack; onboarding görülmüşse redirect
    index.tsx                    # 4-slide onboarding
  (auth)/
    _layout.tsx                  # Stack; auth varsa redirect
    login.tsx                    # Email + Google + Apple
    verify-otp.tsx               # 6-digit OTP
  (tabs)/
    _layout.tsx                  # BottomTab: Scanner, History, Profile
    index.tsx                    # Scanner (home)
    history.tsx                  # Scan history
    profile.tsx                  # Profile + audience
  analysis/
    [id].tsx                     # Analysis result card
  ingredient-confirm.tsx         # Confirm OCR-extracted ingredients
  paywall.tsx                    # Pro subscription
  settings.tsx                   # App settings
  legal/
    _layout.tsx                  # Stack
    privacy.tsx                  # KVKK
    terms.tsx                    # Terms
```

## 5. Veri modeli

### Zod şemaları

```ts
// src/lib/schemas.ts
import { z } from "zod";

// --- Kitle türleri ---
export const AUDIENCE_TYPES = [
  "bebek", "hamile", "hassas_cilt", "gluten_alerjisi",
  "laktoz_intoleransi", "fistik_alerjisi", "vegan", "diyabet",
] as const;
export const AudienceType = z.enum(AUDIENCE_TYPES);
export type AudienceType = z.infer<typeof AudienceType>;

// --- Profil ---
export const Profile = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  audiences: z.array(AudienceType),
  displayName: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Profile = z.infer<typeof Profile>;

// --- Madde (Ingredient) ---
export const RiskLevel = z.enum(["guvenli", "dikkat", "sakincali"]);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const Madde = z.object({
  id: z.string().uuid(),
  ad: z.string(),                          // Türkçe ad
  esAnlamlilar: z.array(z.string()),       // INCI / alternatif isimler
  kategori: z.enum(["gida", "kozmetik", "temizlik", "genel"]),
  islev: z.string(),                       // ne işe yarar
  riskSeviyesi: RiskLevel,                 // genel risk
  kaynak: z.string().nullable(),           // referans URL
  kitleBayraklari: z.record(AudienceType, RiskLevel).nullable(),
  createdAt: z.string().datetime(),
});
export type Madde = z.infer<typeof Madde>;

// --- Ürün Analizi ---
export const SkorRenk = z.enum(["yesil", "sari", "kirmizi"]);
export type SkorRenk = z.infer<typeof SkorRenk>;

export const AnalizSonucu = z.object({
  id: z.string().uuid(),
  barkod: z.string().nullable(),
  urunAdi: z.string().nullable(),
  kategori: z.enum(["gida", "kozmetik", "temizlik", "genel"]),
  skor: SkorRenk,
  aciklama: z.string(),                    // Claude'dan 3-4 cümle
  maddeler: z.array(z.object({
    maddeId: z.string().uuid().nullable(), // null = bilinmeyen
    ad: z.string(),
    riskSeviyesi: RiskLevel,
    islev: z.string().nullable(),
    kaynak: z.string().nullable(),
    aiTahmini: z.boolean(),                // bilinmeyen için true
  })),
  profilUyarilari: z.array(z.object({
    kitle: AudienceType,
    maddeAd: z.string(),
    riskSeviyesi: RiskLevel,
    aciklama: z.string(),
  })),
  bilinmeyenler: z.array(z.string()),
  kaynakUrl: z.string().nullable(),        // Open Food Facts linki
  createdAt: z.string().datetime(),
});
export type AnalizSonucu = z.infer<typeof AnalizSonucu>;

// --- Tarama Geçmişi ---
export const TaramaKaydi = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  analizId: z.string().uuid(),
  barkod: z.string().nullable(),
  urunAdi: z.string().nullable(),
  skor: SkorRenk,
  createdAt: z.string().datetime(),
});
export type TaramaKaydi = z.infer<typeof TaramaKaydi>;

// --- Kullanım (Kota) ---
export const Kullanim = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  donem: z.string(),                       // "YYYY-MM"
  sorguSayisi: z.number().int().min(0),
});
export type Kullanim = z.infer<typeof Kullanim>;

// --- Abonelik ---
export const AbonelikDurum = z.enum(["aktif", "suresi_dolmus", "iptal_edildi", "deneme"]);
export const Abonelik = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  durum: AbonelikDurum,
  bitis: z.string().datetime(),
  magaza: z.enum(["app_store", "play_store"]),
  revenuecatId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Abonelik = z.infer<typeof Abonelik>;
```

### Supabase SQL şeması

```sql
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

create policy "Kullanıcı kendi profilini okur"
  on public.profiller for select
  using (auth.uid() = user_id);

create policy "Kullanıcı kendi profilini oluşturur"
  on public.profiller for insert
  with check (auth.uid() = user_id);

create policy "Kullanıcı kendi profilini günceller"
  on public.profiller for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- 2. Maddeler (Ingredient veritabanı)
-- =============================================
create table public.maddeler (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  es_anlamlilar text[] not null default '{}',
  kategori text not null check (kategori in ('gida', 'kozmetik', 'temizlik', 'genel')),
  islev text not null default '',
  risk_seviyesi text not null check (risk_seviyesi in ('guvenli', 'dikkat', 'sakincali')),
  kaynak text,
  kitle_bayraklari jsonb,  -- { "bebek": "sakincali", "hamile": "dikkat", ... }
  created_at timestamptz not null default now()
);
alter table public.maddeler enable row level security;

-- Maddeler herkese açık okunan referans verisi
create policy "Herkes maddeleri okur"
  on public.maddeler for select
  using (true);

-- Sadece service_role ile yazılır (seed/migration)
create policy "Sadece servis yazabilir"
  on public.maddeler for insert
  with check (false);

create policy "Sadece servis güncelleyebilir"
  on public.maddeler for update
  using (false)
  with check (false);

-- Eş anlamlı arama için GIN index
create index maddeler_es_anlamlilar_idx on public.maddeler using gin (es_anlamlilar);
create index maddeler_ad_idx on public.maddeler using btree (lower(ad));

-- =============================================
-- 3. Ürün Analizleri (Önbellek)
-- =============================================
create table public.urun_analizleri (
  id uuid primary key default gen_random_uuid(),
  barkod text,
  urun_adi text,
  kategori text not null check (kategori in ('gida', 'kozmetik', 'temizlik', 'genel')),
  skor text not null check (skor in ('yesil', 'sari', 'kirmizi')),
  aciklama text not null,
  maddeler jsonb not null,          -- AnalizSonucu.maddeler JSON array
  profil_uyarilari jsonb not null,  -- AnalizSonucu.profilUyarilari JSON array
  bilinmeyenler text[] not null default '{}',
  kaynak_url text,
  created_at timestamptz not null default now()
);
alter table public.urun_analizleri enable row level security;

-- Herkes önceki analizleri okuyabilir (barkod önbellek)
create policy "Herkes analizleri okur"
  on public.urun_analizleri for select
  using (true);

-- Sadece Edge Function (service_role) yazar
create policy "Sadece servis analiz yazabilir"
  on public.urun_analizleri for insert
  with check (false);

create index urun_analizleri_barkod_idx on public.urun_analizleri using btree (barkod);

-- =============================================
-- 4. Tarama Geçmişi
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

create policy "Kullanıcı kendi geçmişini okur"
  on public.tarama_gecmisi for select
  using (auth.uid() = user_id);

create policy "Kullanıcı kendi geçmişini oluşturur"
  on public.tarama_gecmisi for insert
  with check (auth.uid() = user_id);

create index tarama_gecmisi_user_idx on public.tarama_gecmisi using btree (user_id, created_at desc);

-- =============================================
-- 5. Kullanım (Kota)
-- =============================================
create table public.kullanim (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  donem text not null,  -- "YYYY-MM"
  sorgu_sayisi integer not null default 0,
  constraint kullanim_user_donem_unique unique (user_id, donem)
);
alter table public.kullanim enable row level security;

create policy "Kullanıcı kendi kotasını okur"
  on public.kullanim for select
  using (auth.uid() = user_id);

-- Edge Function (service_role) arttırır
create policy "Sadece servis kota yazabilir"
  on public.kullanim for insert
  with check (false);

create policy "Sadece servis kota güncelleyebilir"
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

create policy "Kullanıcı kendi aboneliğini okur"
  on public.abonelikler for select
  using (auth.uid() = user_id);

-- Sadece Edge Function (webhook) yazar/günceller
create policy "Sadece servis abonelik yazabilir"
  on public.abonelikler for insert
  with check (false);

create policy "Sadece servis abonelik güncelleyebilir"
  on public.abonelikler for update
  using (false)
  with check (false);

-- =============================================
-- 7. Fonksiyonlar
-- =============================================

-- Otomatik updated_at trigger
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
```

### Saklama kararı

| Veri | Nerede | Neden |
|------|--------|-------|
| Profil (audiences, display_name) | Supabase `profiller` | Cihaz değiştirince korunmalı |
| Maddeler veritabanı | Supabase `maddeler` | Tüm kullanıcılara ortak referans |
| Ürün analizleri önbellek | Supabase `urun_analizleri` | Barkod bazlı global önbellek |
| Tarama geçmişi | Supabase `tarama_gecmisi` | Kullanıcıya özel, cihaz arası |
| Kota sayacı | Supabase `kullanim` | Manipülasyona kapalı olmalı |
| Abonelik durumu | Supabase `abonelikler` | RevenueCat webhook ile senkron |
| Onboarding görüldü mü | AsyncStorage (Zustand persist) | Sadece cihaz bazlı tercih |
| Auth token | expo-secure-store | Hassas veri |
| Tema tercihi | AsyncStorage (Zustand persist) | Cihaz tercihi |

## 6. Supabase kullanımı

| Özellik | MVP'de | Not |
|---------|--------|-----|
| Auth | Evet — Email OTP (6 hane, şifresiz) + Google (signInWithIdToken) + Apple (expo-apple-authentication) | Magic link yok, doğrudan OTP |
| Postgres tabloları | Evet | profiller, maddeler, urun_analizleri, tarama_gecmisi, kullanim, abonelikler |
| Storage | Evet | `ingredient-photos` bucket — içindekiler etiketi fotoğrafları (Edge Function'a gönderilip işlendikten sonra 24 saat TTL ile silinir) |
| Realtime | Yok | MVP'de gerek yok |
| Edge Functions | Evet | `analyze-product` (4 adımlı analiz hattı), `revenuecat-webhook` (abonelik senkron), `check-quota` (kota sorgulama) |

### Edge Functions detayı

#### `analyze-product`
- **Tetikleyici:** Client POST isteği (barkod veya fotoğraf)
- **Adımlar:**
  1. OKU: Barkod varsa Open Food Facts API (`https://world.openfoodfacts.org/api/v3/product/{barcode}?product_type=all`); bulunamazsa veya fotoğraf geldiyse fotoğrafı Claude API'ye gönderip içerik JSON'u çıkar
  2. EŞLEŞTİR: Her maddeyi `maddeler` tablosunda ad + es_anlamlilar üzerinden ara
  3. KURALLAR: Deterministik skor hesapla (1+ sakıncalı = kırmızı, 2+ dikkat = sarı, aksi yeşil); profil kitleleri uygula, en sert bayrak kazanır
  4. ANLAT: 3. adım sonucunu Claude API'ye gönder, 3-4 cümle sade Türkçe açıklama al
- **Kota:** İşlem öncesi kullanım kontrolü; yeni ürün ise sayaç arttır; önbellekteki ürün için arttırmaz
- **Önbellek:** Barkodlu sonuçlar `urun_analizleri`'ne kaydedilir
- **Secret'lar:** `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

#### `revenuecat-webhook`
- **Tetikleyici:** RevenueCat webhook POST
- **İşlem:** Webhook imzasını doğrula, `abonelikler` tablosunu güncelle (durum, bitiş, mağaza)
- **Secret'lar:** `REVENUECAT_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`

#### `check-quota`
- **Tetikleyici:** Client GET isteği
- **İşlem:** Kullanıcının aktif aboneliğini kontrol et; yoksa `kullanim` tablosundan mevcut dönem sayacını dön
- **Dönüş:** `{ remaining: number, total: number, isPro: boolean }`

## 7. Dış bağımlılıklar

| Bağımlılık | MVP'de | Paket / Servis | Not |
|------------|--------|----------------|-----|
| Barkod tarama | Evet | `expo-camera` (CameraView + onBarcodeScanned) | expo-barcode-scanner deprecated; CameraView kullanılacak |
| Kamera (fotoğraf) | Evet | `expo-camera` | Aynı paket, fotoğraf çekimi için |
| Google Sign-In | Evet | `@react-native-google-signin/google-signin` | Expo config plugin ile; Expo Go'da çalışmaz, dev-client gerekir |
| Apple Sign-In | Evet | `expo-apple-authentication` | iOS zorunlu |
| Abonelik/IAP | Evet | `react-native-purchases` (RevenueCat) | Expo config plugin; EAS build zorunlu |
| AI (OCR + açıklama) | Evet | Anthropic Claude API (Edge Function içinden) | `ANTHROPIC_API_KEY` server-side |
| Ürün veritabanı | Evet | Open Food Facts / Open Beauty Facts / Open Products Facts API | Ücretsiz, API key gereksiz, User-Agent zorunlu |
| Güvenli depolama | Evet | `expo-secure-store` | Auth token için |
| Splash screen | Evet | `expo-splash-screen` | Tasarım token'larından statik splash |
| Image picker | Evet | `expo-image-picker` | Galeriden fotoğraf seçimi (alternatif giriş) |
| İkonlar | Evet | `lucide-react-native` | Tutarlı, tree-shakeable ikon seti |
| Animasyon | Evet | `lottie-react-native` | Onboarding illüstrasyonları ve micro-interaction'lar |
| Push bildirim | Yok | — | Sonraki sürüm |
| Analitik | Yok | — | Sonraki sürüm |
| Deep link / paylaşılabilir kart | Yok | — | Sonraki sürüm |

## 8. Varsayımlar

1. **OTP dili:** Supabase Auth OTP e-postaları Türkçe şablon ile gönderilir (Supabase dashboard'dan ayarlanır).
2. **Maddeler seed verisi:** MVP'de her kategoriden (gıda, kozmetik, temizlik) en yaygın ~150-200 madde ile seed edilir; toplam ~500-600 kayıt. Seed dosyası `supabase/seed.sql` olarak sağlanır.
3. **Claude API modeli:** Edge Function'larda `claude-sonnet-4-20250514` kullanılır (hız/maliyet dengesi). OCR ve açıklama için ayrı prompt'lar.
4. **Fotoğraf boyutu:** İçindekiler etiketi fotoğrafları client tarafında 1024px max edge'e resize edilip JPEG %80 kalitede sıkıştırılır, sonra Storage'a yüklenir.
5. **Kota dönemi:** Takvim ayı bazlı (her ayın 1'inde sıfırlanır); Edge Function `YYYY-MM` formatında dönem oluşturur.
6. **Profil uyarı mantığı:** Eğer bir madde `kitle_bayraklari`'nda kullanıcının seçili kitlesinde `sakincali` ise kırmızı uyarı, `dikkat` ise sarı uyarı. Uyarılar sonuç kartının en üstünde gösterilir.
7. **Apple Sign-In:** iOS'ta zorunlu; Android'de gösterilmez (Platform.OS kontrolü).
8. **Expo Go kısıtları:** Google Sign-In, Apple Sign-In ve RevenueCat Expo Go'da çalışmaz. Geliştirme sırasında e-posta OTP ile test yapılır. Tam test için EAS dev-client build gerekir.
9. **KVKK ve kullanım şartları:** docs/ altında Türkçe taslak metin üretilir; hukuki inceleme kullanıcı sorumluluğunda.
10. **Fotoğraf Storage TTL:** İşlenen fotoğraflar 24 saat sonra otomatik silinir (Supabase Storage lifecycle veya Edge Function ile).

## 9. Açık sorular (kullanıcıya)

1. **Fotoğraf onaylama akışı:** Fotoğraftan çıkarılan içerik listesi kullanıcıya düzenlenebilir şekilde gösterilip onay mı alınacak, yoksa otomatik mi devam edilecek? *(Varsayım: kullanıcıya gösterilir ve onay alınır — IngredientConfirm ekranı bu amaçla eklendi.)*
2. **Madde veritabanı kaynağı:** Seed için kullanılacak madde listesi nereden temin edilecek? *(Varsayım: INCI veritabanları, EFSA/FDA referansları ve yaygın Türkçe gıda katkısı listeleri kullanılarak manuel hazırlanır.)*
3. **RevenueCat fiyatlandırma:** Aylık 69 TL fiyat sabiti mi, yoksa A/B test ile değişebilir mi? *(Varsayım: MVP'de sabit 69 TL; fiyat App Store Connect / Google Play Console'dan yönetilir, uygulama içinde hardcode edilmez.)*
