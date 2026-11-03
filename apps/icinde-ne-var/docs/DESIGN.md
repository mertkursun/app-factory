# İçinde Ne Var? — Tasarım

**Önizleme:** `docs/design-preview.html` — **Token'lar:** `docs/tokens.json`

## 1. Tasarım dili

**Sıcak, organik, sade, güvenilir**

Görsel fikir: **Organik kapsül formu.** Tüm etkileşim elemanları (butonlar, chip'ler, badge'ler) hap/kapsül şeklinde tam yuvarlatılmış (pill shape); kartlar ve yüzeyler cömert padding ile yumuşak köşelere sahip. Bu form dili, içeriklerin "içinde ne olduğunu" araştıran sağlık/içerik temasına metaforik olarak bağlanırken, samimi ve modern bir his yaratır.

Hedef kullanıcı (ebeveynler, hamileler, alerji hastaları) güven, şeffaflık ve hız arıyor. Palet doğadan ilham alan derin teal (yeşil-mavi) üzerine kurulu, sıcak fildişi zeminle dengelenmiş. Skor renkleri (yeşil/sarı/kırmızı) tasarımın merkezinde — trafik lambası metaforu anlıktır, herkesin anladığı bir dil. Coğrafi dolgunluk ve cömert boşluk, bilgi yoğunluğunu sindirilebilir parçalara böler.

## 2. Renk token'ları

### Light mode

| Token | Hex | Kullanım |
|-------|-----|----------|
| primary | `#0F766E` | Ana aksiyon, aktif tab, link'ler |
| primaryForeground | `#FFFFFF` | Primary buton/yüzey üzerindeki metin |
| background | `#FAFAF7` | Ekran zemini (sıcak fildişi) |
| surface | `#FFFFFF` | Kart, sheet, input arka planı |
| surfaceSecondary | `#F0FDFA` | Tarayıcı vurgu alanı, seçili alan |
| text | `#1C1917` | Birincil metin |
| textSecondary | `#57534E` | İkincil metin, tarihler, alt başlıklar |
| muted | `#78716C` | Placeholder, ipucu metinleri |
| border | `#E7E5E4` | Ayırıcı, input kenarı |
| borderStrong | `#D6D3D1` | Güçlü kenar (aktif ayırıcı) |
| success | `#16A34A` | Skor yeşil, başarı geri bildirimi |
| successLight | `#DCFCE7` | Yeşil badge/banner arka planı |
| successText | `#15803D` | Yeşil badge üzerindeki metin |
| warning | `#CA8A04` | Skor sarı, uyarı geri bildirimi |
| warningLight | `#FEF9C3` | Sarı badge/banner arka planı |
| warningText | `#854D0E` | Sarı badge üzerindeki metin |
| danger | `#DC2626` | Skor kırmızı, hata geri bildirimi |
| dangerLight | `#FEE2E2` | Kırmızı badge/banner arka planı |
| dangerText | `#991B1B` | Kırmızı badge üzerindeki metin |

### Dark mode

| Token | Hex | Kullanım |
|-------|-----|----------|
| primary | `#2DD4BF` | Ana aksiyon (parlak teal) |
| primaryForeground | `#042F2E` | Primary üzerindeki metin (koyu teal) |
| background | `#0C0A09` | Ekran zemini (sıcak siyah) |
| surface | `#1C1917` | Kart, sheet |
| surfaceSecondary | `#042F2E` | Tarayıcı vurgu, seçili alan |
| text | `#FAFAF9` | Birincil metin |
| textSecondary | `#A8A29E` | İkincil metin |
| muted | `#87817B` | Placeholder |
| border | `#292524` | Ayırıcı |
| borderStrong | `#44403C` | Güçlü kenar |
| success | `#4ADE80` | Skor yeşil |
| successLight | `#052E16` | Yeşil badge bg |
| successText | `#4ADE80` | Yeşil badge metin |
| warning | `#FACC15` | Skor sarı |
| warningLight | `#422006` | Sarı badge bg |
| warningText | `#FACC15` | Sarı badge metin |
| danger | `#F87171` | Skor kırmızı |
| dangerLight | `#450A0A` | Kırmızı badge bg |
| dangerText | `#F87171` | Kırmızı badge metin |

### Kontrast doğrulaması (Light)

| Çift | Oran | Sonuç |
|------|------|-------|
| text `#1C1917` / background `#FAFAF7` | 17.8:1 | AA |
| textSecondary `#57534E` / background `#FAFAF7` | 7.3:1 | AA |
| muted `#78716C` / background `#FAFAF7` | 4.6:1 | AA |
| primaryForeground `#FFF` / primary `#0F766E` | 5.6:1 | AA |
| successText `#15803D` / successLight `#DCFCE7` | 4.6:1 | AA |
| warningText `#854D0E` / warningLight `#FEF9C3` | 6.6:1 | AA |
| dangerText `#991B1B` / dangerLight `#FEE2E2` | 6.8:1 | AA |

### Kontrast doğrulaması (Dark)

