import { useRef, useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { ScanLine, Palette, ShieldAlert, Crown } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/stores/appStore";
import { SlideItem } from "./SlideItem";

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Okut ya da Fotoğrafla",
    description: "Barkodu tarat veya içindekiler etiketinin fotoğrafını çek, gerisini bize bırak.",
    icon: ScanLine,
    iconColor: "#0F766E",
  },
  {
    id: "2",
    title: "Tek Renkte Anla",
    description:
      "Her madde yeşil, sarı veya kırmızı ile işaretlenir. Bir bakışta güvenli mi, riskli mi anla.",
    icon: Palette,
    iconColor: "#0F766E",
  },
  {
    id: "3",
    title: "Sana Özel Uyarı",
    description: "Bebek, hamile, alerji, vegan — profiline göre kişisel risk uyarıları al.",
    icon: ShieldAlert,
    iconColor: "#CA8A04",
  },
  {
    id: "4",
    title: "Ayda 5 Ücretsiz, Pro Sınırsız",
    description: "Her ay 5 ürün ücretsiz analiz et. Daha fazlası için Pro'ya geç, sınırsız tara.",
    icon: Crown,
    iconColor: "#16A34A",
  },
];

const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

export function OnboardingSlider() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);

  const handleComplete = useCallback(() => {
    setHasSeenOnboarding(true);
    router.replace("/(auth)/login");
  }, [setHasSeenOnboarding, router]);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Skip button - top right, hidden on last slide */}
      <View className="h-12 flex-row justify-end px-4">
        {!isLastSlide && (
          <Pressable
            onPress={handleSkip}
            className="px-4 h-11 justify-center"
            accessibilityRole="button"
            accessibilityLabel="Onboarding'i atla"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-muted text-sm font-label">Atla</Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item }) => (
          <SlideItem
            title={item.title}
            description={item.description}
            icon={item.icon}
            iconColor={item.iconColor}
            width={width}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        bounces={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Pagination dots */}
      <View className="flex-row justify-center gap-2 mb-6">
        {SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            className={`h-2 rounded-full ${
              index === currentIndex ? "w-6 bg-primary" : "w-2 bg-border"
            }`}
          />
        ))}
      </View>

      {/* Bottom buttons */}
      <View className="px-6" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        {isLastSlide ? (
          <View>
            <Pressable
              onPress={handleComplete}
              className="bg-primary h-14 rounded-xl items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Başla"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-primary-foreground text-base font-label">Başla</Text>
            </Pressable>
            <Pressable
              onPress={handleComplete}
              className="mt-4 h-11 items-center justify-center"
              accessibilityRole="link"
              accessibilityLabel="Giriş yap"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text className="text-muted text-sm font-body">
                Hesabınız var mı? <Text className="text-primary font-label">Giriş yapın</Text>
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handleNext}
            className="bg-primary h-14 rounded-xl items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Devam et"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="text-primary-foreground text-base font-label">Devam Et</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
