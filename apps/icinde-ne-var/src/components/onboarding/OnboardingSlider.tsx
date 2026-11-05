import { useRef, useState, useCallback, useMemo, type ReactNode } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react-native";
import { useAppStore } from "@/stores/appStore";
import { useTheme, fonts } from "@/theme/tokens";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SlideItem } from "./SlideItem";
import { ScanIllustration } from "./illustrations/ScanIllustration";
import { ColorsIllustration } from "./illustrations/ColorsIllustration";
import { ProfileIllustration } from "./illustrations/ProfileIllustration";
import { ProIllustration } from "./illustrations/ProIllustration";
import { FamilyIllustration } from "./illustrations/FamilyIllustration";
import { EncyclopediaIllustration } from "./illustrations/EncyclopediaIllustration";

const ILLUSTRATION_SIZE = 264;

interface Slide {
  id: string;
  titleKey: string;
  descKey: string;
}

const SLIDE_DATA: Slide[] = [
  { id: "1", titleKey: "onboarding.slide1Title", descKey: "onboarding.slide1Desc" },
  { id: "2", titleKey: "onboarding.slide2Title", descKey: "onboarding.slide2Desc" },
  { id: "3", titleKey: "onboarding.slide3Title", descKey: "onboarding.slide3Desc" },
  { id: "4", titleKey: "onboarding.slide4Title", descKey: "onboarding.slide4Desc" },
  { id: "5", titleKey: "onboarding.slide5Title", descKey: "onboarding.slide5Desc" },
  { id: "6", titleKey: "onboarding.slide6Title", descKey: "onboarding.slide6Desc" },
];

const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

/* ── Segment progress bar ────────────────────────────────── */

const SEGMENT_ACTIVE_W = 26;
const SEGMENT_INACTIVE_W = 8;
const SEGMENT_H = 6;
const SEGMENT_GAP = 5;

function ProgressBar({ current, total }: { current: number; total: number }) {
  const { colors } = useTheme();

  return (
    <View style={styles.progressRow}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isPassed = i < current;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                width: isActive ? SEGMENT_ACTIVE_W : SEGMENT_INACTIVE_W,
                backgroundColor: isActive || isPassed ? colors.primary : colors.border,
                marginRight: i < total - 1 ? SEGMENT_GAP : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/* ── Main slider ─────────────────────────────────────────── */

export function OnboardingSlider() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);

  const illustrations: ReactNode[] = useMemo(
    () => [
      <ScanIllustration key="scan" size={ILLUSTRATION_SIZE} colors={colors} />,
      <ColorsIllustration key="colors" size={ILLUSTRATION_SIZE} colors={colors} />,
      <ProfileIllustration key="profile" size={ILLUSTRATION_SIZE} colors={colors} />,
      <ProIllustration key="pro" size={ILLUSTRATION_SIZE} colors={colors} />,
      <FamilyIllustration key="family" size={ILLUSTRATION_SIZE} colors={colors} />,
      <EncyclopediaIllustration key="encyclopedia" size={ILLUSTRATION_SIZE} colors={colors} />,
    ],
    [colors],
  );

  const handleComplete = useCallback(() => {
    setHasSeenOnboarding(true);
    router.replace("/(auth)/login");
  }, [setHasSeenOnboarding, router]);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDE_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  }, [currentIndex, handleComplete]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: { index: number | null }[];
      changed: { index: number | null }[];
    }) => {
      if (viewableItems[0]?.index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const isLastSlide = currentIndex === SLIDE_DATA.length - 1;

  const renderSlide = useCallback(
    ({ item, index }: { item: Slide; index: number }) => (
      <SlideItem
        title={t(item.titleKey)}
        description={t(item.descKey)}
        illustration={illustrations[index]}
        width={width}
      />
    ),
    [t, illustrations, width],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top bar: progress + skip */}
      <View style={styles.topBar}>
        <ProgressBar current={currentIndex} total={SLIDE_DATA.length} />
        <Pressable
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel={t("onboarding.skipLabel")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.skipText, { color: colors.primary }]}>{t("onboarding.skip")}</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDE_DATA}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={
          onViewableItemsChanged as FlatList["props"]["onViewableItemsChanged"]
        }
        viewabilityConfig={VIEWABILITY_CONFIG}
        bounces={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        <PrimaryButton
          label={isLastSlide ? t("onboarding.start") : t("onboarding.continue")}
          onPress={handleNext}
          height={56}
          icon={<ArrowRight size={18} color={colors.primaryFg} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 62,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    height: 32,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  segment: {
    height: SEGMENT_H,
    borderRadius: SEGMENT_H / 2,
  },
  skipButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 44,
    justifyContent: "center",
  },
  skipText: {
    fontFamily: fonts.body700,
    fontSize: 13,
  },
  bottomArea: {
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
});
