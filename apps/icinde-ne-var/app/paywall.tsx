import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert, StatusBar, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { X, Crown, Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useTheme, typography, radius, spacing, fonts } from "@/theme/tokens";

type PlanType = "yearly" | "monthly";

const HERO_HEIGHT = 300;
const HERO_GRADIENT_COLORS = ["#0F2E2B", "#0B4F4A", "#0F9B8E"] as const;
const HERO_GRADIENT_LOCATIONS = [0, 0.55, 1] as const;

const FEATURES = [
  "paywall.unlimitedScans",
  "paywall.allProfileWarnings",
  "paywall.adFree",
  "paywall.prioritySupport",
] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const { offering, isPro, isLoading, purchase, restore } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");

  useEffect(() => {
    if (isPro && !isPurchasing) {
      router.back();
    }
  }, [isPro, isPurchasing, router]);

  const handlePurchase = useCallback(async () => {
    setIsPurchasing(true);
    try {
      await purchase();
    } catch {
      Alert.alert(t("paywall.error"), t("paywall.purchaseError"));
    } finally {
      setIsPurchasing(false);
    }
  }, [purchase, t]);

  const handleRestore = useCallback(async () => {
    try {
      await restore();
    } catch {
      Alert.alert(t("paywall.error"), t("paywall.restoreError"));
    }
  }, [restore, t]);

  if (isPro) {
    return null;
  }

  const ctaLabel = selectedPlan === "yearly" ? t("paywall.ctaYearly") : t("paywall.ctaMonthly");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero section */}
        <LinearGradient
          colors={[...HERO_GRADIENT_COLORS]}
          locations={[...HERO_GRADIENT_LOCATIONS]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top }]}
        >
          {/* Decorative glow */}
          <View style={styles.heroGlow} />

          {/* Close button */}
          <View style={styles.heroTopBar}>
            <View style={styles.flex1} />
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              style={({ pressed }) => [styles.closeButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <X size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Hero content */}
          <View style={styles.heroContent}>
            {/* PRO pill */}
            <View style={styles.proPill}>
              <Crown size={14} color="#FBD36A" />
              <Text style={styles.proPillText}>{t("paywall.proPill")}</Text>
            </View>

            <Text style={[typography.paywallHero, styles.heroTitle]}>{t("paywall.heroTitle")}</Text>
            <Text style={styles.heroSubtitle}>{t("paywall.heroSubtitle")}</Text>
          </View>
        </LinearGradient>

        {/* Bottom sheet */}
        <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
          {/* Plan cards */}
          <View style={styles.planCards}>
            <PlanCard
              isSelected={selectedPlan === "yearly"}
              onSelect={() => setSelectedPlan("yearly")}
              badgeLabel={t("paywall.yearlySaving")}
              priceLabel={t("paywall.yearlyPrice")}
              sublabel={t("paywall.yearlyMonthly")}
              amountLabel={t("paywall.yearlyAmount")}
              colors={colors}
              shadow={shadow}
            />
            <PlanCard
              isSelected={selectedPlan === "monthly"}
              onSelect={() => setSelectedPlan("monthly")}
              priceLabel={t("paywall.monthlyPrice")}
              amountLabel={t("paywall.monthlyAmount")}
              colors={colors}
              shadow={shadow}
            />
          </View>

          {/* Feature rows */}
          <View style={styles.featureList}>
            {FEATURES.map((key) => (
              <View key={key} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: colors.surfaceTint }]}>
                  <Check size={14} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>{t(key)}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <PrimaryButton
              label={ctaLabel}
              onPress={handlePurchase}
              isLoading={isPurchasing || isLoading}
              disabled={!offering}
              height={58}
            />
          </View>

          {/* Legal text + restore */}
          <Text style={[typography.captionSm, styles.legalText, { color: colors.muted }]}>
            {t("paywall.legalText")}
          </Text>
          <Pressable
            onPress={handleRestore}
            disabled={isLoading || isPurchasing}
            accessibilityRole="button"
            accessibilityLabel={t("paywall.restoreLabel")}
            style={({ pressed }) => [styles.restoreLink, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[typography.captionSm, { color: colors.primary }]}>
              {t("paywall.restoreLink")}
            </Text>
          </Pressable>

          <View style={{ height: insets.bottom + 16 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Plan Card ─────────────────────────────────────────────────── */

interface PlanCardProps {
  isSelected: boolean;
  onSelect: () => void;
  badgeLabel?: string;
  priceLabel: string;
  sublabel?: string;
  amountLabel: string;
  colors: ReturnType<typeof useTheme>["colors"];
  shadow: ReturnType<typeof useTheme>["shadow"];
}

function PlanCard({
  isSelected,
  onSelect,
  badgeLabel,
  priceLabel,
  sublabel,
  amountLabel,
  colors,
  shadow,
}: PlanCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={priceLabel}
      style={[
        styles.planCard,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
        isSelected && shadow.card,
      ]}
    >
      <View style={styles.planCardInner}>
        {/* Radio */}
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
            <Text style={[styles.planPrice, { color: colors.text }]}>{priceLabel}</Text>
            {badgeLabel ? (
              <View style={[styles.savingBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[typography.badge, { color: colors.successText }]}>{badgeLabel}</Text>
              </View>
            ) : null}
          </View>
          {sublabel ? (
            <Text style={[typography.captionSm, { color: colors.textSecondary }]}>{sublabel}</Text>
          ) : null}
        </View>

        {/* Amount */}
        <Text
          style={{
            fontFamily: fonts.display700,
            fontSize: 18,
            lineHeight: 18,
            color: colors.text,
          }}
        >
          {amountLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  flex1: {
    flex: 1,
  },
  hero: {
    height: HERO_HEIGHT,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: 60,
    left: "50%",
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(15,155,142,0.25)",
  },
  heroTopBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenX,
    paddingTop: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: spacing.screenX,
    justifyContent: "flex-end",
    paddingBottom: 44,
    gap: 12,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(251,211,106,0.18)",
    borderWidth: 1,
    borderColor: "rgba(251,211,106,0.4)",
  },
  proPillText: {
    fontFamily: fonts.body700,
    fontSize: 12,
    lineHeight: 12,
    color: "#FBD36A",
  },
  heroTitle: {
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 19.5,
    color: "rgba(255,255,255,0.75)",
  },
  bottomSheet: {
    marginTop: -22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: spacing.screenX,
  },
  planCards: {
    gap: 10,
  },
  planCard: {
    borderRadius: radius.lg,
    padding: 14,
    paddingHorizontal: 16,
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
    gap: 2,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planPrice: {
    fontFamily: fonts.body600,
    fontSize: 14,
    lineHeight: 20,
  },
  savingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  featureList: {
    marginTop: 24,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontFamily: fonts.body600,
    fontSize: 13,
    lineHeight: 13,
  },
  ctaSection: {
    marginTop: 28,
  },
  legalText: {
    textAlign: "center",
    marginTop: 16,
  },
  restoreLink: {
    alignSelf: "center",
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: "center",
  },
});
