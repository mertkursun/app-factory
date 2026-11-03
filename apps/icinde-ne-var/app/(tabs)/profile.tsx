import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useProfile, useUpdateProfile, useCreateProfile } from "@/hooks/useProfile";
import { useQuota } from "@/hooks/useQuota";
import { AudienceSelector } from "@/components/profile/AudienceSelector";
import { QuotaInfo } from "@/components/profile/QuotaInfo";
import { ProBadge } from "@/components/profile/ProBadge";
import { IconButton } from "@/components/ui/IconButton";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useTheme, fonts, spacing, typography } from "@/theme/tokens";
import { useCallback, useState, useEffect } from "react";

const AVATAR_SIZE = 58;
const AVATAR_RING_WIDTH = 3;
const AVATAR_INNER = AVATAR_SIZE - AVATAR_RING_WIDTH * 2;
const AVATAR_BG = "#0B4F4A";
const AVATAR_TEXT_COLOR = "#9BF0E3";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, gradient, shadow } = useTheme();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: profile, isLoading: profileLoading } = useProfile(userId);
  const { data: quota, isLoading: quotaLoading } = useQuota(userId);
  const updateProfile = useUpdateProfile(userId ?? "");
  const createProfile = useCreateProfile();

  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.audiences) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing server state into local
      setSelectedAudiences(profile.audiences);
    }
  }, [profile?.audiences]);

  const handleAudienceChange = useCallback(
    async (audiences: string[]) => {
      if (!userId) return;
      setSelectedAudiences(audiences);
      setIsSaving(true);

      try {
        if (profile) {
          await updateProfile.mutateAsync({ audiences });
        } else {
          await createProfile.mutateAsync({
            user_id: userId,
            audiences,
          });
        }
      } catch {
        setSelectedAudiences(profile?.audiences ?? []);
      } finally {
        setIsSaving(false);
      }
    },
    [profile, userId, updateProfile, createProfile],
  );

  if (profileLoading || quotaLoading) {
    return <LoadingScreen message={t("profile.loading")} />;
  }

  if (!user) {
    return <ErrorScreen title={t("profile.noSession")} message={t("profile.noSessionMessage")} />;
  }

  const displayName = profile?.display_name ?? user.email ?? "";
  const initials = displayName
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.screenTitle, { color: colors.text }]}>{t("tabs.profile")}</Text>
          <IconButton
            icon={<Settings size={20} color={colors.muted} />}
            onPress={() => router.push("/settings")}
            accessibilityLabel={t("profile.settings")}
          />
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={[...gradient.primary]}
          locations={[...gradient.primaryLocations]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, shadow.card]}
        >
          {/* Decorative rings */}
          <View style={styles.decoRing1} />
          <View style={styles.decoRing2} />

          <View style={styles.heroRow}>
            {/* Avatar */}
            <LinearGradient
              colors={["#FFFFFF", "#E0E0E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>{initials || "?"}</Text>
              </View>
            </LinearGradient>

            {/* Info */}
            <View style={styles.heroInfo}>
              <Text style={styles.heroName} numberOfLines={1}>
                {profile?.display_name ?? user.email ?? ""}
              </Text>
              <Text style={styles.heroEmail} numberOfLines={1}>
                {user.email ?? ""}
              </Text>
            </View>

            {/* PRO badge */}
            {quota?.isPro && <ProBadge />}
          </View>
        </LinearGradient>

        {/* Audience section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("profile.audienceSelection")}
            </Text>
            <Text style={[styles.sectionCount, { color: colors.muted }]}>
              {t("profile.audienceCount", { count: selectedAudiences.length })}
            </Text>
          </View>
          <AudienceSelector
            selected={selectedAudiences}
            onChange={handleAudienceChange}
            disabled={isSaving}
          />
          {isSaving && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.savingIndicator} />
          )}
        </View>

        {/* Quota card */}
        {quota && (
          <View style={styles.section}>
            <QuotaInfo used={quota.used} remaining={quota.remaining} isPro={quota.isPro} />
          </View>
        )}

        {/* Bottom spacer for floating tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    overflow: "hidden",
  },
  decoRing1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  decoRing2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: AVATAR_INNER,
    height: AVATAR_INNER,
    borderRadius: AVATAR_INNER / 2,
    backgroundColor: AVATAR_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.display800,
    fontSize: 20,
    color: AVATAR_TEXT_COLOR,
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  heroName: {
    fontFamily: fonts.display800,
    fontSize: 18,
    color: "#FFFFFF",
  },
  heroEmail: {
    fontFamily: fonts.body400,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.body700,
    fontSize: 16,
  },
  sectionCount: {
    fontFamily: fonts.body500,
    fontSize: 11,
  },
  savingIndicator: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 110,
  },
});
