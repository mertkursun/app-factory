# İçinde Ne Var?

Bu dosya `apps/icinde-ne-var/` içinde çalışırken yüklenir. Fabrika kuralları kök `CLAUDE.md`'de; burası app'e özel.

## Ne yapıyor

Market ürünlerinin (gıda, kozmetik, temizlik) barkodunu okutarak veya içindekiler etiketinin fotoğrafını çekerek içeriği sade Türkçe ile açıklar ve kullanıcının profiline göre (bebek, hamile, hassas cilt, alerji, vegan, diyabet) uyarı verir. 4 adımlı analiz hattı (OKU-EŞLEŞTİR-KURALLAR-ANLAT) Supabase Edge Function'da çalışır, sonuç yeşil/sarı/kırmızı skor kartı olarak gösterilir.

## Durum
- Plan: `PLAN.md` (açık görevler `[ ]`)
- PRD: `docs/PRD.md`
- Sürüm: `app.json` → `version`

## Komutlar
```
npm run check        # typecheck + lint + test — commit öncesi zorunlu
npx expo start       # geliştirme
npm test -- --watch  # test döngüsü
```

## App'e özel kararlar

- İkon kütüphanesi: `lucide-react-native` — başka ikon paketi kullanma.
- Animasyon: `lottie-react-native` — onboarding illüstrasyonları ve micro-interaction'lar Lottie ile.
- Tab bar: Floating pill tab bar (klasik tab bar değil).
- Auth: Supabase Email OTP (6 hane, şifresiz) + Google Sign-In (`@react-native-google-signin/google-signin`) + Apple Sign-In (`expo-apple-authentication`). Magic link yok.
- Barkod tarama: `expo-camera` CameraView + `onBarcodeScanned`. `expo-barcode-scanner` deprecated, kullanma.
- AI: Claude API yalnızca Edge Function içinden çağrılır (server-side). Client'ta AI çağrısı yok.
- Kota: Yeni ürün analizi sayılır, önbellekteki ürün tekrar okutulursa sayılmaz. Sayaç Edge Function içinde artar.
- Abonelik: RevenueCat (`react-native-purchases`), fiyat App Store/Google Play'den çekilir (hardcode yok).
- Analiz önbelleği: Barkod bazlı global önbellek (`urun_analizleri` tablosu). Fotoğraftan gelen ürünler önbelleklenmez (barkod yok).
- Fotoğraf işleme: Client'ta 1024px max edge resize + JPEG %80, sonra Supabase Storage'a yükle.
- Expo Go kısıtı: Google Sign-In, Apple Sign-In, RevenueCat Expo Go'da çalışmaz. Dev test için email OTP kullan.
- KVKK/legal metinler taslaktır, hukuki inceleme kullanıcı sorumluluğunda.

## Bilinen tuzaklar

- `expo-barcode-scanner` SDK 51'den itibaren kaldırıldı. `expo-camera` CameraView kullan.
- Google Sign-In config plugin gerektirir, Expo Go'da çalışmaz. EAS dev-client build şart.
- RevenueCat test için sandbox ortam gerektirir; gerçek satın alma testi için TestFlight/Internal Testing.
- Open Food Facts API User-Agent header'ı zorunlu kılar; göndermezsen rate limit'e takılırsın.
- Supabase Edge Function'lar Deno runtime kullanır; Node.js API'leri (fs, path vb.) yok.
- `maddeler` tablosuna RLS insert/update `false` policy'si var; seed ve güncelleme yalnızca `service_role` key ile yapılır.
