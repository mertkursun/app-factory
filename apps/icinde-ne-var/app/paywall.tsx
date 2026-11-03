import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Crown } from "lucide-react-native";
import { useSubscription } from "@/hooks/useSubscription";
import { FeatureList } from "@/components/paywall/FeatureList";
import { PricingCard } from "@/components/paywall/PricingCard";
import { PurchaseButton } from "@/components/paywall/PurchaseButton";
import { RestoreButton } from "@/components/paywall/RestoreButton";

const HERO_ICON_SIZE = 48;
const CLOSE_ICON_SIZE = 24;
const MUTED_COLOR = "#78716C";
const PRIMARY_COLOR = "#0F766E";

export default function PaywallScreen() {
  const router = useRouter();
  const { offering, isPro, isLoading, purchase, restore } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const proPackage = offering?.availablePackages[0] ?? null;
  const priceString = proPackage?.product.priceString ?? "";
  const isPriceLoaded = priceString.length > 0;

  // Zaten Pro ise geri don
  useEffect(() => {
    if (isPro && !isPurchasing) {
      router.back();
    }
  }, [isPro, isPurchasing, router]);

  const handlePurchase = useCallback(async () => {
    setIsPurchasing(true);
    try {
      await purchase();
      // purchase sonrasi isPro guncellenecek, useEffect geri yonlendirecek
    } catch {
      Alert.alert("Hata", "Satın alma tamamlanamadı. Tekrar deneyin.");
    } finally {
      setIsPurchasing(false);
    }
  }, [purchase]);

  const handleRestore = useCallback(async () => {
    try {
      await restore();
      // Basarili restore sonrasi isPro guncellenecek
    } catch {
      Alert.alert("Hata", "Satın alımlar geri yüklenemedi. Tekrar deneyin.");
    }
  }, [restore]);

  if (isPro) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Kapat butonu */}
      <View className="flex-row justify-end px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          className="w-11 h-11 items-center justify-center"
        >
          <X size={CLOSE_ICON_SIZE} color={MUTED_COLOR} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary/15 items-center justify-center">
            <Crown size={HERO_ICON_SIZE} color={PRIMARY_COLOR} />
          </View>
        </View>

        <Text className="text-2xl font-display text-text text-center mb-2">
          Pro&apos;ya Yükselt
        </Text>
        <Text className="text-base font-body text-text-secondary text-center mb-8">
          Sınırsız tarama, öncelikli destek ve daha fazlası.
        </Text>

        {/* Ozellik listesi */}
        <View className="mb-8">
          <FeatureList />
        </View>

        {/* Fiyat */}
        <View className="mb-6">
          <PricingCard priceString={priceString} isLoading={isLoading && !isPriceLoaded} />
        </View>
      </ScrollView>

      {/* Alt butonlar */}
      <View className="px-6 pb-4 gap-3">
        <PurchaseButton
          onPress={handlePurchase}
          isLoading={isPurchasing || isLoading}
          isDisabled={!proPackage}
        />

        <RestoreButton onPress={handleRestore} isDisabled={isLoading || isPurchasing} />

        {/* Yasal linkler */}
        <View className="flex-row justify-center gap-4 pb-2">
          <Pressable
            onPress={() => router.push("/legal/privacy")}
            accessibilityRole="link"
            accessibilityLabel="Gizlilik politikası"
            className="min-h-[44px] justify-center"
          >
            <Text className="text-xs font-caption text-muted underline">KVKK</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/legal/terms")}
            accessibilityRole="link"
            accessibilityLabel="Kullanım şartları"
            className="min-h-[44px] justify-center"
          >
            <Text className="text-xs font-caption text-muted underline">Şartlar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
