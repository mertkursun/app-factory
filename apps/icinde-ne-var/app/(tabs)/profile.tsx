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
            icon={<Settings size={18} color={colors.text} />}
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
          {/* Decorative circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          <View style={styles.heroRow}>
            {/* Avatar */}
            <LinearGradient
              colors={["#FFFFFF", "rgba(255,255,255,0.4)"]}
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
              <Text style={[styles.heroName, { color: colors.primaryFg }]} numberOfLines={1}>
                {profile?.display_name ?? user.email ?? ""}
              </Text>
              <Text style={[styles.heroEmail, { color: colors.primaryFg }]} numberOfLines={1}>
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
          <Text style={[styles.audienceDesc, { color: colors.textSecondary }]}>
            {t("profile.audienceDescText", {
              defaultValue: "Uyarılar bu profillere göre kişiselleşir.",
            })}
          </Text>
          <View style={styles.audienceGrid}>
            <AudienceSelector
              selected={selectedAudiences}
              onChange={handleAudienceChange}
              disabled={isSaving}
            />
          </View>
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
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  heroCard: {
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
  },
  decoCircle1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  decoCircle2: {
    position: "absolute",
    bottom: -70,
    right: 10,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
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
    padding: AVATAR_RING_WIDTH,
  },
  avatarInner: {
    flex: 1,
    borderRadius: AVATAR_INNER / 2,
    backgroundColor: AVATAR_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.display800,
    fontSize: 20,
    color: AVATAR_TEXT_COLOR,
    letterSpacing: -0.5,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    fontFamily: fonts.display800,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  heroEmail: {
    fontFamily: fonts.body400,
    fontSize: 12,
    opacity: 0.8,
  },
  section: {},
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: fonts.display700,
    fontSize: 16,
  },
  sectionCount: {
    fontFamily: fonts.body500,
    fontSize: 11,
  },
  audienceDesc: {
    fontFamily: fonts.body400,
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  audienceGrid: {
    marginTop: 12,
  },
  savingIndicator: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 110,
  },
});
