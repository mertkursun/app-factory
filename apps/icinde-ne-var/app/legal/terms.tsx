import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

interface SectionProps {
  title: string;
  children: string;
}

function Section({ title, children }: SectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-base font-label text-text mb-2">{title}</Text>
      <Text className="text-sm font-body text-text-secondary leading-5">{children}</Text>
    </View>
  );
}

export default function TermsScreen() {
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
        <Text className="text-lg font-title text-text">Kullanım Şartları</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-body text-text-secondary leading-5 mb-6">
          İçinde Ne Var? uygulamasını kullanmadan önce lütfen aşağıdaki kullanım şartlarını dikkatle
          okuyunuz. Uygulamayı kullanarak bu şartları kabul etmiş sayılırsınız.
        </Text>

        <Section title="1. Hizmet Tanımı">
          İçinde Ne Var?, gıda, kozmetik ve temizlik ürünlerinin içerik listesini analiz ederek
          kullanıcıya sade Türkçe açıklama ve profil bazlı uyarı sunan bir mobil uygulamadır.
          Uygulama yapay zeka destekli analiz sağlar; sunulan bilgiler tıbbi tavsiye niteliği
          taşımaz.
        </Section>

        <Section title="2. Kullanım Koşulları">
          Uygulamayı kullanabilmek için 18 yaşını doldurmuş olmanız veya yasal temsilcinizin onayını
          almış olmanız gerekmektedir. Hesabınızın güvenliğinden siz sorumlusunuz. Uygulamayı yasa
          dışı amaçlarla kullanmanız, tersine mühendislik yapmanız veya hizmetlerimize zarar
          vermeniz yasaktır.
        </Section>

        <Section title="3. Abonelik ve Ödeme">
          Uygulama ücretsiz temel kullanım hakkı sunmaktadır. Pro abonelik ile ek özellikler ve daha
          yüksek analiz kotası sağlanır. Abonelik ücretleri Apple App Store veya Google Play Store
          üzerinden tahsil edilir. Abonelik dönem sonunda otomatik olarak yenilenir; iptal işlemi
          ilgili mağaza üzerinden yapılmalıdır.
        </Section>

        <Section title="4. Fikri Mülkiyet">
          Uygulamanın tasarımı, kaynak kodu, içerikleri, logosu ve diğer tüm fikri mülkiyet
          unsurları [Şirket Adı]&apos;na aittir. Kullanıcı, uygulamayı yalnızca kişisel kullanım
          amacıyla kullanma hakkına sahiptir. İçeriklerin izinsiz kopyalanması, dağıtılması veya
          değiştirilmesi yasaktır.
        </Section>

        <Section title="5. Sorumluluk Sınırlandırması">
          Uygulama tarafından sağlanan analizler ve öneriler yalnızca bilgi amaçlıdır ve tıbbi,
          beslenme veya sağlık tavsiyesi yerine geçmez. [Şirket Adı], analiz sonuçlarının doğruluğu
          veya eksiksizliği konusunda garanti vermemektedir. Kullanıcı, analiz sonuçlarına dayanarak
          aldığı kararlardan kendisi sorumludur.
        </Section>

        <Section title="6. Sözleşme Değişiklikleri">
          [Şirket Adı], bu kullanım şartlarını önceden bildirimde bulunarak değiştirme hakkını saklı
          tutar. Değişiklikler uygulama içinden ve/veya e-posta ile bildirilir. Değişiklik
          sonrasında uygulamayı kullanmaya devam etmeniz, güncel şartları kabul ettiğiniz anlamına
          gelir.
        </Section>

        <Section title="7. Uygulanacak Hukuk ve Uyuşmazlık Çözümü">
          Bu sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Sözleşmeden doğan uyuşmazlıklarda
          [Şehir] Mahkemeleri ve İcra Daireleri yetkilidir. Tüketici hakem heyetine başvuru hakkınız
          saklıdır.
        </Section>

        <Text className="text-xs font-caption text-muted text-center mt-8 mb-4">
          Bu metin taslaktır. Yayınlanmadan önce hukuki inceleme gereklidir.
        </Text>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
