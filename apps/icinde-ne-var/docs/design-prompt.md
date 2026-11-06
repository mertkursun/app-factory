# İçinde Ne Var? — Tasarım İyileştirme Promptu

Aşağıdaki promptu Claude'a (claude.ai) yapıştır. Mevcut design-preview.html'i de aynı konuşmaya ekle.

---

## Prompt

Sen bir mobil uygulama UI/UX tasarımcısısın. "İçinde Ne Var?" adında bir React Native (Expo) uygulamasının tasarımını iyileştirmeni istiyorum.

### Uygulama nedir?
Market ürünlerinin (gıda, kozmetik, temizlik) barkodunu okutarak veya içindekiler etiketinin fotoğrafını çekerek içeriği analiz eden bir uygulama. Kullanıcı profiline göre (bebek, hamile, alerji, vegan, diyabet vb.) kişiselleştirilmiş uyarı verir. Sonuçlar yeşil/sarı/kırmızı skor kartı olarak gösterilir.

### Hedef kitle
Ebeveynler, hamileler, alerji hastaları, sağlıklı yaşam meraklıları. Türkiye pazarı.

### Mevcut durum
Ekte mevcut tasarım önizleme HTML'ini paylaşıyorum. Bu tasarım fonksiyonel ama **görsel olarak sıradan ve akılda kalmıyor.** Varsayılan "bootstrap hissi" var.

### İsteklerim

#### 1. Genel Tasarım Dili
- Mevcut teal + fildişi renk paleti iyi ama **daha cesur, daha karakterli** olabilir
- Kartlar, butonlar, badge'ler daha **premium ve cilalı** görünmeli
- Glassmorphism, subtle gradient'ler, micro-shadow katmanları gibi modern teknikler kullan
- **Organik kapsül/pill** formu kalsın ama daha refined olsun
- Boşluk ve hiyerarşi daha belirgin olsun

#### 2. Logo / App İkon
Mevcut logo (büyüteç + yaprak + 3 skor noktası) kavramı iyi ama **çok basit ve ham SVG gibi duruyor.** Yeni logo:
- **Daha ikonik ve tanınabilir** olmalı — tek bakışta hatırlanacak
- Büyüteç + organik/doğa teması korunsun ama daha stilize edilsin
- Yaprak yerine veya ek olarak **kalkan/güvenlik** hissi veren bir element düşünülebilir (kullanıcıyı koruyan uygulama)
- 3 renk noktası (yeşil/sarı/kırmızı) logonun DNA'sı — korunsun ama daha zarif entegre edilsin
- App Store ikonu olarak da güçlü durmalı (küçük boyutta okunabilir)
- Gradient kullanılabilir
- 4 varyant göster: beyaz zemin, teal zemin, koyu zemin, App Store ikonu

#### 3. Ekranlar (öncelik sırasıyla)
Her ekranı iPhone frame içinde göster, light + dark mode yan yana:

**a) Splash Screen** — Çok önemli, ilk izlenim. Logo animasyonunun son karesi gibi düşün. Premium his.

**b) Onboarding (4 slayt)** — Her slayt için özgün illüstrasyon (SVG). Mevcut SVG'ler çok basic. Flat illustration style ama detaylı. Slayt konuları:
1. "Okut ya da Fotoğrafla" — telefon + barkod tarama
2. "Tek Renkte Anla" — yeşil/sarı/kırmızı trafik lambası metaforu
3. "Sana Özel Uyarı" — kalkan + profil
4. "Ayda 5 Ücretsiz, Pro Sınırsız" — free vs pro karşılaştırma

**c) Scanner (Ana Ekran)** — En çok vakit geçirilen ekran. Kamera alanı, scan frame animasyonu, floating tab bar. Şu an çok "utility" görünüyor, daha **immersive** olmalı.

**d) Analysis Result** — En etkileyici ekran olmalı. Skor dairesi büyük ve gösterişli. Profil uyarı banner'ları çarpıcı. Madde listesi okunabilir ama detaylı.

**e) Login / OTP** — Temiz, güven veren, premium.

**f) History** — Kartlar daha zengin, kategori renkleri belirgin.

**g) Profile** — Chip'ler, kota kartı, avatar daha karakterli.

**h) Paywall** — Satın alma kararını kolaylaştıran, premium hissettiren.

**i) Settings** — Basit ama tutarlı.

#### 4. Özel Bileşenler
- **Floating Tab Bar**: Mevcut pill shape iyi ama daha **glassmorphism + blur** efekti, hafif gölge, aktif tab'da animasyon hissi
- **Score Circle**: Skor dairesi daha **3D/derinlik** hissi. Gradient ring, iç glow
- **Chip'ler**: Seçili/seçilsiz geçişi daha belirgin, emoji'ler daha büyük
- **Kartlar**: Subtle gradient border veya iç gölge ile derinlik
- **Badge'ler**: Daha kontrastlı, daha okunabilir

#### 5. Tipografi
Plus Jakarta Sans kalabilir ama alternatif önerilere açığım. Font pairing önerebilirsin.

#### 6. Renk Paleti
- Mevcut teal primary (#0F766E) iyi ama **biraz daha canlı veya gradient** olabilir
- Background fildişi tonu kalsın
- Skor renkleri (yeşil/sarı/kırmızı) daha **zengin ve doygun** olabilir
- Dark mode daha **premium** görünmeli (pure black değil, deep dark teal undertone)

### Çıktı formatı
Tüm ekranları telefon frame'leri içinde gösteren interaktif bir HTML dosyası oluştur (mevcut design-preview.html gibi ama çok daha iyi). Dark/Light mode toggle olsun. Renk token tablosu ve logo varyantları da dahil olsun.

### Kısıtlamlar
- React Native (Expo) ile implementasyon yapılacak — CSS-only efektler (backdrop-filter vb.) RN'de çalışmaz, bunun farkında ol ama tasarımda göster, implementasyonda yaklaşık çözüm buluruz
- Font: Google Fonts'tan olmalı
- İkonlar: lucide-react-native kütüphanesi kullanılacak
- Animasyonlar: react-native-reanimated + lottie-react-native

### Referans uygulamalar (ilham)
- Yuka (food scanner) — temiz, güven veren
- Think Dirty (cosmetics) — cesur renkler, premium his
- Open Food Facts — bilgi yoğunluğu yönetimi
- Noom — onboarding kalitesi
- Headspace — illüstrasyon stili ve tutarlılık
