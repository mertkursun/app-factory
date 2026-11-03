# İçinde Ne Var? — PLAN

> Her görev tek bir modül veya ekran kadar küçük, 15-30 dk arası.
> `[P]` = önceki bağımlılığı olmayan, paralel yapılabilir görev.

---

## Faz 0 — Foundation

- [x] T01 — Proje iskeleti: `npx create-expo-app@latest`, Expo Router, NativeWind v4, Zustand, TanStack Query, Zod, react-hook-form, lucide-react-native, lottie-react-native, jest-expo + RNTL test altyapısı, ESLint + Prettier, `npm run check` script'i
  Kabul: `npm run check` geçer, boş tab navigasyonu çalışır, NativeWind className'ler render edilir
  Dosyalar: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/history.tsx`, `app/(tabs)/profile.tsx`, `tailwind.config.js`, `global.css`, `package.json`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc`, `app.json`, `babel.config.js`, `jest.config.js`

- [x] T02 — Supabase client + init: `supabase init`, migration dosyası (tüm tablolar + RLS + indexler), seed.sql şablonu, `src/lib/supabase.ts` client, `src/lib/schemas.ts` Zod tipleri, `.env.example`
  Kabul: `supabase db reset` başarılı, tipler üretilir (`supabase gen types typescript`), Supabase client import edilebilir
  Dosyalar: `supabase/config.toml`, `supabase/migrations/0001_init.sql`, `supabase/seed.sql`, `src/lib/supabase.ts`, `src/lib/schemas.ts`, `src/lib/database.types.ts`, `.env.example`

- [x] T03 — Servis katmanı + React Query hook'ları: profil CRUD, kota sorgulama, geçmiş listeleme, analiz getirme
  Kabul: Servis fonksiyonları birim testleri geçer (mock Supabase client ile), hook'lar export edilir
  Dosyalar: `src/services/profile.ts`, `src/services/quota.ts`, `src/services/history.ts`, `src/services/analysis.ts`, `src/hooks/useProfile.ts`, `src/hooks/useQuota.ts`, `src/hooks/useHistory.ts`, `src/hooks/useAnalysis.ts`, `src/__tests__/services/profile.test.ts`, `src/__tests__/services/quota.test.ts`

---

## Faz 1 — Auth

