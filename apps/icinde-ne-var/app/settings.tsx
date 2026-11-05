import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Switch,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  BellRing,
  AlertTriangle,
  Crown,
  RotateCcw,
  ShieldCheck,
  FileText,
  LogOut,
  Camera,
  ImageIcon,
} from "lucide-react-native";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useTheme, fonts } from "@/theme/tokens";
import { signOut } from "@/lib/auth";
import { restorePurchases } from "@/lib/revenuecat";
import {
  registerForPushNotificationsAsync,
  scheduleWeeklyReminder,
  cancelWeeklyReminder,
  cancelQuotaWarning,
} from "@/lib/notifications";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { useMediaLibraryPermission } from "@/hooks/useMediaLibraryPermission";
import type { ThemeMode } from "@/theme/tokens";
import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";

const APP_VERSION = Constants.expoConfig?.version ?? "2.0.0";

const THEME_OPTIONS: readonly { key: ThemeMode; labelKey: string }[] = [
  { key: "light", labelKey: "settings.themeLight" },
  { key: "dark", labelKey: "settings.themeDark" },
  { key: "system", labelKey: "settings.themeSystem" },
] as const;

function SettingsRow({
  icon: Icon,
  label,
  description,
  onPress,
  showChevron = true,
  rightElement,
  iconBg,
  iconColor,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={s.row}
    >
      <View style={[s.iconTile, { backgroundColor: iconBg ?? colors.surfaceTint }]}>
        <Icon size={16} color={iconColor ?? colors.primaryDeep} />
      </View>
      <View style={s.rowTextWrap}>
        <Text numberOfLines={1} style={[s.rowLabel, { color: colors.text }]}>
          {label}
        </Text>
        {description ? (
          <Text numberOfLines={2} style={[s.rowDesc, { color: colors.muted }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {rightElement ?? (showChevron ? <ChevronRight size={16} color={colors.muted} /> : null)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow, gradient } = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);
  const notifOn = useAppStore((s) => s.notificationsEnabled);
  const setNotifOn = useAppStore((s) => s.setNotificationsEnabled);
  const weeklyReminder = useNotificationStore((s) => s.weeklyReminder);
  const setWeeklyReminderPref = useNotificationStore((s) => s.setWeeklyReminder);
  const quotaWarning = useNotificationStore((s) => s.quotaWarning);
  const setQuotaWarningPref = useNotificationStore((s) => s.setQuotaWarning);
  const cameraPerm = useCameraPermission();
  const mediaLibPerm = useMediaLibraryPermission();

  const ensureNotificationPermission = async (): Promise<boolean> => {
    if (notifOn) return true;
    const token = await registerForPushNotificationsAsync();
    if (!token) return false;
    setNotifOn(true);
    return true;
  };

  const handleWeeklyReminderToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await ensureNotificationPermission();
      if (!hasPermission) return;
      setWeeklyReminderPref(true);
      await scheduleWeeklyReminder(
        t("notifications.weeklyReminderTitle"),
        t("notifications.weeklyReminderBody"),
      );
    } else {
      setWeeklyReminderPref(false);
      await cancelWeeklyReminder();
    }
  };

  const handleQuotaWarningToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await ensureNotificationPermission();
      if (!hasPermission) return;
      setQuotaWarningPref(true);
    } else {
      setQuotaWarningPref(false);
      await cancelQuotaWarning();
    }
  };

  const handleCameraPermission = () => {
    if (cameraPerm.isGranted) return;
    if (cameraPerm.canAskAgain) {
      cameraPerm.requestPermission();
    } else {
      mediaLibPerm.openSettings();
    }
  };

  const handlePhotoPermission = () => {
    if (mediaLibPerm.isGranted) return;
    if (mediaLibPerm.canAskAgain) {
      mediaLibPerm.requestPermission();
    } else {
      mediaLibPerm.openSettings();
    }
  };

  const handleReplayOnboarding = () => {
    setHasSeenOnboarding(false);
    router.replace("/(onboarding)");
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

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert(t("settings.restoreSuccess"), t("settings.restoreSuccessMessage"));
    } catch {
      Alert.alert(t("paywall.error"), t("settings.restoreError"));
    }
  };

  return (
    <SafeAreaView style={[s.flex1, { backgroundColor: colors.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
            style={[
              s.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              shadow.low,
            ]}
          >
            <ChevronLeft size={18} color={colors.text} strokeWidth={2.2} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>{t("settings.title")}</Text>
          <View style={s.headerSpacer} />
        </View>

        {/* GÖRÜNÜM */}
        <Text style={[s.sectionLabel, { color: colors.muted, marginTop: 18 }]}>
          {t("settings.sectionAppearance")}
        </Text>
        <View
          style={[
            s.themeCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <View style={s.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const active = themeMode === opt.key;
              return (
                <View key={opt.key} style={s.themeOptionWrap}>
                  <Pressable
                    onPress={() => setThemeMode(opt.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[...gradient.primary]}
                        locations={[...gradient.primaryLocations]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={s.themePill}
                      >
                        <Text style={[s.themePillTextActive, { color: colors.primaryFg }]}>
                          {t(opt.labelKey)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.themePill}>
                        <Text style={[s.themePillText, { color: colors.textSecondary }]}>
                          {t(opt.labelKey)}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        {/* GENEL */}
        <Text style={[s.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionGeneral")}
        </Text>
        <View
          style={[
            s.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={PlayCircle}
            label={t("settings.replayOnboarding")}
            onPress={handleReplayOnboarding}
          />
        </View>

        {/* BİLDİRİMLER */}
        <Text style={[s.sectionLabel, { color: colors.muted }]}>
          {t("settings.notificationSection")}
        </Text>
        <View
          style={[
            s.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={BellRing}
            label={t("settings.weeklyReminder")}
            description={t("settings.weeklyReminderDesc")}
            onPress={() => handleWeeklyReminderToggle(!weeklyReminder)}
            showChevron={false}
            rightElement={
              <Switch
                value={weeklyReminder}
                onValueChange={handleWeeklyReminderToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                style={s.switch}
              />
            }
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon={AlertTriangle}
            label={t("settings.quotaWarning")}
            description={t("settings.quotaWarningDesc")}
            onPress={() => handleQuotaWarningToggle(!quotaWarning)}
            showChevron={false}
            rightElement={
              <Switch
                value={quotaWarning}
                onValueChange={handleQuotaWarningToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                style={s.switch}
              />
            }
          />
        </View>

        {/* İZİNLER */}
        <Text style={[s.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionPermissions")}
        </Text>
        <View
          style={[
            s.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={Camera}
            label={t("settings.cameraPermission")}
            onPress={handleCameraPermission}
            showChevron={false}
            rightElement={
              <View
                style={[
                  s.permBadge,
                  {
                    backgroundColor: cameraPerm.isGranted ? colors.successBg : colors.dangerBg,
                  },
                ]}
              >
                <Text
                  style={[
                    s.permBadgeText,
                    { color: cameraPerm.isGranted ? colors.successText : colors.dangerText },
                  ]}
                >
                  {cameraPerm.isGranted ? t("settings.permGranted") : t("settings.permDenied")}
                </Text>
              </View>
            }
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon={ImageIcon}
            label={t("settings.photoPermission")}
            onPress={handlePhotoPermission}
            showChevron={false}
            rightElement={
              <View
                style={[
                  s.permBadge,
                  {
                    backgroundColor: mediaLibPerm.isGranted ? colors.successBg : colors.dangerBg,
                  },
                ]}
              >
                <Text
                  style={[
                    s.permBadgeText,
                    { color: mediaLibPerm.isGranted ? colors.successText : colors.dangerText },
                  ]}
                >
                  {mediaLibPerm.isGranted ? t("settings.permGranted") : t("settings.permDenied")}
                </Text>
              </View>
            }
          />
        </View>

        {/* ABONELİK */}
        <Text style={[s.sectionLabel, { color: colors.muted }]}>
          {t("settings.sectionSubscription")}
        </Text>
        <View
          style={[
            s.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={Crown}
            label={t("settings.subscriptionManagement")}
            onPress={() => router.push("/paywall")}
            iconBg={colors.warningBg}
            iconColor={colors.warningText}
            showChevron={false}
            rightElement={
              <View style={[s.permBadge, { backgroundColor: colors.surfaceTint }]}>
                <Text
                  style={{
                    fontFamily: fonts.body800,
                    fontSize: 11,
                    letterSpacing: 0.5,
                    color: colors.primaryDeep,
                  }}
                >
                  PRO
                </Text>
              </View>
            }
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon={RotateCcw}
            label={t("settings.restorePurchases")}
            onPress={handleRestorePurchases}
          />
        </View>

        {/* YASAL */}
        <Text style={[s.sectionLabel, { color: colors.muted }]}>{t("settings.sectionLegal")}</Text>
        <View
          style={[
            s.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={ShieldCheck}
            label={t("legal.privacy")}
            onPress={() => router.push("/legal/privacy")}
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon={FileText}
            label={t("legal.terms")}
            onPress={() => router.push("/legal/terms")}
          />
        </View>

        {/* Çıkış Yap */}
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={t("settings.signOut")}
          style={[s.signOutButton, { backgroundColor: colors.dangerBg }]}
        >
          <LogOut size={16} color={colors.dangerText} />
          <Text style={[s.signOutText, { color: colors.dangerText }]}>{t("settings.signOut")}</Text>
        </TouchableOpacity>

        {/* Sürüm */}
        <Text style={[s.versionText, { color: colors.muted }]}>
          {t("settings.versionLine", { version: APP_VERSION })}
        </Text>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 28 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  headerSpacer: { width: 40 },
  sectionLabel: {
    fontFamily: fonts.body800,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  themeCard: {
    padding: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: "row",
    gap: 4,
  },
  themeOptionWrap: { flex: 1 },
  themePill: {
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  themePillTextActive: {
    fontFamily: fonts.body700,
    fontSize: 12,
  },
  themePillText: {
    fontFamily: fonts.body600,
    fontSize: 12,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: fonts.body600,
    fontSize: 14,
    lineHeight: 20,
  },
  rowDesc: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  divider: { height: 1 },
  switch: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  permBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  permBadgeText: {
    fontFamily: fonts.body700,
    fontSize: 11,
  },
  signOutButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  versionText: {
    textAlign: "center",
    marginTop: 18,
    fontFamily: fonts.body500,
    fontSize: 11,
  },
  bottomSpacer: { height: 28 },
});
