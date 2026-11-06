# Handoff: İçinde Ne Var? — Mobil Uygulama Tasarımı v2

## Overview
Market ürünlerinin (gıda, kozmetik, temizlik) barkodunu okutarak veya içindekiler etiketini fotoğraflayarak içeriği analiz eden, kullanıcı profiline (bebek, hamile, alerji, vegan, diyabet…) göre yeşil/sarı/kırmızı skor veren React Native (Expo) uygulamasının yeni görsel dili ve 13 ekranı.

## About the Design Files
Bu paketteki `Icinde Ne Var — Tasarim v2.dc.html` dosyası **HTML ile yapılmış bir tasarım referansıdır** — üretim kodu değil. Görev: bu tasarımı mevcut **React Native (Expo)** kod tabanında, projenin kendi pattern'leriyle birebir yeniden üretmek. HTML'i kopyalama; ölçüleri, renkleri, tipografiyi ve davranışı bu dokümandan + HTML'deki inline style'lardan al.

Hedef stack (brief'te sabitlenmiş):
- Expo + React Native, `expo-router`
- `lucide-react-native` (ikonlar — tasarımdaki tüm ikonlar Lucide: `Scan`, `History`, `User`, `Camera`, `Zap`, `Image`, `ChevronLeft/Right`, `ArrowRight`, `Check`, `X`, `AlertTriangle`, `Info`, `Settings`, `ShieldCheck`, `Mail`, `Crown`, `Share`, `Sparkles`, `FileText`, `LogOut`, `RotateCcw`, `PlayCircle`, `Bell`, `Search`, `Plus`, `Utensils`, `SprayCan`)
- `expo-linear-gradient` (tüm `primaryGradient` yüzeyler)
- `expo-blur` (glass yüzeyler: tab bar, scanner overlay'leri; Android'de blur zayıfsa yarı saydam dolgu yeterli)
- `react-native-reanimated` (tab geçişi, skor halkası dolumu, scan line, chip seçimi)
- `lottie-react-native` (splash logo animasyonu — storyboard ayrıca üretilecek)
- `react-native-svg` (logo, onboarding illüstrasyonları, skor halkası)
- Google Fonts: `@expo-google-fonts/bricolage-grotesque` + `@expo-google-fonts/plus-jakarta-sans`

## Fidelity
**High-fidelity.** Renkler, tipografi, boşluklar, radius ve gölgeler nihaidir; birebir uygula. HTML'deki her ekran 320×698 px mantıksal çözünürlükte tasarlandı (iPhone 15 Pro ölçeği); RN'de `dp` olarak kullan.

## Design Tokens

### Renkler (light / dark)
| token | light | dark |
|---|---|---|
| primary | #0F9B8E | #2DD4BF |
| primaryDeep | #0B6E66 | #5EEAD4 |
| primaryLight | #2BC4B4 | #5EEAD4 |
| primaryFg (gradient üstü metin) | #FFFFFF | #04302C |
| primaryGradient | linear 135° #19B8A6 → #0E8F84 (55%) → #0B6E66 | #5EEAD4 → #2DD4BF (55%) → #14B8A6 |
| primaryShadow | rgba(11,110,102,.55) | rgba(45,212,191,.45) |
| primaryRing (focus halkası) | rgba(15,155,142,.14) | rgba(45,212,191,.16) |
| background | #F7F5EE | #0A1514 |
| surface | #FFFFFF | #112120 |
| surfaceTint | #E3F3EF | #143230 |
| text | #0F1F1D | #F1F5F3 |
| textSecondary | #4B5B58 | #A4B4B0 |
| muted | #7E8B88 | #6E807C |
| border | #E4E0D5 | #1E3230 |
| success / successBg / successText | #1D9E5F / #DDF4E6 / #146B41 | #3BD98A / #0F2E22 / #7BEDB1 |
| warning / warningBg / warningText | #E39B07 / #FDF0C7 / #7A4F00 | #F5C242 / #352906 / #FBD978 |
| danger / dangerBg / dangerText | #E03E3E / #FDE2E2 / #9B1C1C | #F36B6B / #3A1414 / #FCA5A5 |
| glass / glassBorder | rgba(255,255,255,.74) / rgba(255,255,255,.9) | rgba(17,33,32,.72) / rgba(255,255,255,.08) |
| cameraBg | #0A1413 | #070F0E |
| splashBg | linear 165° #1CB9A7 → #0F8E83 (45%) → #0A5B55 | radial (120% 70% at 50% 0%) #17403A → #0A1514 (65%) |

Kategori renkleri (History tile gradient'leri): Gıda #F2B544→#E39B07 · Kozmetik #F08BC4→#D95BA3 · Temizlik #60A5FA→#3B82F6.

### Gölgeler
- `shadow` (kart): `0 1px 2px rgba(15,31,29,.04), 0 10px 28px -10px rgba(15,31,29,.14)` · dark: `0 1px 2px rgba(0,0,0,.3), 0 12px 32px -12px rgba(0,0,0,.6)`
- `shadowLow` (liste satırı, küçük buton): `0 1px 1px rgba(15,31,29,.03), 0 3px 10px -3px rgba(15,31,29,.08)` · dark: `0 0 0 1px rgba(255,255,255,.03), 0 3px 10px -3px rgba(0,0,0,.45)`
- Primary buton: `0 12px 24px -10px primaryShadow` + üstte `inset 0 1px 0 rgba(255,255,255,.25)` (RN'de gradient üstüne 1px yarı saydam beyaz çizgi)
- Tab bar: `0 18px 40px -16px rgba(0,0,0,.35)`

### Tipografi
- Display: **Bricolage Grotesque** 700/800 — ekran başlıkları 28px/1.1 ls -0.7…-0.8; splash 32px; paywall hero 32px/1.05 ls -0.9; skor rakamı 54px/1 ls -3; kart başlıkları 15–17px/700; history skor 18px/800.
- Body: **Plus Jakarta Sans** — gövde 14px/1.55; ikincil 13px; caption 11–12px/500–600; buton 15px/700; badge 10px/800; section label 11px/800 ls 1px uppercase.

### Radius / spacing
- Ekran yatay padding 18–22px; içerik üst padding 62px (status bar + island altı).
- Kart 20–24px, giriş alanı 18px, küçük ikon kutusu 11–14px, buton/pill 999 (tam kapsül), primary buton yüksekliği 54–58px, ikincil 52px, küçük 48px.
- Boşluk ölçeği: 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 26 / 30.

## Bileşenler (ortak)

**PrimaryButton** — h 54–58, r 999, primaryGradient, primaryFg, 700 15px, gölge yukarıda; basılı: scale .97.
**SecondaryButton** — h 52, surface + 1px border, shadowLow, 600 14px.
**IconButton (back/ayar)** — 40×40, r 14, surface + 1px border, shadowLow, ikon 18px.
**Badge** — pad 3–4×8–10, r 999, 10px/800, status bg + status text renkleri.
**StatusDot** — 30×30, r 10, statusBg; içinde 8px daire status renginde.
**Chip (Kitle)** — 2 sütun grid, gap 8; pad 12 14; r 18; emoji 22px; label 13px/700; sağda 20px yuvarlak check. Seçili: surfaceTint zemin, 1.5px primary border, 3px primaryRing halo, metin primaryDeep. Seçili değil: surface, border, textSecondary. Geçiş 200ms.
**Card** — surface, 1px border, r 20–22, shadow.
**FloatingTabBar** — absolute, left/right 18, bottom 18, h 66, r 33, glass + glassBorder + blur 24; iç padding 6, gap 4. Aktif item: flex 1.5, h 54, r 27, primaryGradient, primaryFg, gölge `0 10px 20px -8px primaryShadow`; pasif: flex 1, renk muted. İkon 20px + label 12px/700. Reanimated: aktif pill 250ms layout animasyonu.
**ScoreCircle** — 168×168. Katmanlar: (1) 14px içeride renkli glow `0 0 50px 10px status+55`; (2) conic ring from -90°, 0→skor% status rengi, kalanı border; (3) ring üstünde gloss (180° beyaz .45 → şeffaf 45% → siyah .12), 14px halka maskesi; (4) iç daire inset 14, surface, `inset 0 3px 10px rgba(0,0,0,.10)`. İçerik: rakam 54px Bricolage 800 + label 12px/800 uppercase ls 1.2, ikisi status renginde. RN: `react-native-svg` Circle strokeDasharray + Reanimated ile 0→skor dolum 900ms easeOut.
**Status bar** — immersive ekranlarda (splash, scanner, paywall) beyaz, diğerlerinde text rengi.

## Screens

### 01 Splash
splashBg tam ekran; dekor: 420px ve 300px ince beyaz halkalar (.12/.1), 260px teal radial glow (pulse 4s). Ortada 132×132 glass tile (r 38, beyaz .14 + border beyaz .28, blur 14) içinde beyaz logo 86px. Altında "İçinde Ne Var?" 32px/800 beyaz, 10px sonra "Ne aldığını bil, ne yediğini seç." 13px/600 beyaz .72. Alt 56px'te "Veritabanı hazırlanıyor" pill (12px spinner). Dokunma/2.2s → Onboarding. Lottie: logo halkası çizilir → yaprak belirir → 3 nokta sırayla düşer.

### 02 Onboarding (4 slayt)
Üstte 4 segment progress (aktif 26×6 primary, geçilen 8×6 primary, kalan border) + sağda "Atla" (13px/700 primary) → Login. Ortada 250px surfaceTint radial blob üstünde 264×250 SVG illüstrasyon (float 5s). Başlık 28px/800 ortalı, gövde 14px textSecondary, 22px boşluk, PrimaryButton (son slaytta "Başlayalım", diğerlerinde "Devam Et" + ArrowRight). Slayt metinleri HTML `SLIDES` sabitinde. İllüstrasyonlar HTML'deki inline SVG'lerden `react-native-svg`'ye birebir taşınır (viewBox 0 0 264 250; `var(--x)` renkleri tema token'ına eşlenir).

### 03 Login
Sağ üstte 280px surfaceTint radial blob. Logo 52px (primary), 22px sonra "Hoş geldin." 30px/800, açıklama 14px. E-posta alanı: label 12px/700, kutu h 54 r 18 surface, 1.5px primary border + 4px primaryRing, Mail ikonu primary, caret animasyonu. "Kod Gönder" PrimaryButton → OTP. "veya" ayraç. Google / Apple SecondaryButton'ları. Altta ShieldCheck + KVKK/Şartlar metni 11px muted (linkler primary 600).

### 04 OTP
Back IconButton. "Kodu gir" 28px/800; e-posta kalın. 6 kutu: flex 1, h 60, r 16; dolu: surfaceTint + 2px primary; aktif: 2px primary + 4px primaryRing + yanıp sönen caret; boş: surface + 2px border. Rakam 24px Bricolage 800. Altında 02:47 pill (surfaceTint, conic mini halka %72). "Doğrula" PrimaryButton → Scanner. "Kod gelmedi mi? Tekrar gönder". En altta güven kartı (ShieldCheck tile 34px surfaceTint; "Şifre saklamıyoruz…").

### 05 Scanner (ana ekran) — immersive
Tam ekran kamera (cameraBg), üst/alt karartma gradient (.45 / .55). Üst 62px: solda marka pill (glass beyaz .10, border .14, blur 16; 22px beyaz logo + "İçinde Ne Var?" 13px Bricolage 700), sağda kota pill (conic 20px halka 3/5 + "3/5" 12px/700) → Paywall. Scan frame 220×220 at (50,170): 4 köşe braketi #5EEAD4 5px round, 18px yay, drop-shadow glow; 30px dışında radial teal glow; scan line 2px gradient + glow, 2.6s aşağı-yukarı. Altında (top 412) ipucu pill "Barkodu ya da etiketi çerçeveye al" (Sparkles ikonu) + "Ne olduğunu otomatik algılarız" 11px beyaz .55. **Mod seçici yok — barkod/etiket otomatik algılanır.** Kontroller (top 506, gap 34): Zap glass 48; deklanşör 76px conic teal halka (4px) → cameraBg 4px → beyaz gradient iç + Scan ikonu primaryDeep, gölge `0 10px 30px -6px rgba(45,212,191,.6)` → İçerik Onayı; Image glass 48. FloatingTabBar (aktif: Tara).

### 06 İçerik Onayı
Header: back / "İçeriği Onayla" 17px / boş. Fotoğraf kartı h 92 r 20 koyu gradient (#243633→#121F1D): sol üstte beyaz satır çizgileri (OCR metni), sağ üstte "Yeniden çek" glass pill, sol altta "OCR güveni %94" #9BF0E3. "Çıkarılan maddeler" 15px + sayı badge (surfaceTint/primaryDeep). Liste kartı (flex 1, kaydırılabilir): satır pad 12 16, 13px/500, sağda X muted, 1px ayraç; sonda "+ Madde ekle" primary 700. "Analiz Et" PrimaryButton (Sparkles) → Sonuç (Dikkat).

### 07 Sonuç (Güvenli 86 / Dikkat 58)
Üstte status renginde bulanık halo (blur 30, .55). Header glass back/"Analiz"/share. Dikkat varyantında profil banner'ı: dangerBg, 1px rgba(224,62,62,.18) border, r 18; 40px danger tile (r 13, AlertTriangle beyaz, gölge), "🤰 Hamile profili için" 13px/800 dangerText, "2 sakıncalı madde · dokun ve gör", sağda chevron. ScoreCircle (yukarıda). Ürün adı 21px/800, altında kategori badge + barkod 11px muted. Özet kartı 13px/1.6 textSecondary. "Maddeler" başlığı + 3 sayaç badge (güvenli/dikkat/sakıncalı). Madde kartı: satır = StatusDot + ad 13px/700 + açıklama 11px muted + Badge; detayı olan maddede altında r 12 background kutu (11px, "Hamile: … · Kaynak: EFSA 2021"). Dikkat varyantında "2 bilinmeyen madde" info kutusu (surfaceTint, Info ikonu). En altta 11px muted yasal uyarı. Tüm içerik ScrollView.

### 08 Geçmiş (+ boş durum)
"Geçmiş" 28px/800 + alt satır "Bu ay 12 tarama · 8 güvenli" 12px muted; sağda Search IconButton. Yatay kaydırılabilir filtre chip'leri: "Tümü" (text zemin, background metin), diğerleri surface + 7px kategori noktası. Liste (gap 10, alt padding 110 — tab bar için): kart r 20 surface border shadowLow; sol kenarda 4px status şeridi; 44px kategori tile (gradient, beyaz Lucide ikon: Utensils / Sparkles / SprayCan); ad 14px/700 tek satır, "Kategori · tarih" 11px muted; sağda skor 18px Bricolage 800 status renginde + Badge. Dokunma → Sonuç. Boş durum: 150px halo + kesikli halka içinde logo (noktalar border renginde), "Henüz tarama yok" 20px/800, açıklama 13px, "İlk taramanı yap" PrimaryButton h 48.

### 09 Profil
"Profil" 28px + Settings IconButton. Hero kart: primaryGradient, r 24, pad 18, dekor halkalar; 58px avatar (3px beyaz gradient ring, iç #0B4F4A, baş harfler #9BF0E3 20px Bricolage), ad 18px/800, e-posta 12px .8, sağda PRO pill (Crown, beyaz .2 zemin, .35 border, 10px/800 ls 1). "Kitle seçimi" 16px + "n seçili" 11px; Chip grid (yukarıda). Kota kartı: 64px conic halka (%60) içinde "3 / 5", "Bu ayki tarama hakkın" 14px/700, açıklama 12px, sağda "Pro" pill (text zemin) → Paywall. Alt padding 110; FloatingTabBar (aktif: Profil).

### 10 Ayarlar
Header back/"Ayarlar". Bölümler (label 11px/800 uppercase muted): Görünüm — 3'lü segment (Açık / Koyu / Sistem; aktif primaryGradient r 12 h 38). Genel — "Tanıtımı tekrar izle" (PlayCircle) → Onboarding; "Bildirimler" + toggle (44×26 primary). Abonelik — "Abonelik yönetimi" (Crown, warningBg tile) + PRO badge → Paywall; "Satın almaları geri yükle" (RotateCcw). Yasal — KVKK (ShieldCheck) / Kullanım Şartları (FileText). Satır: 34px r 11 surfaceTint tile (ikon primaryDeep), 14px/600 metin, chevron muted, pad 13 14. "Çıkış Yap" h 50 r 18 dangerBg/dangerText (LogOut) → Login. Sürüm 11px muted.

### 11 Paywall — immersive
Hero h 300: gradient 170° #0F2E2B → #0B4F4A (55%) → #0F9B8E (140%), teal radial glow + ince halka; sağ üst 36px kapat (beyaz .12) → Profil. İçerik top 104: PRO pill (#FBD36A .18 zemin, .4 border, Crown), "Sınırsız tara, hiç tereddüt etme." 32px/800 beyaz, açıklama 13px beyaz .75. Alt sheet: background, r 28 üst köşeler, -22px üst bindirme. Plan kartları: pad 14 16, r 20, surface; seçili 2px primary + 4px primaryRing + shadow; radio 22px (seçili 7px primary border). Yıllık: "%40 tasarruf" success badge, "499 TL / yıl · aylık 41,58 TL", sağda 499 TL 18px Bricolage; Aylık: 69 TL/ay. 4 özellik satırı (24px surfaceTint check tile, 13px/600). CTA h 58 (sabit, küçülmez) PrimaryButton — metin plana göre "Yıllık Pro'ya Başla — 499 TL" / "Aylık Pro'ya Başla — 69 TL". Alt 11px muted yasal + "Satın almaları geri yükle".

### 12 KVKK · 13 Kullanım Şartları
Header back/başlık 16px. "Son güncelleme: 1 Kas 2026" surfaceTint pill + "5 dk okuma". Kart içinde 5 bölüm: numara 12px Bricolage 800 primary + başlık 14px/700 + paragraf 12px/1.65 textSecondary, 1px ayraçlar. Metinler HTML `LEGAL` sabitinde.

## Logo
`react-native-svg`, viewBox 0 0 120 120:
- Halka: circle (50,50) r 31, stroke 10 — light: gradient #2BC4B4→#0B6E66; teal/ikon zemin: beyaz; dark: #5EEAD4→#14B8A6.
- Sap: path M74 74 L99 99, stroke 13, round.
- Yaprak: `M50 26 C63 30 69 43 64 55 C53 57 41 50 41 37 C43 31 46 27 50 26 Z` (primary / #9BF0E3 / #2DD4BF) + orta damar `M46 50 C52 44 58 38 62 32` stroke 2.5 zemin renginde.
- 3 nokta r 4.5: (37,61) success · (50,65) warning · (63,61) danger.
- App ikonu: squircle gradient 160° #22C9B7 → #0F9B8E (45%) → #0A5B55, üstte beyaz radial highlight .35, beyaz logo %66 boyut. Adaptive icon arka planı #0F9B8E.

## Interactions & Navigation
Splash → Onboarding(0..3) → Login → OTP → Scanner (tabs: Scanner / History / Profile). Scanner deklanşör → Confirm → Result. History kart → Result. Profile ⚙ → Settings → Privacy/Terms/Onboarding/Paywall/Login. Kota pill ve "Pro" → Paywall (modal). Animasyonlar: buton basılı scale .97 120ms; tab pill 250ms; chip 200ms; skor halkası 900ms easeOut; scan line 2.6s loop; splash glow pulse 4s; onboarding illüstrasyon float 5s.

## State
`theme: 'light'|'dark'|'system'`, `profiles: Set<ChipId>` (başlangıç: baby, preg, vegan), `quota: {used:3, limit:5, renewsAt}`, `isPro`, `plan: 'yearly'|'monthly'`, `history: Scan[]`, `result: {score, status:'ok'|'wa'|'no', product, category, barcode, summary, items[{name, meta, status, detail?}], banners[]}`, onboarding `slideIndex`.

## Screenshots
`screenshots/` klasöründe her ekranın light + dark yan yana 2x görüntüsü (`01-splash.png` … `13-kullanim-sartlari.png`), ayrıca `00-logo.png` ve `00-tokens.png`. Görsel karşılaştırma için kullan; kesin ölçüler HTML'den.

## Splash Animasyonu
Referans: `splash-animation/Splash Animasyonu.dc.html` (tarayıcıda aç; zaman çizelgesiyle kare kare izle). Tüm değerler `splash-animation/splash-anim.jsx` içinde — **Reanimated + react-native-svg ile birebir uygula** (Lottie dosyası yok; gerekirse aynı zamanlamayla AE'de kurulur). Toplam 5.7 s, sonunda onboarding'e fade.

Sahneler (başlangıç → süre):
- **Halka** 0.00 → 1.1 s: cam kare opacity 0→1 (0.35 s, easeOutCubic) ve scale 0.7→1 (0.7 s, easeOutBack); halka `strokeDashoffset` tam→0 (0.15–0.95 s, easeInOutCubic, -90° başlangıç); sap 0.75–1.25 s çizilir.
- **Yaprak** 1.10 → 0.8 s: yaprak (44,52) noktasından scale 0→1 (1.15–1.75 s, easeOutBack); damar 1.45–1.85 s çizilir.
- **Noktalar** 1.90 → 0.9 s: yeşil/sarı/kırmızı sırayla 0.14 s arayla; translateY -34→0 (0.5 s, easeOutBack), opacity 0→1 (0.15 s), dikey squash 1.25→1 (0.3–0.55 s).
- **Isim** 2.80 → 1.1 s: başlık translateY 28→0 + opacity (0.7 s / 0.5 s, easeOutCubic); slogan 0.2 s gecikmeyle 20→0.
- **Bekle** 3.90 → 1.2 s: glow `1 + 0.06·sin(1.7·t)` nefes; tüm grup Isim'den itibaren -26 px yukarı sürüklenir.
- **Cikis** 5.10 → 0.6 s: tüm içerik opacity 1→0 (0.55 s), zemin kalır → onboarding'e geç.

Ölçüler 1080×1920 sahneye göre (320 px genişlikte ÷3.375): cam kare 445 → 132 px, r 128 → 38; logo 290 → 86 px; başlık 104 → 31 px Bricolage 800 ls -3 → -0.9; slogan 42 → 12.5 px Plus Jakarta 600; dekor halkalar 1400/1000 px scale 0.86→1 (1.6 s). Renkler README token'larından (light: splashBg gradient, beyaz halka, yaprak #9BF0E3, noktalar #6EE7A8/#FBD36A/#FF8A8A; dark: splashBg radial, halka #5EEAD4, yaprak #2DD4BF, noktalar #3BD98A/#F5C242/#F36B6B). Sap çizilmeye başlamadan önce `opacity 0` (round cap noktası görünmesin).

## Files
- `Icinde Ne Var — Tasarim v2.dc.html` — tüm ekranlar (light + dark), logo varyantları, token tablosu, tıklanabilir akış. Her ekranın kesin stilleri inline `style` attribute'larında; renk/metin sabitleri dosyanın sonundaki script'te (`LIGHT`, `DARK`, `SLIDES`, `CHIPS`, `HIST`, `RESULTS`, `LEGAL`).
- `support.js` — önizleme runtime'ı (uygulamayla ilgisi yok, HTML'in açılması için gerekli).
