import { View, Text, ScrollView, Pressable, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Bell,
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
import { useTheme, fonts } from "@/theme/tokens";
import { signOut } from "@/lib/auth";
import { restorePurchases } from "@/lib/revenuecat";
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
  onPress,
  showChevron = true,
  rightElement,
  iconBg,
  iconColor,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {({ pressed }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 13,
            paddingHorizontal: 14,
            gap: 12,
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: iconBg ?? colors.surfaceTint,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={16} color={iconColor ?? colors.primaryDeep} />
          </View>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: fonts.body600,
              fontSize: 14,
              lineHeight: 20,
              color: colors.text,
            }}
          >
            {label}
          </Text>
          {rightElement ?? (showChevron ? <ChevronRight size={16} color={colors.muted} /> : null)}
        </View>
      )}
    </Pressable>
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
  const cameraPerm = useCameraPermission();
  const mediaLibPerm = useMediaLibraryPermission();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("common.back")}
          >
            {({ pressed }) => (
              <View
                style={[
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    borderWidth: 1,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                  shadow.low,
                ]}
              >
                <ChevronLeft size={18} color={colors.text} strokeWidth={2.2} />
              </View>
            )}
          </Pressable>
          <Text
            style={{
              fontFamily: fonts.display700,
              fontSize: 17,
              letterSpacing: -0.3,
              color: colors.text,
              textAlign: "center",
            }}
          >
            {t("settings.title")}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* GÖRÜNÜM */}
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 18,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          {t("settings.sectionAppearance")}
        </Text>
        <View
          style={[
            {
              padding: 6,
              borderRadius: 18,
              borderWidth: 1,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            shadow.low,
          ]}
        >
          <View style={{ flexDirection: "row", gap: 4 }}>
            {THEME_OPTIONS.map((opt) => {
              const active = themeMode === opt.key;
              return (
                <View key={opt.key} style={{ flex: 1 }}>
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
                        style={{
                          height: 38,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.body700,
                            fontSize: 12,
                            color: colors.primaryFg,
                          }}
                        >
                          {t(opt.labelKey)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View
                        style={{
                          height: 38,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.body600,
                            fontSize: 12,
                            color: colors.textSecondary,
                          }}
                        >
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
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 22,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          {t("settings.sectionGeneral")}
        </Text>
        <View
          style={[
            {
              borderRadius: 20,
              borderWidth: 1,
              overflow: "hidden",
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={PlayCircle}
            label={t("settings.replayOnboarding")}
            onPress={handleReplayOnboarding}
          />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <SettingsRow
            icon={Bell}
            label={t("settings.notifications")}
            onPress={() => setNotifOn(!notifOn)}
            showChevron={false}
            rightElement={
              <Switch
                value={notifOn}
                onValueChange={setNotifOn}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
            }
          />
        </View>

        {/* İZİNLER */}
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 22,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          {t("settings.sectionPermissions")}
        </Text>
        <View
          style={[
            {
              borderRadius: 20,
              borderWidth: 1,
              overflow: "hidden",
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
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
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: cameraPerm.isGranted ? colors.successBg : colors.dangerBg,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.body700,
                    fontSize: 11,
                    color: cameraPerm.isGranted ? colors.successText : colors.dangerText,
                  }}
                >
                  {cameraPerm.isGranted ? t("settings.permGranted") : t("settings.permDenied")}
                </Text>
              </View>
            }
          />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <SettingsRow
            icon={ImageIcon}
            label={t("settings.photoPermission")}
            onPress={handlePhotoPermission}
            showChevron={false}
            rightElement={
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: mediaLibPerm.isGranted ? colors.successBg : colors.dangerBg,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.body700,
                    fontSize: 11,
                    color: mediaLibPerm.isGranted ? colors.successText : colors.dangerText,
                  }}
                >
                  {mediaLibPerm.isGranted ? t("settings.permGranted") : t("settings.permDenied")}
                </Text>
              </View>
            }
          />
        </View>

        {/* ABONELİK */}
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 22,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          {t("settings.sectionSubscription")}
        </Text>
        <View
          style={[
            {
              borderRadius: 20,
              borderWidth: 1,
              overflow: "hidden",
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
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
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: colors.surfaceTint,
                }}
              >
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
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <SettingsRow
            icon={RotateCcw}
            label={t("settings.restorePurchases")}
            onPress={handleRestorePurchases}
          />
        </View>

        {/* YASAL */}
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: colors.muted,
            marginTop: 22,
            marginBottom: 8,
            paddingHorizontal: 6,
          }}
        >
          {t("settings.sectionLegal")}
        </Text>
        <View
          style={[
            {
              borderRadius: 20,
              borderWidth: 1,
              overflow: "hidden",
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            shadow.low,
          ]}
        >
          <SettingsRow
            icon={ShieldCheck}
            label={t("legal.privacy")}
            onPress={() => router.push("/legal/privacy")}
          />
          <View style={{ height: 1, backgroundColor: colors.border }} />
          <SettingsRow
            icon={FileText}
            label={t("legal.terms")}
            onPress={() => router.push("/legal/terms")}
          />
        </View>

        {/* Çıkış Yap */}
        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel={t("settings.signOut")}
        >
          {({ pressed }) => (
            <View
              style={{
                marginTop: 22,
                height: 50,
                borderRadius: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.dangerBg,
                opacity: pressed ? 0.8 : 1,
              }}
            >
              <LogOut size={16} color={colors.dangerText} />
              <Text
                style={{
                  fontFamily: fonts.body700,
                  fontSize: 14,
                  color: colors.dangerText,
                }}
              >
                {t("settings.signOut")}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Sürüm */}
        <Text
          style={{
            textAlign: "center",
            marginTop: 18,
            fontFamily: fonts.body500,
            fontSize: 11,
            color: colors.muted,
          }}
        >
          {t("settings.versionLine", { version: APP_VERSION })}
        </Text>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
