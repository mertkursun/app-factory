import { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Alert, StatusBar, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { X, Crown, Check } from "lucide-react-native";
import { PACKAGE_TYPE } from "react-native-purchases";
import { useTranslation } from "react-i18next";
import { useSubscription } from "@/hooks/useSubscription";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PlanSelector } from "@/components/paywall/PlanSelector";
import { useTheme, radius, fonts } from "@/theme/tokens";
import type { PlanType } from "@/lib/revenuecat";

const HERO_HEIGHT = 300;
const HERO_GRADIENT_COLORS = ["#0F2E2B", "#0B4F4A", "#0F9B8E"] as const;
const HERO_GRADIENT_LOCATIONS = [0, 0.55, 1] as const;

const FEATURES = [
  "paywall.unlimitedScans",
  "paywall.allProfileWarnings",
  "paywall.detailedReports",
  "paywall.adFree",
] as const;

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
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
      await purchase(selectedPlan);
    } catch {
      Alert.alert(t("paywall.error"), t("paywall.purchaseError"));
    } finally {
      setIsPurchasing(false);
    }
  }, [purchase, selectedPlan, t]);

  const handleRestore = useCallback(async () => {
    try {
      await restore();
    } catch {
      Alert.alert(t("paywall.error"), t("paywall.restoreError"));
    }
  }, [restore, t]);

  const prices = useMemo(() => {
    const packages = offering?.availablePackages;
    if (!packages || packages.length === 0) {
      return { yearlyPrice: undefined, monthlyPrice: undefined, yearlyPerMonth: undefined };
    }

    const yearlyPkg = packages.find((pkg) => pkg.packageType === PACKAGE_TYPE.ANNUAL);
    const monthlyPkg = packages.find((pkg) => pkg.packageType === PACKAGE_TYPE.MONTHLY);

    const yearlyPerMonth =
      yearlyPkg != null
        ? t("paywall.yearlyPricePerMonth", {
            price: (yearlyPkg.product.price / 12).toFixed(2),
          })
        : undefined;

    return {
      yearlyPrice: yearlyPkg?.product.priceString,
      monthlyPrice: monthlyPkg?.product.priceString,
      yearlyPerMonth,
    };
  }, [offering, t]);

  if (isPro) {
    return null;
  }

  const ctaLabel = selectedPlan === "yearly" ? t("paywall.ctaYearly") : t("paywall.ctaMonthly");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Hero section */}
      <LinearGradient
        colors={[...HERO_GRADIENT_COLORS]}
        locations={[...HERO_GRADIENT_LOCATIONS]}
        start={{ x: 0.43, y: 0 }}
        end={{ x: 0.57, y: 1 }}
        style={styles.hero}
      >
        {/* Decorative radial glow */}
        <View style={styles.heroGlow} />
        {/* Decorative circle outline */}
        <View style={styles.heroCircle} />

        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          style={({ pressed }) => [
            styles.closeButton,
            { top: insets.top > 0 ? insets.top + 10 : 62, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <X size={16} color="#FFFFFF" />
        </Pressable>

        {/* Hero content */}
        <View style={[styles.heroContent, { top: insets.top > 0 ? insets.top + 52 : 104 }]}>
          {/* PRO pill */}
          <View style={styles.proPill}>
            <Crown size={13} color="#FBD36A" />
            <Text style={styles.proPillText}>{t("paywall.proPill")}</Text>
          </View>

          <Text style={styles.heroTitle}>{t("paywall.heroTitle")}</Text>
          <Text style={styles.heroSubtitle}>{t("paywall.heroSubtitle")}</Text>
        </View>
      </LinearGradient>

      {/* Bottom sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Plan cards */}
          <PlanSelector
            selectedPlan={selectedPlan}
            onSelect={setSelectedPlan}
            yearlyPrice={prices.yearlyPrice}
            monthlyPrice={prices.monthlyPrice}
            yearlyPerMonth={prices.yearlyPerMonth}
          />

          {/* Feature rows */}
          <View style={styles.featureList}>
            {FEATURES.map((key) => (
              <View key={key} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: colors.surfaceTint }]}>
                  <Check size={12} color={colors.primaryDeep} strokeWidth={3} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>{t(key)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Fixed CTA area */}
        <View style={[styles.ctaArea, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <PrimaryButton
            label={ctaLabel}
            onPress={handlePurchase}
            isLoading={isPurchasing || isLoading}
            disabled={!offering}
            height={58}
            style={styles.ctaButton}
          />

          {/* Legal text + restore */}
          <Text style={[styles.legalText, { color: colors.muted }]}>
            {t("paywall.legalFooter")}{" "}
            <Text
              style={[styles.restoreInline, { color: colors.textSecondary }]}
              onPress={handleRestore}
              accessibilityRole="button"
              accessibilityLabel={t("paywall.restoreLabel")}
            >
              {t("paywall.restoreLink")}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: HERO_HEIGHT,
    overflow: "hidden",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(94,234,212,0.45)",
    left: 10,
    top: 30,
  },
  heroCircle: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    left: -20,
    top: 60,
  },
  closeButton: {
    position: "absolute",
    right: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    position: "absolute",
    left: 22,
    right: 22,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(251,211,106,0.18)",
    borderWidth: 1,
    borderColor: "rgba(251,211,106,0.4)",
  },
  proPillText: {
    fontFamily: fonts.body800,
    fontSize: 11,
    lineHeight: 11,
    color: "#FBD36A",
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: fonts.display800,
    fontSize: 32,
    lineHeight: 33.6,
    letterSpacing: -0.9,
    color: "#FFFFFF",
    marginTop: 14,
  },
  heroSubtitle: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 19.5,
    color: "rgba(255,255,255,0.75)",
    marginTop: 10,
  },
  bottomSheet: {
    flex: 1,
    marginTop: -22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetScroll: {
    flex: 1,
  },
  sheetScrollContent: {
    paddingTop: 18,
    paddingHorizontal: 18,
    gap: 14,
    flexGrow: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  featureList: {
    gap: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontFamily: fonts.body600,
    fontSize: 13,
    lineHeight: 13,
    flex: 1,
  },
  ctaArea: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  ctaButton: {
    flexShrink: 0,
  },
  legalText: {
    textAlign: "center",
    marginTop: 12,
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 17.6,
  },
  restoreInline: {
    fontFamily: fonts.body700,
    fontSize: 11,
  },
});