- [x] T04 — Supabase Auth altyapısı: auth state listener (`onAuthStateChange`), token'ı expo-secure-store'da sakla, Zustand auth store (session, user, isLoading), auth guard (root layout'ta yönlendirme)
  Kabul: Auth store testleri geçer, giriş yapılmadan korunan ekranlara erişim engellenir
  Dosyalar: `src/stores/authStore.ts`, `src/lib/auth.ts`, `src/__tests__/stores/authStore.test.ts`, `app/_layout.tsx` (güncelleme)

- [x] T05 — Login ekranı: e-posta girişi + OTP gönderme, Google Sign-In butonu (config plugin), Apple Sign-In butonu (iOS), KVKK linki
  Kabul: Email OTP gönderme akışı çalışır; Google/Apple butonları platform bazlı gösterilir; form validasyonu (Zod + react-hook-form) çalışır
  Dosyalar: `app/(auth)/_layout.tsx`, `app/(auth)/login.tsx`, `src/components/auth/EmailOTPForm.tsx`, `src/components/auth/GoogleSignInButton.tsx`, `src/components/auth/AppleSignInButton.tsx`

- [x] T06 — OTP doğrulama ekranı: 6 haneli kod girişi, geri sayım ile tekrar gönder, doğrulama sonrası yönlendirme (profil yoksa profil, varsa tabs)
  Kabul: OTP doğrulama akışı çalışır, yanlış kod hata gösterir, süresi dolan kod için tekrar gönder butonu aktif olur
  Dosyalar: `app/(auth)/verify-otp.tsx`, `src/components/auth/OTPInput.tsx`

---

## Faz 2 — Onboarding & Splash

- [x] T07 — Splash screen: expo-splash-screen yapılandırması, tasarım token'larından logo + arka plan rengi
  Kabul: Uygulama açıldığında tasarım diline uygun splash gösterilir, SplashScreen.hideAsync doğru zamanda çağrılır
  Dosyalar: `app.json` (splash config), `assets/splash.png`, `app/_layout.tsx` (güncelleme)

- [x] T08 — Onboarding slider: 4 slaytlık FlatList/PagerView slider, Lottie animasyonlu illüstrasyonlar, Atla/Devam/Başla butonları, AsyncStorage'da görüldü bilgisi, root layout'ta yönlendirme mantığı
  Kabul: İlk açılışta onboarding gösterilir, tekrar açılışta gösterilmez, "Atla" ile geçilir, son slaytta "Başla" butonu auth veya tabs'a yönlendirir
  Dosyalar: `app/(onboarding)/_layout.tsx`, `app/(onboarding)/index.tsx`, `src/components/onboarding/OnboardingSlider.tsx`, `src/components/onboarding/SlideItem.tsx`, `src/stores/appStore.ts`, `assets/lottie/`, `src/__tests__/components/OnboardingSlider.test.tsx`

---

## Faz 3 — Core Features

- [x] T09 — Scanner (Home) ekranı: CameraView ile barkod tarama, fotoğraf çekme butonu, flash toggle, kamera izin isteme, kalan kota badge
  Kabul: Kamera açılır, barkod okunduğunda callback tetiklenir, fotoğraf çekilebilir, izin reddedilince uygun mesaj gösterilir
  Dosyalar: `app/(tabs)/index.tsx`, `src/components/scanner/ScannerView.tsx`, `src/components/scanner/PhotoCaptureButton.tsx`, `src/components/scanner/FlashToggle.tsx`, `src/components/scanner/QuotaBadge.tsx`, `src/hooks/useCameraPermission.ts`

- [x] T10 — Ingredient Confirm ekranı: fotoğraftan çıkarılan içerik listesini gösterme, düzenlenebilir liste (ekleme/çıkarma), onay butonu ile analiz tetikleme
  Kabul: Fotoğraf önizlemesi gösterilir, içerik listesi düzenlenebilir, onay ile analyze-product Edge Function'a istek gider
  Dosyalar: `app/ingredient-confirm.tsx`, `src/components/ingredients/IngredientList.tsx`, `src/components/ingredients/IngredientItem.tsx`

- [x] T11 — Edge Function: `analyze-product` — 4 adımlı analiz hattı (OKU, EŞLEŞTİR, KURALLAR, ANLAT), kota kontrolü, önbellek yazma
  Kabul: Barkodlu ürün için Open Food Facts'ten veri çekilir, maddeler eşleştirilir, skor hesaplanır, açıklama üretilir; kota aşımında 402 döner; önbellekteki ürün için kota artmaz
  Dosyalar: `supabase/functions/analyze-product/index.ts`, `supabase/functions/analyze-product/steps/read.ts`, `supabase/functions/analyze-product/steps/match.ts`, `supabase/functions/analyze-product/steps/rules.ts`, `supabase/functions/analyze-product/steps/explain.ts`, `supabase/functions/analyze-product/lib/quota.ts`, `supabase/functions/analyze-product/lib/cache.ts`

- [x] T12 — Edge Function: `check-quota` — kullanıcının kalan hakkını ve Pro durumunu döndüren endpoint
  Kabul: Pro kullanıcı için `isPro: true` döner; ücretsiz kullanıcı için doğru `remaining` sayısı döner
  Dosyalar: `supabase/functions/check-quota/index.ts`

- [x] T13 — Analysis Result ekranı: skor dairesi (yeşil/sarı/kırmızı), profil uyarıları (kırmızı banner), Claude açıklaması, madde detayları (accordion), bilinmeyenler kutusu, 'tıbbi tavsiye değildir' notu, geçmişe kaydet
  Kabul: Analiz verisi doğru render edilir, profil uyarıları en üstte gösterilir, accordion açılıp kapanır, geçmişe kayıt eklenir
  Dosyalar: `app/analysis/[id].tsx`, `src/components/analysis/ScoreCircle.tsx`, `src/components/analysis/ProfileWarnings.tsx`, `src/components/analysis/ExplanationCard.tsx`, `src/components/analysis/IngredientDetails.tsx`, `src/components/analysis/UnknownIngredients.tsx`, `src/components/analysis/DisclaimerNote.tsx`

- [x] T14 — Scanner → Analiz akış entegrasyonu: barkod okunduğunda veya fotoğraf onaylandığında Edge Function çağrısı, loading durumu, hata yönetimi, sonuç ekranına yönlendirme, auth guard (giriş yoksa login'e yönlendir)
  Kabul: Tam akış çalışır — barkod oku → loading → sonuç; fotoğraf çek → confirm → loading → sonuç; giriş yapılmamışsa auth'a yönlendirir; kota doluysa paywall'a yönlendirir
  Dosyalar: `src/hooks/useAnalyzeProduct.ts`, `src/components/scanner/ScannerView.tsx` (güncelleme), `app/(tabs)/index.tsx` (güncelleme)

---

## Faz 4 — History & Profile

- [x] T15 — History ekranı: FlashList ile geçmiş taramalar listesi, ürün adı + skor badge + tarih, boş durum, tıklayınca sonuç ekranına git
  Kabul: Geçmiş taramalar listelenir (pagination), boş durumda uygun mesaj gösterilir, karta tıkla analiz ekranına gider
  Dosyalar: `app/(tabs)/history.tsx`, `src/components/history/HistoryCard.tsx`, `src/components/history/EmptyHistory.tsx`

- [x] T16 — Profile ekranı: kitle seçimi (multi-chip selector), kota bilgisi, Pro badge, hesap bilgileri, ayarlar linki, çıkış yap
  Kabul: Kitle seçimi kaydedilir ve profil güncellenir, kota bilgisi doğru gösterilir, çıkış yap çalışır
  Dosyalar: `app/(tabs)/profile.tsx`, `src/components/profile/AudienceSelector.tsx`, `src/components/profile/QuotaInfo.tsx`, `src/components/profile/ProBadge.tsx`

---

## Faz 5 — Subscription & Paywall

- [x] T17 — RevenueCat entegrasyonu: SDK kurulumu, config plugin, `src/lib/revenuecat.ts` init, Purchases.configure, offering/package getirme
  Kabul: RevenueCat SDK başlatılır, test offering'leri çekilir (sandbox); EAS dev-client build'de çalışır
  Dosyalar: `src/lib/revenuecat.ts`, `src/hooks/useSubscription.ts`, `app.json` (plugin config)

- [ ] T18 — Paywall ekranı: fiyat gösterimi (RevenueCat'ten dinamik), özellik listesi, satın al butonu, satın alımları geri yükle, gizlilik + kullanım şartları linkleri
  Kabul: Fiyat doğru gösterilir, satın alma akışı başlar (sandbox), geri yükleme çalışır, yasal linkler açılır
  Dosyalar: `app/paywall.tsx`, `src/components/paywall/PricingCard.tsx`, `src/components/paywall/FeatureList.tsx`, `src/components/paywall/PurchaseButton.tsx`, `src/components/paywall/RestoreButton.tsx`

- [ ] T19 — Edge Function: `revenuecat-webhook` — webhook imza doğrulama, abonelik durumu güncelleme
  Kabul: Test webhook'u gönderildiğinde `abonelikler` tablosu doğru güncellenir; geçersiz imza reddedilir
  Dosyalar: `supabase/functions/revenuecat-webhook/index.ts`

---

## Faz 6 — Settings & Legal

- [x] T20 — Settings ekranı: onboarding tekrar izle, abonelik yönetimi linki, KVKK + kullanım şartları linkleri, uygulama sürümü, çıkış yap
  Kabul: Her link/buton doğru çalışır, onboarding replay AsyncStorage'ı sıfırlar ve onboarding'e yönlendirir
  Dosyalar: `app/settings.tsx`, `src/components/settings/SettingsItem.tsx`

- [x] T21 — Legal ekranları: KVKK aydınlatma metni taslağı, abonelik kullanım şartları taslağı
  Kabul: Her iki ekran Türkçe içerikle render edilir, ScrollView ile kaydırma çalışır
  Dosyalar: `app/legal/_layout.tsx`, `app/legal/privacy.tsx`, `app/legal/terms.tsx`, `docs/kvkk-aydinlatma.md`, `docs/kullanim-sartlari.md`

---

## Faz 7 — Seed Data

- [ ] T22 — Maddeler seed verisi: gıda (~200), kozmetik (~150), temizlik (~100) kategorilerinde en yaygın maddelerin seed.sql dosyasına eklenmesi, eş anlamlılar ve kitle bayrakları ile
  Kabul: `supabase db reset` sonrası `maddeler` tablosunda ~450+ kayıt var, her kategoride en az 50 kayıt; örnek barkod ile analiz hattı uçtan uca çalışır
  Dosyalar: `supabase/seed.sql`

---

## Faz 8 — Polish

- [ ] T23 — Boş durumlar, loading ve hata ekranları: tüm ekranlar için skeleton/loading state, hata durumu (retry butonu), boş liste durumları, network hatası
  Kabul: Her ekranda loading, error ve empty state'ler gösterilir; çevrimdışı durumda uygun mesaj çıkar
  Dosyalar: `src/components/ui/LoadingScreen.tsx`, `src/components/ui/ErrorScreen.tsx`, `src/components/ui/EmptyState.tsx`, ilgili ekran dosyaları (güncelleme)

- [ ] T24 — Polish: app.json metadata (ad, slug, icon, splash, version, bundleIdentifier, package), EAS yapılandırması (`eas.json`), `.env.example` güncelleme, README
  Kabul: `eas build --profile preview --platform ios` ve `android` başarılı başlar; app.json tüm zorunlu alanları içerir
  Dosyalar: `app.json`, `eas.json`, `.env.example`
