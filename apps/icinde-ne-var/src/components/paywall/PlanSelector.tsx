import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme, radius, fonts } from "@/theme/tokens";
import type { PlanType } from "@/lib/revenuecat";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SCALE = 0.96;
const PRESS_DURATION = 150;
const PRESS_EASING = Easing.out(Easing.quad);

interface PlanSelectorProps {
  selectedPlan: PlanType;
  onSelect: (plan: PlanType) => void;
  yearlyPrice?: string;
  monthlyPrice?: string;
  yearlyPerMonth?: string;
}

export function PlanSelector({
  selectedPlan,
  onSelect,
  yearlyPrice,
  monthlyPrice,
  yearlyPerMonth,
}: PlanSelectorProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();

  const displayYearlyPrice = yearlyPrice ?? t("paywall.yearlyAmount");
  const displayMonthlyPrice = monthlyPrice ?? t("paywall.monthlyAmount");
  const displayYearlyPerMonth = yearlyPerMonth ?? t("paywall.yearlyMonthly");

  return (
    <View style={styles.container}>
      <PlanCard
        isSelected={selectedPlan === "yearly"}
        onSelect={() => onSelect("yearly")}
        title={t("paywall.yearly")}
        badgeLabel={t("paywall.yearlySaving")}
        recommendedLabel={t("paywall.recommended")}
        sublabel={displayYearlyPerMonth}
        amount={displayYearlyPrice}
        colors={colors}
        shadow={shadow}
      />
      <PlanCard
        isSelected={selectedPlan === "monthly"}
        onSelect={() => onSelect("monthly")}
        title={t("paywall.monthly")}
        sublabel={t("paywall.monthlyCancel")}
        amount={displayMonthlyPrice}
        colors={colors}
        shadow={shadow}
      />
    </View>
  );
}

/* -- Plan Card --------------------------------------------------------- */

interface PlanCardProps {
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  badgeLabel?: string;
  recommendedLabel?: string;
  sublabel?: string;
  amount: string;
  colors: ReturnType<typeof useTheme>["colors"];
  shadow: ReturnType<typeof useTheme>["shadow"];
}

function PlanCard({
  isSelected,
  onSelect,
  title,
  badgeLabel,
  recommendedLabel,
  sublabel,
  amount,
  colors,
  shadow: _shadow,
}: PlanCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(PRESS_SCALE, { duration: PRESS_DURATION, easing: PRESS_EASING });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: PRESS_DURATION, easing: PRESS_EASING });
  };

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${title} ${amount}`}
      style={[
        animatedStyle,
        styles.planCard,
        {
          backgroundColor: isSelected ? colors.surfaceTint : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: 2,
        },
        isSelected && {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 6,
        },
      ]}
    >
      {/* Recommended pill - absolute positioned at top-right */}
      {badgeLabel && recommendedLabel ? (
        <View style={[styles.recommendedPill, { backgroundColor: colors.primary }]}>
          <Text style={[styles.recommendedText, { color: colors.primaryFg }]}>
            {recommendedLabel}
          </Text>
        </View>
      ) : null}

      <View style={styles.planCardInner}>
        {/* Radio circle */}
        <View
          style={[
            styles.radio,
            {
              borderColor: isSelected ? colors.primary : colors.border,
              borderWidth: isSelected ? 7 : 2,
            },
          ]}
        />

        {/* Text block */}
        <View style={styles.planTextBlock}>
          <View style={styles.planTitleRow}>
            <Text style={[styles.planTitle, { color: colors.text }]}>{title}</Text>
            {badgeLabel ? (
              <View style={[styles.savingBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.savingBadgeText, { color: colors.successText }]}>
                  {badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>
          {sublabel ? (
            <Text style={[styles.planSublabel, { color: colors.muted }]}>{sublabel}</Text>
          ) : null}
        </View>

        {/* Amount */}
        <Text style={[styles.planAmount, { color: colors.text }]}>{amount}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  planCard: {
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    position: "relative",
    overflow: "visible",
  },
  recommendedPill: {
    position: "absolute",
    top: -10,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    zIndex: 1,
  },
  recommendedText: {
    fontFamily: fonts.body800,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.3,
  },
  planCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  planTextBlock: {
    flex: 1,
    gap: 3,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planTitle: {
    fontFamily: fonts.body800,
    fontSize: 14,
    lineHeight: 20,
  },
  planSublabel: {
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 16,
  },
  savingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  savingBadgeText: {
    fontFamily: fonts.body800,
    fontSize: 10,
    lineHeight: 10,
  },
  planAmount: {
    fontFamily: fonts.display800,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.5,
  },
});
