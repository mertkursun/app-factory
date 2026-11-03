import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  PlayCircle,
  Bell,
  Crown,
  RotateCcw,
  ShieldCheck,
  FileText,
  LogOut,
} from "lucide-react-native";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { IconButton } from "@/components/ui/IconButton";
import { useAppStore } from "@/stores/appStore";
import { useTheme, typography, radius, fonts } from "@/theme/tokens";
import { signOut } from "@/lib/auth";
import { restorePurchases } from "@/lib/revenuecat";
import type { ThemeMode } from "@/theme/tokens";

const APP_VERSION = Constants.expoConfig?.version ?? "2.0.0";
const SCREEN_PAD_X = 18;

const THEME_OPTIONS: readonly { key: ThemeMode; labelKey: string }[] = [
  { key: "light", labelKey: "settings.themeLight" },
  { key: "dark", labelKey: "settings.themeDark" },
  { key: "system", labelKey: "settings.themeSystem" },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow, gradient } = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleReplayOnboarding = () => {
    setHasSeenOnboarding(false);
    router.replace("/(onboarding)");
  };

  const handleManageSubscription = () => {
    router.push("/paywall");
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert(t("settings.restoreSuccess"), t("settings.restoreSuccessMessage"));
    } catch {
      Alert.alert(t("paywall.error"), t("settings.restoreError"));
    }
  };

  const handleSignOut = () => {
    Alert.alert(t("settings.signOutConfirm"), undefined, [
      { text: t("settings.cancel"), style: "cancel" },
      {
        text: t("settings.signOut"),
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon={<ArrowLeft size={18} color={colors.text} />}
            onPress={() => router.back()}
            accessibilityLabel={t("common.back")}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("settings.title")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Gorunum / Appearance */}
        <View style={styles.sectionGroup}>
          <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
            {t("settings.sectionAppearance")}
          </Text>
          <View
            style={[
              styles.themeCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              shadow.low,
            ]}
          >
            <View style={styles.themeToggle}>
              {THEME_OPTIONS.map((option) => {
                const isActive = themeMode === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setThemeMode(option.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={t(option.labelKey)}
                    style={styles.themeSegment}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={[...gradient.primary]}
                        locations={[...gradient.primaryLocations]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.themeSegmentActive}
                      >
                        <Text style={[styles.themeSegmentTextActive, { color: colors.primaryFg }]}>
                          {t(option.labelKey)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.themeSegmentInactive}>
                        <Text
                          style={[styles.themeSegmentTextInactive, { color: colors.textSecondary }]}
                        >
                          {t(option.labelKey)}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Genel / General */}
        <View style={styles.sectionGroup}>
          <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
            {t("settings.sectionGeneral")}
          </Text>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              shadow.low,
            ]}
          >
            <SettingsItem
              icon={PlayCircle}
              label={t("settings.replayOnboarding")}
              onPress={handleReplayOnboarding}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsItem
              icon={Bell}
              label={t("settings.notifications")}
              onPress={() => setIsNotificationsEnabled((prev) => !prev)}
              showChevron={false}
              rightElement={
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                  style={styles.switch}
                  accessibilityLabel={t("settings.notifications")}
                />
              }
            />
          </View>
        </View>

        {/* Abonelik / Subscription */}
        <View style={styles.sectionGroup}>
          <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
            {t("settings.sectionSubscription")}
          </Text>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              shadow.low,
            ]}
          >
            <SettingsItem
              icon={Crown}
              label={t("settings.subscriptionManagement")}
              onPress={handleManageSubscription}
              iconBg={colors.warningBg}
              iconColor={colors.warningText}
              showChevron={false}
              rightElement={
                <View style={[styles.proBadge, { backgroundColor: colors.surfaceTint }]}>
                  <Text style={[styles.proBadgeText, { color: colors.primaryDeep }]}>PRO</Text>
                </View>
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsItem
              icon={RotateCcw}
              label={t("settings.restorePurchases")}
              onPress={handleRestorePurchases}
            />
          </View>
        </View>

        {/* Yasal / Legal */}
        <View style={styles.sectionGroup}>
          <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
            {t("settings.sectionLegal")}
          </Text>
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              shadow.low,
            ]}
          >
            <SettingsItem
              icon={ShieldCheck}
              label={t("legal.privacy")}
              onPress={() => router.push("/legal/privacy")}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingsItem
              icon={FileText}
              label={t("legal.terms")}
              onPress={() => router.push("/legal/terms")}
            />
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel={t("settings.signOut")}
          style={({ pressed }) => [
            styles.signOutButton,
            {
              backgroundColor: colors.dangerBg,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <LogOut size={16} color={colors.dangerText} />
          <Text style={[styles.signOutText, { color: colors.dangerText }]}>
            {t("settings.signOut")}
          </Text>
        </Pressable>

        {/* Version */}
        <Text style={[styles.versionText, { color: colors.muted }]}>
          {t("settings.versionLine", { version: APP_VERSION })}
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_PAD_X,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    lineHeight: 17,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  sectionGroup: {
    marginTop: 18,
    gap: 8,
  },
  sectionLabel: {
    paddingHorizontal: 6,
  },
  themeCard: {
    padding: 6,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  themeToggle: {
    flexDirection: "row",
    gap: 4,
  },
  themeSegment: {
    flex: 1,
  },
  themeSegmentActive: {
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  themeSegmentInactive: {
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  themeSegmentTextActive: {
    fontFamily: fonts.body700,
    fontSize: 12,
    lineHeight: 12,
  },
  themeSegmentTextInactive: {
    fontFamily: fonts.body600,
    fontSize: 12,
    lineHeight: 12,
  },
  sectionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  proBadgeText: {
    fontFamily: fonts.body800,
    fontSize: 11,
    lineHeight: 11,
    letterSpacing: 0.5,
  },
  signOutButton: {
    marginTop: 18,
    height: 50,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontFamily: fonts.body700,
    fontSize: 14,
    lineHeight: 14,
  },
  versionText: {
    textAlign: "center",
    marginTop: 18,
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 17.6,
  },
  bottomSpacer: {
    height: 28,
  },
});
