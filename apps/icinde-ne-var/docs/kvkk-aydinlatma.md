# KVKK Aydınlatma Metni

> **TASLAK** — Bu metin taslaktır. Yayınlanmadan önce hukuki inceleme gereklidir.

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metnidir. Bu metin, İçinde Ne Var? uygulamasını kullanırken kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklamaktadır.

## 1. Veri Sorumlusu

Kişisel verileriniz, veri sorumlusu sıfatıyla [Şirket Adı] tarafından işlenmektedir. Veri sorumlusuna ait iletişim bilgilerine bu metnin sonundaki İletişim bölümünden ulaşabilirsiniz.

## 2. İşlenen Kişisel Veriler

Uygulama kapsamında aşağıdaki kişisel verileriniz işlenmektedir:

### 2.1 Kimlik ve Hesap Bilgileri
- **E-posta adresi:** Kimlik doğrulama (OTP ile şifresiz giriş) ve hesap yönetimi için
- **Google hesap bilgileri:** Google ile giriş tercih edildiğinde Google hesabınızdaki ad ve e-posta bilgileri
- **Apple kimlik bilgileri:** Apple ile giriş tercih edildiğinde Apple ID bilgileri
- **Profil bilgileri:** Hedef kitle tercihleri (bebek, hamile, alerji, hassas cilt, vegan, diyabet vb.) ve alerjen bilgileri

### 2.2 Aile Profil Bilgileri
- **Aile üye profilleri:** Oluşturduğunuz aile profillerinin isimleri, ikonları ve hedef kitle tercihleri
- **Aktif profil seçimi:** Hangi profil için tarama yapıldığının kaydı

### 2.3 Ürün ve Analiz Verileri
- **Ürün tarama geçmişi:** Taranan ürünlerin analiz sonuçları, skorları ve geçmişi
- **Barkod verileri:** Ürün tanımlama amacıyla taranan barkodlar
- **Ürün fotoğrafları:** Ürün içerik analizinin gerçekleştirilmesi amacıyla çekilen fotoğraflar (ürün görseli ve içindekiler etiketi)
- **Favori ürünler:** Kullanıcının favorilere eklediği ürün bilgileri
- **Ürün karşılaştırma verileri:** Karşılaştırılan ürün çiftleri

### 2.4 Kullanım ve Cihaz Bilgileri
- **Tarama istatistikleri:** Toplam tarama sayısı, kategori dağılımı, skor dağılımı gibi anonim kullanım verileri
- **Arama geçmişi:** Madde ansiklopedisinde yapılan aramalar
- **Bildirim tercihleri:** Push bildirim izin ve kategori tercihleri
- **Cihaz bilgileri:** Anonim analitik verileri (uygulama performansı ölçümü)

### 2.5 Abonelik Bilgileri
- **Abonelik durumu:** Ücretsiz veya Pro kullanıcı durumu, abonelik planı (aylık/yıllık)
- **Kota kullanımı:** Günlük analiz kotası kullanım bilgisi

## 3. Kişisel Verilerin İşlenme Amaçları

Toplanan kişisel verileriniz şu amaçlarla işlenmektedir:

- Kullanıcı hesabının oluşturulması ve yönetimi (e-posta OTP, Google Sign-In, Apple Sign-In)
- Aile profilleri oluşturma ve yönetme, profil bazlı analiz sunma
- Ürün içerik analizinin gerçekleştirilmesi (yapay zeka destekli)
- Kişiye özel uyarı ve önerilerin sunulması (profil ve aile profiline göre)
- Ürün karşılaştırma ve alternatif önerme hizmetlerinin sunulması
- Favori ürünlerin saklanması ve yönetimi
- Madde ansiklopedisi arama hizmetinin sunulması
- Tarama istatistiklerinin derlenmesi ve kullanıcıya gösterilmesi
- Sesli asistan ile analiz sonuçlarının okunması (metin-sese dönüşüm)
- Paylaşım kartı oluşturulması (analiz sonuçlarının görsel olarak paylaşılması)
- Push bildirimlerin gönderilmesi (izin verilmesi halinde)
- Abonelik yönetimi ve kota takibi
- Hizmet kalitesinin artırılması ve uygulama performansının iyileştirilmesi
- Yasal yükümlülüklerin yerine getirilmesi