| Çift | Oran | Sonuç |
|------|------|-------|
| text `#FAFAF9` / background `#0C0A09` | 19.2:1 | AA |
| textSecondary `#A8A29E` / background `#0C0A09` | 7.9:1 | AA |
| primaryForeground `#042F2E` / primary `#2DD4BF` | 9.4:1 | AA |
| text `#FAFAF9` / surface `#1C1917` | 15.4:1 | AA |

### Skor renkleri — fonksiyonel notlar

Skor renkleri (success/warning/danger) yalnızca renk ile anlam taşımaz. Her skor seviyesinde renk + ikon + metin birlikte kullanılır:
- Yeşil: renk + `checkmark-circle` ikonu + "Güvenli" etiketi
- Sarı: renk + `alert-triangle` ikonu + "Dikkat" etiketi
- Kırmızı: renk + `x-circle` ikonu + "Sakıncalı" etiketi

Primary teal (hue ~175deg) ile skor yeşili (hue ~142deg) arasında 33deg fark var, görsel karışıklık olmaz.

## 3. Tipografi

**Aile:** Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`)

Yuvarlatılmış terminalleriyle sıcak ve samimi, geometrik yapısıyla modern ve okunaklı. Inter/Roboto'nun aksine belirgin bir karakteri var. Display ağırlığında (ExtraBold 800) cesur başlıklar, body ağırlığında (Regular 400) rahat okuma sağlar.

| Stil | Boyut (pt) | Ağırlık | Satır yüksekliği | Letter-spacing | Kullanım |
|------|-----------|---------|------------------|----------------|----------|
| display | 32 | 800 (ExtraBold) | 38 | -0.5 | Onboarding başlıkları, skor |
| title | 22 | 700 (Bold) | 28 | -0.3 | Ekran başlıkları, bölüm başlıkları |
| body | 16 | 400 (Regular) | 24 | 0 | Paragraf, açıklama metinleri |
| caption | 13 | 500 (Medium) | 18 | 0 | Tarih, metadata, yardımcı metin |
| label | 14 | 600 (SemiBold) | 20 | 0.1 | Buton etiketi, chip, badge |

### Kurallar
- 18pt altında 400'den hafif ağırlık kullanılmaz
- Sayı gösterimlerinde (kota, tarih) `tabular-nums` (fontVariant: ['tabular-nums'])
- Uzun metinlerde (açıklama, legal) satırda max ~65 karakter
- `adjustsFontSizeToFit` yalnızca tek satırlık etiketlerde; paragrafta yasak
- `numberOfLines` ile truncation yapılan her yerde detay ekranına erişim sağlanır

## 4. Boşluk ve biçim

### Grid
4pt temel grid. Tüm boşluk değerleri 4'ün katı.

| Token | Değer |
|-------|-------|
| xs | 4pt |
| sm | 8pt |
| md | 16pt |
| lg | 24pt |
| xl | 32pt |
| 2xl | 48pt |

### Ekran kenarlığı (horizontal padding)
`md` (16pt) standart. Kart içerikleri ek `md` padding alır.

### Radius

| Token | Değer | Kullanım |
|-------|-------|----------|
| sm | 8pt | Input, küçük kart |
| md | 12pt | Orta kart, görsel |
| lg | 20pt | Ana kart, bottom sheet |
| xl | 28pt | Tab bar container, büyük sheet |
| full | 9999pt | Buton, chip, badge, avatar, skor dairesi |

**Konsantrik radius kuralı:** Dış radius = iç radius + padding + border. Örneğin kart (radius-lg 20pt) içindeki buton (radius-full) için, butonun karttan padding mesafesi en az ~4pt olmalıdır.

### Gölge

| Seviye | iOS shadow | Android elevation | Kullanım |
|--------|-----------|-------------------|----------|
| sm | offset(0,1) opacity 0.05 radius 2 | elevation 1 | Subtle ayırma |
| card | offset(0,2) opacity 0.08 radius 8 | elevation 3 | Kart, floating element |
| sheet | offset(0,-4) opacity 0.12 radius 24 | elevation 8 | Bottom sheet, modal |

Dark mode'da gölge yerine `border` kullanılır (koyu zeminde gölge görünmez).

## 5. Bileşen envanteri

### Atomik bileşenler (`src/components/ui/`)

| Bileşen | Varyantlar | Durumlar | Not |
|---------|------------|----------|-----|
| Button | primary, secondary, ghost, danger | default, pressed (scale 0.96), disabled (opacity 0.5), loading (spinner) | Pill shape (radius-full). Min yükseklik 48pt, min genişlik 48pt |
| IconButton | primary, ghost | default, pressed, disabled | Dairesel (radius-full), 44pt min boyut |
| Input | default, error | default, focused (primary border), error (danger border + mesaj), disabled | radius-sm, 48pt yükseklik |
| OTPInput | — | default, focused, filled, error | 6 ayrı kutu, her biri 48x56pt, radius-sm |
| Card | default, outlined | default, pressed (scale 0.98 tappable için) | radius-lg, card shadow (light) / border (dark) |
| Chip | default, selected | default, selected (primary bg), disabled | Pill shape, 36pt yükseklik |
| Badge | success, warning, danger, neutral, pro | — | Pill shape, küçük (24pt yükseklik) |
| ScoreCircle | success, warning, danger | default, animating (giriş animasyonu) | 120pt çap, kalın ring (6pt), ikon + etiket içinde |
| ProgressBar | default | — | radius-full, 8pt yükseklik, primary renk dolgu |
| Accordion | — | collapsed, expanded | Başlık tappable, içerik animasyonlu açılır |
| Divider | — | — | 1pt, border renk |
| WarningBanner | danger, warning | — | danger/warningLight bg, sol kenar 4pt accent, radius-md |
| EmptyState | — | — | İkon (48pt) + başlık + açıklama + CTA butonu |
| ErrorState | — | — | Hata ikonu + başlık + açıklama + "Tekrar dene" butonu |
| LoadingState | skeleton, spinner | — | Skeleton: 3 kart, nabız animasyonu. Spinner: primary renk |
| Avatar | — | — | Dairesel, baş harfler, primary bg |

### Kompozit bileşenler (`src/components/`)

| Bileşen | Konum | İçerdiği atomikler |
|---------|-------|-------------------|
| OnboardingSlider | components/ | Lottie illüstrasyon + display metin + body metin + dot pagination + Button |
| SocialAuthButton | components/ | Google/Apple ikon + label, secondary varyant |
| ScannerOverlay | components/ | Kamera çerçeve köşebentleri + quota badge + flash/foto butonları |
| IngredientRow | components/ | Risk ikonu + madde adı + fonksiyon + Accordion |
| HistoryCard | components/ | Card + Badge + ürün adı + tarih |
| AudienceSelector | components/ | Chip gridi (multi-select) |
| PricingCard | components/ | Card + fiyat display + özellik listesi + Button |
| QuotaBadge | components/ | Badge + ProgressBar |
| TabBar | components/ | Özel floating tab bar, radius-xl, kayan aktif gösterge |

## 6. Ekranlar

### 6.1 Splash

expo-splash-screen ile statik. Kod gerektirmez.

- **Arka plan:** primary `#0F766E`
- **İkon:** Beyaz uygulama logosu (büyüteç + yaprak motifi), ortalanmış
- **Davranış:** Fontlar ve auth durumu yüklenene kadar gösterilir

