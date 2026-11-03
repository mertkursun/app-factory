import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-base font-label text-text mb-2">{title}</Text>
      <Text className="text-sm font-body text-text-secondary leading-5">{children}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 gap-3 border-b border-border">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Geri"
          style={{ minHeight: 44, minWidth: 44 }}
          className="items-center justify-center"
        >
          <ArrowLeft size={24} color="#1C1917" />
        </Pressable>
        <Text className="text-lg font-title text-text">KVKK Aydınlatma Metni</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-body text-text-secondary leading-5 mb-6">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında kişisel
          verilerinizin işlenmesine ilişkin aydınlatma metnidir. Bu metin, İçinde Ne Var?
          uygulamasını kullanırken kişisel verilerinizin nasıl toplandığını, işlendiğini ve
          korunduğunu açıklamaktadır.
        </Text>

        <Section title="1. Veri Sorumlusu">
          Kişisel verileriniz, veri sorumlusu sıfatıyla [Şirket Adı] tarafından işlenmektedir. Veri
          sorumlusuna ait iletişim bilgilerine bu metnin sonundaki İletişim bölümünden
          ulaşabilirsiniz.
        </Section>

        <Section title="2. İşlenen Kişisel Veriler">
          Uygulama kapsamında aşağıdaki kişisel verileriniz işlenmektedir: e-posta adresiniz (kimlik
          doğrulama için), profil bilgileriniz (hedef kitle ve alerji tercihleri), ürün tarama
          geçmişiniz, barkod ve ürün fotoğrafları (analiz amacıyla), cihaz ve kullanım bilgileri
          (anonim analitik).
        </Section>

        <Section title="3. Kişisel Verilerin İşlenme Amaçları">
          Toplanan kişisel verileriniz şu amaçlarla işlenmektedir: kullanıcı hesabının oluşturulması
          ve yönetimi, ürün içerik analizinin gerçekleştirilmesi (yapay zeka destekli), kişiye özel
          uyarı ve önerilerin sunulması, hizmet kalitesinin artırılması ve uygulama performansının
          iyileştirilmesi, yasal yükümlülüklerin yerine getirilmesi.
        </Section>

        <Section title="4. Kişisel Verilerin Aktarılması">
          Kişisel verileriniz, analiz hizmetinin sağlanması amacıyla yapay zeka sağlayıcısına
          (Anthropic Claude API) aktarılmaktadır. Ürün barkod verileri, içerik bilgisi eşleştirmesi
          için Open Food Facts veritabanı ile paylaşılmaktadır. Verileriniz bulut altyapı
          sağlayıcısı (Supabase) sunucularında saklanmaktadır. Yasal zorunluluk hallerinde yetkili
          kamu kuruluşlarına aktarım yapılabilir.
        </Section>

        <Section title="5. Veri Saklama Süresi">
          Kişisel verileriniz, hizmetin sunulması için gerekli olan süre boyunca saklanmaktadır.
          Hesabınızı silmeniz halinde kişisel verileriniz yasal saklama yükümlülükleri saklı kalmak
          kaydıyla 30 gün içinde silinir. Anonim analitik veriler istatistiksel amaçlarla daha uzun
          süre saklanabilir.
        </Section>

        <Section title="6. Veri Sahibinin Hakları">
          KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz: kişisel verilerinizin
          işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını
          ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt
          dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini
          isteme, KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini
          isteme.
        </Section>

        <Section title="7. İletişim">
          Kişisel verilerinize ilişkin taleplerinizi aşağıdaki iletişim bilgilerini kullanarak
          iletebilirsiniz:{"\n\n"}Veri Sorumlusu: [Şirket Adı]{"\n"}E-posta: [kvkk@sirketadi.com]
          {"\n"}Adres: [Şirket Adresi]
        </Section>

        <Text className="text-xs font-caption text-muted text-center mt-8 mb-4">
          Bu metin taslaktır. Yayınlanmadan önce hukuki inceleme gereklidir.
        </Text>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