## 4. Kişisel Verilerin Aktarılması

Kişisel verileriniz aşağıdaki taraflarla paylaşılabilir:

- **Yapay zeka sağlayıcısı (Google Gemini API):** Ürün analizi amacıyla ürün içerik bilgileri sunucu tarafında işlenir; kişisel kimlik bilgileri aktarılmaz
- **Open Food Facts veritabanı:** Barkod verilerinin içerik bilgisi ile eşleştirilmesi için (kişisel veri aktarılmaz, yalnızca barkod numarası gönderilir)
- **Bulut altyapı sağlayıcısı (Supabase):** Verilerin güvenli şekilde saklanması için (veritabanı, dosya depolama, kimlik doğrulama)
- **Kimlik doğrulama sağlayıcıları (Google, Apple):** Yalnızca ilgili giriş yöntemi tercih edildiğinde, kimlik doğrulama amacıyla
- **Abonelik yönetimi sağlayıcısı (RevenueCat):** Abonelik durumu ve satın alma doğrulaması için
- **Metin-sese dönüşüm hizmeti:** Sesli asistan özelliğinde analiz sonuçlarının okunması için (cihaz üzerinde işlenir)
- **Yetkili kamu kuruluşları:** Yasal zorunluluk hallerinde

## 5. Veri Güvenliği

Kişisel verilerinizin korunması için aşağıdaki teknik ve idari tedbirler alınmaktadır:

- Tüm veri iletişimi SSL/TLS şifreleme ile korunmaktadır
- Veritabanı erişimi satır düzeyinde güvenlik politikaları (RLS) ile kısıtlanmaktadır; her kullanıcı yalnızca kendi verilerine erişebilir
- Hassas veriler (kimlik doğrulama token'ları) cihazda güvenli depolama alanında (Secure Store) saklanmaktadır
- Yapay zeka analizi yalnızca sunucu tarafında çalışır; istemci uygulamadan doğrudan yapay zeka çağrısı yapılmaz
- Fotoğraflar yükleme öncesi istemci tarafında küçültülür (maks. 1024px, JPEG %80)

## 6. Veri Saklama Süresi

Kişisel verileriniz, hizmetin sunulması için gerekli olan süre boyunca saklanmaktadır. Hesabınızı silmeniz halinde kişisel verileriniz yasal saklama yükümlülükleri saklı kalmak kaydıyla 30 gün içinde silinir. Barkod bazlı ürün analizleri global önbellek olarak anonim şekilde saklanmaya devam edebilir. Anonim analitik veriler istatistiksel amaçlarla daha uzun süre saklanabilir.

## 7. Veri Sahibinin Hakları

KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse buna ilişkin bilgi talep etme
- İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
- Eksik veya yanlış işlenmişse düzeltilmesini isteme
- KVKK'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme
- Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme
- İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme
- Kanuna aykırı olarak işlenmesi sebebiyle zarara uğranması halinde zararın giderilmesini talep etme

## 8. Çerezler ve Yerel Depolama

Uygulama, web tabanlı çerezler kullanmamaktadır. Cihazınızda aşağıdaki veriler yerel olarak saklanabilir:

- Tema tercihi (açık/koyu mod)
- Oturum bilgileri (güvenli depolama alanında)
- Bildirim tercihleri

Bu veriler yalnızca cihazınızda saklanır ve sunucularımıza aktarılmaz.

## 9. İletişim

Kişisel verilerinize ilişkin taleplerinizi aşağıdaki iletişim bilgilerini kullanarak iletebilirsiniz:

- **Veri Sorumlusu:** [Şirket Adı]
- **E-posta:** [kvkk@sirketadi.com]
- **Adres:** [Şirket Adresi]

---

*Son güncelleme: 2026-11-06*