---

### 6.2 Onboarding — `app/(onboarding)/index.tsx`

```
+----------------------------------+
|                           [Atla] |
|                                  |
|        +-----------------+       |
|        |                 |       |
|        |   Lottie anim.  |       |
|        |   (200x200)     |       |
|        |                 |       |
|        +-----------------+       |
|                                  |
|  Okut ya da Fotoğrafla           |
|  Barkodu tarat veya içindekiler  |
|  etiketinin fotoğrafını çek,     |
|  gerisini bize bırak.            |
|                                  |
|         o  .  .  .               |
|                                  |
|  [====== Devam Et ======]        |
|                                  |
+----------------------------------+
```

**Bölgeler:**
1. Üst sağ: "Atla" ghost butonu (son slayt hariç)
2. Orta: Lottie animasyonlu illüstrasyon (tasarım diline uygun flat/geometrik stil, teal + fildişi palet)
3. Başlık: display stil
4. Açıklama: body stil, textSecondary renk
5. Pagination: 4 dot, aktif = primary, pasif = border
6. Alt: Devam (slayt 1-3), Başla (slayt 4) — primary buton, tam genişlik

**4 Slayt içeriği:**
1. "Okut ya da Fotoğrafla" — telefon + barkod + tarama çizgisi Lottie
2. "Tek Renkte Anla" — trafik lambası (3 daire: yeşil/sarı/kırmızı) Lottie
3. "Sana Özel Uyarı" — kalkan + kullanıcı profil ikonu Lottie
4. "Ayda 5 Ücretsiz, Pro Sınırsız" — karşılaştırma (free vs pro) Lottie, son slayt

**Slayt 4 özel:** "Başla" butonu + altında küçük "Hesabınız var mı? Giriş yapın" linki

**Durumlar:** Boş/hata/yükleniyor yok (statik içerik)

**Etkileşim:** Yatay swipe + dot pagination. Parallax efekti: illüstrasyon 0.7x hızda kayar.

---

### 6.3 Login — `app/(auth)/login.tsx`

```
+----------------------------------+
|           [x]                    |
|                                  |
|  Hoş Geldiniz                    |
|  Hesabınıza giriş yapın veya     |
|  yeni hesap oluşturun.           |
|                                  |
|  +----------------------------+  |
|  | E-posta adresiniz          |  |
|  +----------------------------+  |
|                                  |
|  [=== Kod Gönder =============]  |
|                                  |
|  ----------- veya -----------    |
|                                  |
|  [ G  Google ile devam et    ]   |
|  [ A  Apple ile devam et     ]   |
|                                  |
|                                  |
|                                  |
|  Devam ederek KVKK Aydınlatma   |
|  Metni ve Kullanım Şartları'nı  |
|  kabul etmiş olursunuz.          |
+----------------------------------+
```

