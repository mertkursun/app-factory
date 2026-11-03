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
  ChevronRight,
} from "lucide-react-native";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { ProBadge } from "@/components/profile/ProBadge";
import { useAppStore } from "@/stores/appStore";
import { useTheme, typography, radius, spacing, fonts } from "@/theme/tokens";
import { signOut } from "@/lib/auth";
import { restorePurchases } from "@/lib/revenuecat";
import type { ThemeMode } from "@/theme/tokens";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

const THEME_OPTIONS: readonly { key: ThemeMode; labelKey: string }[] = [
  { key: "light", labelKey: "settings.themeLight" },
  { key: "dark", labelKey: "settings.themeDark" },
  { key: "system", labelKey: "settings.themeSystem" },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, gradient } = useTheme();
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
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
        />
        <Text
          style={[typography.screenTitle, styles.headerTitle, { color: colors.text, fontSize: 20 }]}
        >
          {t("settings.title")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gorunum / Appearance */}
        <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionAppearance")}
        </Text>
        <Card style={styles.themeCard}>
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
                      <Text style={[styles.themeSegmentText, { color: colors.primaryFg }]}>
                        {t(option.labelKey)}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.themeSegmentInactive}>
                      <Text style={[styles.themeSegmentText, { color: colors.text }]}>
                        {t(option.labelKey)}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Genel / General */}
        <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionGeneral")}
        </Text>
        <Card>
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
        </Card>

        {/* Abonelik / Subscription */}
        <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionSubscription")}
        </Text>
        <Card>
          <SettingsItem
            icon={Crown}
            label={t("settings.subscriptionManagement")}
            onPress={handleManageSubscription}
            rightElement={
              <View style={styles.subscriptionRight}>
                <ProBadge />
                <ChevronRightIcon color={colors.muted} />
              </View>
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsItem
            icon={RotateCcw}
            label={t("settings.restorePurchases")}
            onPress={handleRestorePurchases}
          />
        </Card>

        {/* Yasal / Legal */}
        <Text style={[typography.sectionLabel, styles.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionLegal")}
        </Text>
        <Card>
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
        </Card>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
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
            <LogOut size={18} color={colors.dangerText} />
            <Text style={[styles.signOutText, { color: colors.dangerText }]}>
              {t("settings.signOut")}
            </Text>
          </Pressable>
        </View>

        {/* Version */}
        <Text style={[typography.captionSm, styles.versionText, { color: colors.muted }]}>
          {t("common.appVersion", { version: APP_VERSION })}
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChevronRightIcon({ color }: { color: string }) {
  return <ChevronRight size={16} color={color} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 24,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 10,
    paddingLeft: 4,
  },
  themeCard: {
    padding: 6,
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
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  themeSegmentInactive: {
    height: 38,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  themeSegmentText: {
    fontFamily: fonts.body600,
    fontSize: 13,
    lineHeight: 13,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  subscriptionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signOutSection: {
    marginTop: 32,
  },
  signOutButton: {
    height: 50,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontFamily: fonts.body700,
    fontSize: 15,
    lineHeight: 15,
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
  },
  bottomSpacer: {
    height: 32,
  },
});
