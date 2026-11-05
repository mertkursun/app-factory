import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Flame, BarChart3, TrendingUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useUserStats } from "@/hooks/useStats";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTheme, fonts, spacing, typography, radius } from "@/theme/tokens";

const CATEGORY_I18N_KEYS: Record<string, string> = {
  gida: "stats.categoryFood",
  kozmetik: "stats.categoryCosmetic",
  temizlik: "stats.categoryCleaning",
  genel: "stats.categoryGeneral",
};

const CATEGORY_DOT_COLORS = ["#F2B544", "#F08BC4", "#60A5FA", "#7E8B88"];

const MIN_BAR_FLEX = 0.04;

export default function StatsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: stats, isLoading, isError, refetch } = useUserStats(userId);

  if (isLoading) {
    return <LoadingScreen message={t("common.loading")} />;
  }

  if (isError) {
    return (
      <ErrorScreen
        title={t("common.error")}
        message={t("common.retryMessage")}
        onRetry={() => refetch()}
      />
    );
  }

  if (!stats || stats.totalScans === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel={t("common.back")}
            accessibilityRole="button"
            hitSlop={12}
            style={styles.backButton}
          >
            <ChevronLeft size={22} color={colors.text} />
          </Pressable>
          <Text style={[typography.screenTitle, { color: colors.text }]}>{t("stats.title")}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <EmptyState
          icon={BarChart3}
          title={t("stats.noData")}
          description={t("stats.noDataHint")}
        />
      </SafeAreaView>
    );
  }

  const total = stats.safeCount + stats.cautionCount + stats.dangerCount;

  const safeRatio = total > 0 ? stats.safeCount / total : 0;
  const cautionRatio = total > 0 ? stats.cautionCount / total : 0;
  const dangerRatio = total > 0 ? stats.dangerCount / total : 0;

  const safePct = Math.round(safeRatio * 100);
  const cautionPct = Math.round(cautionRatio * 100);
  const dangerPct = Math.round(dangerRatio * 100);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
          accessibilityRole="button"
          hitSlop={12}
          style={styles.backButton}
        >
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.screenTitle, { color: colors.text }]}>{t("stats.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <Card style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryIconBg, { backgroundColor: colors.primaryRing }]}>
                <TrendingUp size={22} color={colors.primary} />
              </View>
              <View style={styles.summaryTextCol}>
                <Text style={[styles.summaryBigNumber, { color: colors.text }]}>
                  {stats.totalScans}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                  {t("stats.totalScans")}
                </Text>
              </View>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.monthlyLine, { color: colors.textSecondary }]}>
              {t("stats.monthlyScans")}: {stats.monthlyScans}
            </Text>
          </View>
        </Card>

        {/* Score Distribution Card */}
        <Card style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t("stats.scoreDistribution")}
            </Text>
            <View style={styles.barsContainer}>
              <ScoreBar
                label={t("stats.safe")}
                count={stats.safeCount}
                percentage={safePct}
                flex={Math.max(safeRatio, MIN_BAR_FLEX)}
                barColor={colors.success}
                barBg={colors.successBg}
                textColor={colors.text}
                mutedColor={colors.muted}
              />
              <ScoreBar
                label={t("stats.caution")}
                count={stats.cautionCount}
                percentage={cautionPct}
                flex={Math.max(cautionRatio, MIN_BAR_FLEX)}
                barColor={colors.warning}
                barBg={colors.warningBg}
                textColor={colors.text}
                mutedColor={colors.muted}
              />
              <ScoreBar
                label={t("stats.danger")}
                count={stats.dangerCount}
                percentage={dangerPct}
                flex={Math.max(dangerRatio, MIN_BAR_FLEX)}
                barColor={colors.danger}
                barBg={colors.dangerBg}
                textColor={colors.text}
                mutedColor={colors.muted}
              />
            </View>
          </View>
        </Card>

        {/* Top Categories Card */}
        {stats.topCategories.length > 0 && (
          <Card style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t("stats.topCategories")}
              </Text>
              <View style={styles.categoriesList}>
                {stats.topCategories.map((cat, idx) => {
                  const dotColor = CATEGORY_DOT_COLORS[idx % CATEGORY_DOT_COLORS.length];
                  const i18nKey = CATEGORY_I18N_KEYS[cat.category];
                  const label = i18nKey ? t(i18nKey) : cat.category;
                  return (
                    <View key={cat.category} style={styles.categoryRow}>
                      <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
                      <Text style={[styles.categoryName, { color: colors.text }]}>{label}</Text>
                      <Text style={[styles.categoryCount, { color: colors.muted }]}>
                        {cat.count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Card>
        )}

        {/* Streak Card */}
        <Card style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.streakRow}>
              <View style={[styles.streakIconBg, { backgroundColor: colors.warningBg }]}>
                <Flame size={22} color={colors.warning} />
              </View>
              <View style={styles.streakTextCol}>
                {stats.streak > 0 ? (
                  <Text style={[styles.streakText, { color: colors.text }]}>
                    {t("stats.streak", { count: stats.streak })}
                  </Text>
                ) : (
                  <Text style={[styles.streakEmpty, { color: colors.muted }]}>
                    {t("stats.streakEmpty")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Score Bar sub-component ─────────────────────────────────── */

interface ScoreBarProps {
  label: string;
  count: number;
  percentage: number;
  flex: number;
  barColor: string;
  barBg: string;
  textColor: string;
  mutedColor: string;
}

function ScoreBar({
  label,
  count,
  percentage,
  flex,
  barColor,
  barBg,
  textColor,
  mutedColor,
}: ScoreBarProps) {
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: textColor }]}>{label}</Text>
      <View style={[styles.barTrack, { backgroundColor: barBg }]}>
        <View
          style={[
            styles.barFill,
            {
              flex,
              backgroundColor: barColor,
            },
          ]}
        />
        <View style={{ flex: Math.max(1 - flex, 0) }} />
      </View>
      <Text style={[styles.barPct, { color: mutedColor }]}>
        {percentage}% ({count})
      </Text>
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenX,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    gap: 14,
  },
  card: {
    borderRadius: radius.lg,
  },
  cardInner: {
    padding: 18,
  },
  cardTitle: {
    fontFamily: fonts.display700,
    fontSize: 16,
    marginBottom: 14,
  },

  /* Summary */
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  summaryIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryBigNumber: {
    fontFamily: fonts.display800,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.5,
  },
  summaryLabel: {
    fontFamily: fonts.body500,
    fontSize: 13,
    marginTop: 2,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  monthlyLine: {
    fontFamily: fonts.body500,
    fontSize: 14,
  },

  /* Bars */
  barsContainer: {
    gap: 12,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  barLabel: {
    fontFamily: fonts.body600,
    fontSize: 13,
    width: 72,
  },
  barTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    flexDirection: "row",
    overflow: "hidden",
  },
  barFill: {
    height: 14,
    borderRadius: 7,
  },
  barPct: {
    fontFamily: fonts.body500,
    fontSize: 12,
    width: 68,
    textAlign: "right",
  },

  /* Categories */
  categoriesList: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontFamily: fonts.body500,
    fontSize: 14,
    flex: 1,
  },
  categoryCount: {
    fontFamily: fonts.body600,
    fontSize: 14,
  },

  /* Streak */
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  streakIconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  streakTextCol: {
    flex: 1,
  },
  streakText: {
    fontFamily: fonts.display700,
    fontSize: 16,
    lineHeight: 22,
  },
  streakEmpty: {
    fontFamily: fonts.body500,
    fontSize: 14,
  },

  bottomSpacer: {
    height: 40,
  },
});