**Bölgeler:**
1. Header: Kapat butonu (onboarding'den geldiyse görünmez)
2. Başlık bölümü: title + body açıklama
3. E-posta input: Input (email type, autoComplete email)
4. CTA: "Kod Gönder" primary buton, tam genişlik
5. Ayırıcı: "veya" çizgili ayırıcı
6. Sosyal butonlar: Google (secondary, ikon + metin), Apple (secondary, ikon + metin). Apple yalnızca iOS.
7. Yasal: caption stil, KVKK ve Kullanım Şartları tappable link'ler (primary renk)

**Durumlar:**
- Default: Form boş
- Loading: Buton loading spinner gösterir
- Error: Input error state + hata mesajı ("Geçersiz e-posta adresi")
- Keyboard açık: İçerik yukarı kayar (KeyboardAvoidingView)

**Etkileşim:** Kod Gönder tap → VerifyOTP'ye push. Sosyal buton tap → doğrudan auth, başarılı ise Tabs'a.

---

### 6.4 Verify OTP — `app/(auth)/verify-otp.tsx`

```
+----------------------------------+
| <                                |
|                                  |
|  Doğrulama Kodu                  |
|  ornek@mail.com adresine         |
|  gönderilen 6 haneli kodu girin. |
|                                  |
|  +----+----+----+----+----+----+ |
|  |    |    |    |    |    |    | |
|  +----+----+----+----+----+----+ |
|                                  |
|         02:47 kaldı              |
|                                  |
|    Kod gelmediyse:               |
|    [Tekrar gönder]               |
|                                  |
+----------------------------------+
```

**Bölgeler:**
1. Header: Geri butonu
2. Başlık: title + body (e-posta adresi vurgulu)
3. OTP girişi: 6 ayrı kutu, otomatik ilerleme, yapıştırma desteği
4. Geri sayım: caption stil, tabular-nums
5. Tekrar gönder: Ghost buton, geri sayım bitince aktif

**Durumlar:**
- Default: Kutular boş, geri sayım başlar (3:00)
- Dolu: 6 hane girildi, otomatik doğrulama başlar
- Loading: Kutular disabled, spinner
- Error: Kutular danger border, "Hatalı kod, tekrar deneyin" mesajı, kutular temizlenir
- Tekrar gönder: Geri sayım bitti, buton aktif; tıklanınca yeni geri sayım başlar

**Etkileşim:** Her hane girildiğinde sonraki kutuya focus. 6. hanede otomatik submit. Backspace önceki kutuya döner.

---

### 6.5 Scanner (Home) — `app/(tabs)/index.tsx`

```
+----------------------------------+
| İçinde Ne Var?        [3/5] [P]  |
|================================= |
|                                  |
| +------------------------------+ |
| |                              | |
| |   /---------\               | |
| |   |         |               | |
| |   | KAMERA  |    tarama     | |
| |   | GÖRÜNÜMÜ|    alanı      | |
| |   |         |               | |
| |   \---------/               | |
| |                              | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | Barkodu çerçeve içine alın   | |
| | veya etiketi fotoğraflayın.  | |
| |                              | |
| |  (flash)    [O]    (galeri)  | |
| +------------------------------+ |
|                                  |
|  [tarama]   [geçmiş]  [profil]  |
+----------------------------------+
```

**Bölgeler:**
1. Header (yarı saydam): Uygulama adı (title), kota badge (ör. "3/5" pill), Pro badge (varsa)
2. Kamera alanı: Tam genişlik, radius-lg, içinde tarama çerçevesi (köşebentler, teal renk)
3. Kontrol paneli: Açıklama metni (body, center), flash toggle (IconButton), foto çekme butonu (büyük dairesel, 64pt, primary), galeri butonu (IconButton)
4. Tab bar: Floating pill tab bar, 3 tab (Tara/Geçmiş/Profil)

**Özel detaylar:**
- Tarama çerçevesi: 4 köşebent (sol üst, sağ üst, sol alt, sağ alt), her biri 24pt, 3pt kalınlık, primary renk. Nabız animasyonu (opacity 0.6 → 1.0, 1.5s, tekrar)
- Kota badge: Pill shape, surface bg, ör. "3/5" veya "PRO" (sınırsız). Eğer kota 1 kaldıysa warningLight bg, 0 ise dangerLight bg
- Foto butonu: 64pt dairesel, primary bg, beyaz kamera ikonu. Pressed: scale 0.96 + opacity 0.9

**Durumlar:**
- Default: Kamera aktif, barkod taranmayı bekliyor
- Barkod algılandı: Çerçeve primary renk flash + haptic + otomatik analiz başlat
- Kota doldu: Foto butonu disabled, "Kotanız doldu" banner gösterilir + "Pro'ya Yükselt" butonu
- Kamera izni yok: Tam ekran EmptyState — kamera ikonu + "Kamera izni gerekli" + "İzin Ver" butonu
- Loading (analiz): Foto butonunun üzerinde loading spinner, kamera durur

**Etkileşim:**
- Barkod tarayınca → doğrudan AnalysisResult'a (önbellekte varsa) veya loading → AnalysisResult
- Foto çek → IngredientConfirm'e push
- Galeri → expo-image-picker → IngredientConfirm'e push
- Kota badge tap → Profile ekranına

---

### 6.6 Ingredient Confirm — `app/ingredient-confirm.tsx`

```
+----------------------------------+
| < İçeriği Onayla                 |
|                                  |
| +------------------------------+ |
| |  [fotoğraf önizleme, küçük]  | |
| +------------------------------+ |
|                                  |
| Çıkarılan İçerikler (14)        |
|                                  |
| +------------------------------+ |
| | Sodyum benzoat            [x]| |
| +------------------------------+ |
| | Sitrik asit               [x]| |
| +------------------------------+ |
| | Potasyum sorbat           [x]| |
| +------------------------------+ |
| | Şeker                     [x]| |
| +------------------------------+ |
| | ...                          | |
| +------------------------------+ |
|                                  |
| [+ Madde ekle]                   |
|                                  |
| [====== Analiz Et ===========]   |
+----------------------------------+
```

**Bölgeler:**
1. Header: Geri butonu + başlık
2. Fotoğraf önizleme: Küçük thumbnail (radius-md, 80pt yükseklik), içindekiler etiketinin kırpılmış görünümü
3. Liste başlığı: title + sayı badge
4. Madde listesi: Her satır — madde adı (body) + silme butonu (x, ghost IconButton). Düzenleme için satıra tap.
5. Madde ekle: Ghost buton, `+` ikonu
6. CTA: "Analiz Et" primary buton, tam genişlik, sticky bottom (safe area uyumlu)

**Durumlar:**
- Default: Liste OCR'dan gelen maddelerle dolu
- Düzenleme: Satıra tap → inline edit (input'a dönüşür)
- Loading: Buton loading state, liste disabled
- Boş: "İçerik çıkarılmadı" mesajı + "Elle ekleyin" CTA
- Error: "Fotoğraf okunamadı. Daha net bir fotoğraf çekmeyi deneyin." ErrorState

**Etkileşim:** Analiz Et → loading → AnalysisResult'a push. Silme animasyonu: satır sola kayarak kapanır (150ms).

---

### 6.7 Analysis Result — `app/analysis/[id].tsx`

```
+----------------------------------+
| < Sonuç                (paylaşım)|
|                                  |
| +------------------------------+ |
| | ! Hamile profili için         | |
| |   2 sakıncalı madde          | |
| +------------------------------+ |
|                                  |
|        +----------+              |
|        |   (!)    |              |
|        |  Dikkat  |              |
|        +----------+              |
|                                  |
| Ülker Çikolata Gofreti           |
| Gıda — 8690504012345             |
|                                  |
| +------------------------------+ |
| | Bu ürün genel olarak dikkat  | |
| | gerektiren bir içeriğe sahip.| |
| | Özellikle sodyum benzoat ve  | |
| | şeker oranı yüksek...        | |
| +------------------------------+ |
|                                  |
| Maddeler (12)                    |
| +------------------------------+ |
| | ! Sodyum benzoat      Dikkat | |
| |   E211 — Koruyucu            | |
| |   > Hamileler için...   [v]  | |
| +------------------------------+ |
| | ✓ Şeker              Güvenli | |
| |   Tatlandırıcı               | |
| +------------------------------+ |
| | ✗ Aspartam          Sakıncalı| |
| |   Yapay tatlandırıcı         | |
| +------------------------------+ |
| | ...                          | |
| +------------------------------+ |
|                                  |
| +------------------------------+ |
| | (i) Bilinmeyen: 2 madde     | |
| |   Polisorbat 80, BHT         | |
| +------------------------------+ |
|                                  |
| Bu sonuç tıbbi tavsiye değildir. |
| Kesin bilgi için uzmanınıza      |
| danışınız.                       |
+----------------------------------+
```

**Bölgeler:**
1. Header: Geri butonu + "Sonuç" + paylaşım IconButton (gelecek sürüm için hazırlık, MVP'de gizli)
2. Profil uyarı banner'ları: WarningBanner (kırmızı: sakıncalı, sarı: dikkat). Her banner: ikon + kitle adı + madde sayısı
3. Skor dairesi: ScoreCircle (120pt), ortalı. Renk: success/warning/danger. İkon: checkmark/alert/x. Alt etiket: "Güvenli"/"Dikkat"/"Sakıncalı"
4. Ürün bilgisi: Ürün adı (title), kategori + barkod (caption, textSecondary)
5. Açıklama kartı: Card içinde body metin, Claude'dan gelen 3-4 cümle
6. Madde listesi: Başlık (title + sayı). Her madde: IngredientRow — sol ikon (risk rengi), madde adı (body), risk badge, açılır detay (Accordion). Detayda: INCI adı, işlev, kitle uyarısı
7. Bilinmeyenler kutusu: surfaceSecondary bg, info ikonu, bilinmeyen madde isimleri
8. Disclaimer: caption, textSecondary, italik

**Skor dairesi detay:**
- 120pt çap, 6pt kalınlık ring
- Renk gradyan: success/warning/danger üzerinde hafif gradient (üst: açık, alt: koyu)
- İçeride: Büyük ikon (32pt) + etiket (label stil)
- Giriş animasyonu: Ring çizilme (0 → 360 derece, 600ms, Easing.bezier(0.2, 0, 0, 1))

**Durumlar:**
- Default: Tam sonuç kartı
- Loading: Skeleton — büyük daire + 3 kart skeleton, nabız animasyonu
- Error: ErrorState — "Analiz sırasında bir sorun oluştu. Tekrar deneyin."
- Profil uyarısı yok: Banner bölümü gizli
- Bilinmeyen madde yok: Kutu gizli

**Etkileşim:**
- Accordion tap: İçeriği fade+slide ile açar/kapar (200ms)
- Uyarı banner tap: İlgili maddeye scroll
- Geri: Scanner'a pop

---

### 6.8 History — `app/(tabs)/history.tsx`

```
+----------------------------------+
| Geçmiş                           |
|                                  |
| +------------------------------+ |
| | ✓ Ülker Çikolata       Yeşil | |
| |   Gıda — 3 Kas 2026         | |
| +------------------------------+ |
| | ! Nivea Krem            Sarı | |
| |   Kozmetik — 2 Kas 2026     | |
| +------------------------------+ |
| | ✗ Cif Sprey           Kırmızı| |
| |   Temizlik — 1 Kas 2026     | |
| +------------------------------+ |
| | ✓ Eti Cicibebe          Yeşil| |
| |   Gıda — 31 Eki 2026        | |
| +------------------------------+ |
|                                  |
|  [tarama]   [geçmiş]  [profil]  |
+----------------------------------+
```

**Bölgeler:**
1. Header: "Geçmiş" title (sol hizalı)
2. Liste: FlashList, HistoryCard bileşenleri. Her kart: Card içinde — sol: risk ikonu (renk kodlu) + ürün adı (body) + kategori + tarih (caption). Sağ: skor badge (pill, risk rengi bg + beyaz metin)
3. Tab bar: Floating pill

**HistoryCard detay:**
- Card, tappable (pressed: scale 0.98)
- Sol: 40pt dairesel ikon (risk rengi bg + beyaz ikon)
- Orta: Ürün adı (body, tek satır truncate) + "Gıda — 3 Kas 2026" (caption, textSecondary)
- Sağ: Badge (label stil, risk rengi bg + beyaz metin, ör. "Güvenli")

**Durumlar:**
- Default: Liste dolu
- Boş: EmptyState — tarama ikonu + "Henüz tarama yapmadınız" + "İlk ürününü tara" body + "Tara" primary buton
- Loading: 4 skeleton kart, nabız animasyonu
- Error: ErrorState + "Tekrar dene" butonu

**Etkileşim:** Kart tap → AnalysisResult'a push. Liste pull-to-refresh.

---

### 6.9 Profile — `app/(tabs)/profile.tsx`

```
+----------------------------------+
| Profil                     (gear)|
|                                  |
| +------------------------------+ |
| |  (MK)  Mert Kursun           | |
| |         ornek@mail.com       | |
| |         [PRO]                | |
| +------------------------------+ |
|                                  |
| Kitle Seçimi                     |
| Sana özel uyarılar için seç.    |
|                                  |
| [Bebek] [Hamile] [Hassas cilt]  |
| [Glüten] [Laktoz] [Fıstık]     |
| [Vegan] [Diyabet]              |
|                                  |
| Kota                             |
| +------------------------------+ |
| | Bu ay: 3 / 5 tarama          | |
| | [====........]  %60           | |
| | [Pro'ya Yükselt]              | |
| +------------------------------+ |
|                                  |
|  [tarama]   [geçmiş]  [profil]  |
+----------------------------------+
```

**Bölgeler:**
1. Header: "Profil" title + ayarlar IconButton (gear ikonu, sağ üst)
2. Kullanıcı kartı: Card — Avatar (baş harfler, primary bg) + isim (title) + e-posta (caption) + Pro badge (varsa)
3. Kitle seçimi: Başlık (title) + açıklama (caption). AudienceSelector: Chip gridi (FlexWrap), multi-select. Her chip emoji + etiket: "Bebek", "Hamile", "Hassas cilt", "Glüten alerjisi", "Laktoz intoleransı", "Fıstık alerjisi", "Vegan", "Diyabet"
4. Kota bölümü: Card — başlık + ProgressBar + sayı metni (caption) + "Pro'ya Yükselt" secondary buton (Pro kullanıcıda gizli)

**Chip emojileri:**
- Bebek: baby face
- Hamile: pregnant
- Hassas cilt: hand
- Glüten: wheat
- Laktoz: milk
- Fıstık: peanut
- Vegan: leaf
- Diyabet: drop

**Durumlar:**
- Default: Profil bilgileri ve chip'ler
- Chip seçimi: Seçilen chip primary bg + primaryForeground metin, spring animasyonu (scale 1.0 → 1.05 → 1.0, 200ms)
- Pro kullanıcı: Pro badge görünür, kota yerine "Sınırsız tarama" mesajı
- Loading: Skeleton profil kartı + chip placeholder
- Kaydetme: Chip seçimi değiştiğinde otomatik kayıt, kısa başarı toast ("Profil güncellendi")

**Etkileşim:** Chip toggle → anında seçim + Supabase'e kayıt. Ayarlar ikonu → Settings push.

---

### 6.10 Settings — `app/settings.tsx`

```
+----------------------------------+
| < Ayarlar                        |
|                                  |
| GENEL                            |
| +------------------------------+ |
| | Onboarding'i tekrar izle   > | |
| +------------------------------+ |
|                                  |
| ABONELİK                         |
| +------------------------------+ |
| | Abonelik yönetimi           > | |
| +------------------------------+ |
| | Satın almaları geri yükle   > | |
| +------------------------------+ |
|                                  |
| YASAL                            |
| +------------------------------+ |
| | KVKK Aydınlatma Metni      > | |
| +------------------------------+ |
| | Kullanım Şartları           > | |
| +------------------------------+ |
|                                  |
| HESAP                            |
| +------------------------------+ |
| | [Çıkış Yap]                  | |
| +------------------------------+ |
|                                  |
|      İçinde Ne Var? v1.0.0       |
|         Yapım: 2026              |
+----------------------------------+
```

**Bölgeler:**
1. Header: Geri butonu + "Ayarlar" title
2. Bölüm grupları: Her bölüm bir başlık (caption, UPPERCASE, textSecondary) + Card içinde satırlar
3. Satır: Body metin + sağ ok ikonu (`chevron-right`), tappable, pressed: bg surfaceSecondary
4. Çıkış yap: Ayrı Card, danger renk metin, ortalanmış
5. Sürüm bilgisi: caption, textSecondary, ortalanmış

**Durumlar:**
- Default: Tüm satırlar aktif
- Çıkış onay: Alert dialog — "Çıkış yapmak istiyor musunuz?" + "Çıkış Yap" (danger) + "Vazgeç" (ghost)

**Etkileşim:** Satırlar ilgili ekranlara push. Çıkış → onay → auth temizle → Login'e replace.

---

### 6.11 Paywall — `app/paywall.tsx`

```
+----------------------------------+
| [x]                              |
|                                  |
|   (crown/star)                   |
|   Pro'ya Yükselt                 |
|   Sınırsız tarama, öncelikli    |
|   destek ve daha fazlası.       |
|                                  |
| +------------------------------+ |
| |  69 TL / ay                  | |
| |                              | |
| |  ✓ Sınırsız ürün taraması   | |
| |  ✓ Öncelikli analiz hızı     | |
| |  ✓ Reklamsız deneyim         | |
| |  ✓ Detaylı madde raporları   | |
| |                              | |
| +------------------------------+ |
|                                  |
| [=== Pro'ya Başla ============]  |
|                                  |
| [Satın almaları geri yükle]      |
|                                  |
| Abonelik her ay otomatik yenile- |
| nir. İstediğiniz zaman iptal     |
| edebilirsiniz. KVKK | Şartlar   |
+----------------------------------+
```

**Bölgeler:**
1. Header: Kapat butonu (x, sağ veya sol üst)
2. Hero: Taç/yıldız ikonu (48pt, primary renk) + başlık (display) + açıklama (body, textSecondary)
3. Fiyat kartı: PricingCard — büyük fiyat gösterimi (display) + "/ay" (caption). Özellik listesi: her satır checkmark ikonu (primary) + metin (body)
4. CTA: "Pro'ya Başla" primary buton, tam genişlik, büyük (56pt yükseklik)
5. Geri yükle: Ghost buton, caption stil
6. Yasal: caption, textSecondary. KVKK ve Şartlar tappable linkler

**Durumlar:**
- Default: Fiyat yüklendi (RevenueCat'ten)
- Fiyat yükleniyor: Fiyat yerine skeleton, CTA disabled
- Satın alma işleniyor: CTA loading state
- Başarılı: Onay animasyonu (checkmark scale-in + confetti?) + "Hoş geldiniz!" mesajı + otomatik kapanış (2s)
- Hata: "Satın alma tamamlanamadı. Tekrar deneyin." toast

**Etkileşim:** CTA tap → RevenueCat satın alma akışı. Geri yükle → RevenueCat restore. Kapat → dismiss modal.

---

### 6.12 Privacy Policy — `app/legal/privacy.tsx`

```
+----------------------------------+
| < KVKK Aydınlatma Metni         |
|                                  |
| +------------------------------+ |
| |                              | |
| | KVKK kapsamında kişisel      | |
| | verilerinizin işlenmesine    | |
| | ilişkin aydınlatma metni.    | |
| |                              | |
| | 1. Veri Sorumlusu            | |
| | ...                          | |
| |                              | |
| | 2. İşlenen Kişisel Veriler  | |
| | ...                          | |
| |                              | |
| +------------------------------+ |
+----------------------------------+
```

**Bölgeler:**
1. Header: Geri butonu + başlık (title)
2. İçerik: ScrollView, Markdown formatlı metin. body stil, başlıklar title stil.

**Durumlar:** Sadece default (statik içerik).

---

### 6.13 Terms of Use — `app/legal/terms.tsx`

Privacy Policy ile aynı yapıyı paylaşır. Başlık: "Kullanım Şartları".

---

### Floating Tab Bar detay

Tab bar, alt kenardan 16pt yukarıda, yatayda 16pt margin ile konumlanır. Pill şeklinde (radius-xl 28pt), surface bg, card shadow (light) / border (dark).

3 tab:
- Tara: tarama ikonu (viewfinder) + "Tara"
- Geçmiş: saat ikonu (clock) + "Geçmiş"
- Profil: kullanıcı ikonu (user) + "Profil"

Aktif tab göstergesi: primary bg pill, ikon + metin primaryForeground renk. Pasif: ikon + metin textSecondary. Gösterge tab'lar arası spring animasyonuyla kayar.

Tab bar boyutları: ~56pt yükseklik, her tab ~100pt genişlik.

## 7. Hareket

### Genel ilkeler
- Hız: Etkileşimler hızlı (150ms), girişler orta (300ms), çıkışlar kısa (150ms)
- Easing: Girişler `Easing.bezier(0.2, 0, 0, 1)` (decelerate), basılma `Easing.out(Easing.ease)`
- Hareket azaltma: `AccessibilityInfo.isReduceMotionEnabled()` dinlenir; aktifse animasyonlar opacity cross-fade'e döner veya atlanır

### Animasyon envanteri

| Olay | Animasyon | Süre | Easing | Reanimated |
|------|-----------|------|--------|------------|
| Ekran girişi | Slide right + fade | 300ms | bezier(0.2,0,0,1) | Expo Router native stack |
| Modal açılış | Slide up + fade | 300ms | bezier(0.2,0,0,1) | Native modal presentation |
| Buton press | scale 0.96 + opacity 0.9 | 150ms | ease-out | `useAnimatedStyle` + `withTiming` |
| Tappable card press | scale 0.98 | 150ms | ease-out | `useAnimatedStyle` + `withTiming` |
| Chip toggle | scale 1.0→1.05→1.0 | 200ms | spring (damping 15) | `withSpring` |
| Tab gösterge kayması | translateX | — | spring (damping 20, stiffness 200) | `withSpring` |
| Skor dairesi girişi | Ring çizilme (strokeDashoffset) | 600ms | bezier(0.2,0,0,1) | `withTiming` + SVG animated |
| Skor ikon girişi | scale 0→1 + fade | 300ms | spring (damping 12) | `withSpring`, 200ms delay |
| Liste öğesi girişi | fade + translateY(12) | 300ms | bezier(0.2,0,0,1) | `entering={FadeInDown.duration(300).delay(index*80)}` |
| Liste öğesi çıkışı | fade + translateY(-12) | 150ms | ease-out | `exiting={FadeOutUp.duration(150)}` |
| Accordion aç/kapa | height + fade | 200ms | bezier(0.2,0,0,1) | `useAnimatedStyle` + `withTiming` |
| Onboarding swipe | Horizontal slide + parallax (0.7x) | gesture-driven | spring | `react-native-gesture-handler` + `withSpring` |
| Tarama çerçevesi | Köşebent opacity pulsing | 1500ms | ease-in-out, repeat | `withRepeat(withTiming(...))` |
| Skeleton nabız | opacity 0.3→0.7→0.3 | 1200ms | ease-in-out, repeat | `withRepeat(withSequence(...))` |
| Pull-to-refresh | Native ScrollView refresh | Native | Native | `RefreshControl` |
| Profil uyarı banner | fade + slide down | 300ms | bezier(0.2,0,0,1) | `entering={FadeInDown}` |
| Toast | slide up + fade, 3s bekleme, slide down + fade | 300ms in, 150ms out | ease-out | `withTiming` |

### İlk render kuralı
Durum değişimini gösteren animasyonlar (tab içeriği, skor rengi) ilk render'da animasyon çalıştırmaz. `initialState` false şeklinde Reanimated config.

## 8. Öneriler (PRD dışında)

1. **Arama / filtre (Geçmiş ekranı):** Geçmiş listesi büyüdüğünde arama çubuğu ve kategori filtresi (gıda/kozmetik/temizlik) faydalı olur.
2. **Haptic feedback:** Barkod algılandığında, skor gösterildiğinde ve hata durumlarında `expo-haptics` ile dokunsal geri bildirim.
3. **Skeleton loading tutarlılığı:** Tüm listelerde (geçmiş, maddeler) ve kart alanlarında skeleton loading kullanılması, spinner yerine tercih.
4. **Ürün görseli:** Open Food Facts'tan gelen ürün görseli varsa sonuç kartında gösterilmesi (küçük thumbnail).
