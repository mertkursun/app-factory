---
name: review-patterns
description: Recurring code quality patterns found in icinde-ne-var app during reviews
metadata:
  type: project
---

Tekrar eden sorun kaliplari (sonraki review'da once bunlara bak):

1. **textTransform uppercase**: settings.tsx ve search.tsx'de `textTransform: "uppercase"` kullaniliyor. Turkce karakter kirar. `toUpperTR()` kullanilmali.

2. **Hardcoded hex renk**: ErrorScreen, LoadingScreen, NetworkError, EmptyState, ProfileWarnings, SplashAnimation, profile.tsx (AVATAR_BG, AVATAR_TEXT_COLOR) dosyalarinda token yerine dogrudan hex renk yazili.

3. **Hardcoded i18n stringleri**: stats.tsx'de CATEGORY_LABELS hardcoded TR/EN. constants.ts'de AUDIENCE_LABELS hardcoded. Her yeni dosyada kontrol et.

4. **send-notification Edge Function guvenlik eksikligi**: Auth/yetki kontrolu yok. Herhangi bir istemci bildirim gonderebilir.

5. **Eksik migration**: `urun_analizleri` tablosundaki `marka` ve `uretim_ulkesi` kolonlari migration dosyalarinda tanimlanmamis.

6. **Search SQL injection**: `search.ts:29` ve `encyclopedia.ts:13`'te kullanici girdisi dogrudan ILIKE/OR filtresine interpolate ediliyor.

7. **FilterChip tekrari**: history.tsx ve search.tsx ayni bileseni yeniden tanimliyor.

8. **Dusuk test kapsami**: Tum proje icin sadece 3 test dosyasi var.

**Why:** Bu kaliplar ilk ve ikinci review'larda bulundu (2026-11-04, 2026-11-06), tekrar etme olasiligi yuksek.
**How to apply:** Her PR'da once bu kaliplara bak, sonra genel kontrol listesine gec.
