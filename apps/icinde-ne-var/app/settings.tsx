import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  RotateCcw,
  Crown,
  RefreshCw,
  FileText,
  Shield,
  LogOut,
  Info,
} from "lucide-react-native";
import Constants from "expo-constants";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { useAppStore } from "@/stores/appStore";
import { signOut } from "@/lib/auth";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function SettingsScreen() {
  const router = useRouter();
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);

  const handleReplayOnboarding = () => {
    setHasSeenOnboarding(false);
    router.replace("/(onboarding)");
  };

  const handleManageSubscription = () => {
    // T18 paywall ekranı yapıldığında router.push("/paywall")
  };

  const handleRestorePurchases = () => {
    // T17 RevenueCat entegrasyonu yapıldığında Purchases.restorePurchases()
  };

  const handleSignOut = () => {
    Alert.alert("Çıkış yapmak istiyor musunuz?", undefined, [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Geri"
          className="min-h-[44px] min-w-[44px] items-center justify-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ArrowLeft size={24} color="#1C1917" />
        </Pressable>
        <Text className="font-title text-lg text-text">Ayarlar</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Genel */}
        <Text className="mb-2 mt-4 font-label text-xs uppercase tracking-wider text-text-secondary">
          Genel
        </Text>
        <View className="mb-6 rounded-xl border border-border bg-surface px-4">
          <SettingsItem
            icon={RotateCcw}
            label="Tanıtımı Tekrar İzle"
            description="Onboarding slaytlarını yeniden göster"
            onPress={handleReplayOnboarding}
          />
        </View>

        {/* Abonelik */}
        <Text className="mb-2 font-label text-xs uppercase tracking-wider text-text-secondary">
          Abonelik
        </Text>
        <View className="mb-6 rounded-xl border border-border bg-surface px-4">
          <SettingsItem
            icon={Crown}
            iconColor="#0F766E"
            label="Abonelik Yönetimi"
            description="Planınızı görüntüleyin veya değiştirin"
            onPress={handleManageSubscription}
          />
          <View className="h-px bg-border" />
          <SettingsItem
            icon={RefreshCw}
            label="Satın Almaları Geri Yükle"
            onPress={handleRestorePurchases}
          />
        </View>

        {/* Yasal */}
        <Text className="mb-2 font-label text-xs uppercase tracking-wider text-text-secondary">
          Yasal
        </Text>
        <View className="mb-6 rounded-xl border border-border bg-surface px-4">
          <SettingsItem
            icon={Shield}
            label="KVKK Aydınlatma Metni"
            onPress={() => router.push("/legal/privacy")}
          />
          <View className="h-px bg-border" />
          <SettingsItem
            icon={FileText}
            label="Kullanım Şartları"
            onPress={() => router.push("/legal/terms")}
          />
        </View>

        {/* Hesap */}
        <Text className="mb-2 font-label text-xs uppercase tracking-wider text-text-secondary">
          Hesap
        </Text>
        <View className="mb-6 rounded-xl border border-border bg-surface px-4">
          <SettingsItem
            icon={LogOut}
            label="Çıkış Yap"
            onPress={handleSignOut}
            danger
            showChevron={false}
          />
        </View>

        {/* Versiyon */}
        <View className="items-center py-6">
          <View className="flex-row items-center gap-1">
            <Info size={14} color="#78716C" />
            <Text className="font-caption text-xs text-muted">İçinde Ne Var? v{APP_VERSION}</Text>
          </View>
          <Text className="mt-1 font-caption text-xs text-muted">Yapım: 2026</Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
