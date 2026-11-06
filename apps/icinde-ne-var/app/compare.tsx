import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { toUpperTR } from "@/utils/text";
import { useCompare } from "@/hooks/useCompare";
import type { MaddeCounts } from "@/hooks/useCompare";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useTheme, fonts, spacing, radius } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";
import type { Database } from "@/lib/database.types";

type AnalysisRow = Database["public"]["Tables"]["urun_analizleri"]["Row"];
type StatusKey = "success" | "warning" | "danger";

const SKOR_TO_STATUS: Record<SkorRenk, StatusKey> = {
  yesil: "success",
  sari: "warning",
  kirmizi: "danger",
};

const INGREDIENT_WEIGHT = { guvenli: 100, dikkat: 35, sakincali: 0 } as const;
const FALLBACK_SCORE: Record<SkorRenk, number> = { yesil: 90, sari: 55, kirmizi: 20 };

function computeNumericScore(counts: MaddeCounts, skor: SkorRenk): number {
  const total = counts.safe + counts.caution + counts.danger;
  if (total === 0) return FALLBACK_SCORE[skor];
  const weighted =
    counts.safe * INGREDIENT_WEIGHT.guvenli +
    counts.caution * INGREDIENT_WEIGHT.dikkat +
    counts.danger * INGREDIENT_WEIGHT.sakincali;
  return Math.round(weighted / total);
}

const SCORE_CIRCLE_SIZE = 80;

function ProductColumn({ analysis, counts }: { analysis: AnalysisRow; counts: MaddeCounts }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const skor = analysis.skor as SkorRenk;
  const status = SKOR_TO_STATUS[skor];
  const numericScore = computeNumericScore(counts, skor);

  return (
    <View style={styles.column}>
      {/* Score */}
      <View style={styles.scoreWrap}>
        <ScoreCircle score={numericScore} status={status} size={SCORE_CIRCLE_SIZE} />
      </View>

      {/* Product name */}
      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
        {analysis.urun_adi ?? t("common.unknownProduct")}
      </Text>

      {/* Brand */}
      {analysis.marka ? (
        <Text style={[styles.brand, { color: colors.muted }]} numberOfLines={1}>
          {analysis.marka}
        </Text>
      ) : null}

      {/* Madde counts */}
      <View style={styles.badgeColumn}>
        {counts.safe > 0 ? (
          <Badge label={t("compare.safeCount", { count: counts.safe })} status="success" />
        ) : null}
        {counts.caution > 0 ? (
          <Badge label={t("compare.cautionCount", { count: counts.caution })} status="warning" />
        ) : null}
        {counts.danger > 0 ? (
          <Badge label={t("compare.dangerCount", { count: counts.danger })} status="danger" />
        ) : null}
      </View>
    </View>
  );
}

export default function CompareScreen() {
  const { id1, id2 } = useLocalSearchParams<{ id1: string; id2: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { result, isLoading, error } = useCompare(id1, id2);

  if (isLoading) {
    return <LoadingScreen message={t("common.loading")} />;
  }

  if (error || !result) {
    return (
      <ErrorScreen
        title={t("common.error")}
        message={t("common.retryMessage")}
        onRetry={() => router.back()}
      />
    );
  }

  const { analysis1, analysis2, counts1, counts2, winner } = result;

  const winnerName =
    winner === "first"
      ? (analysis1.urun_adi ?? t("common.unknownProduct"))
      : winner === "second"
        ? (analysis2.urun_adi ?? t("common.unknownProduct"))
        : null;

  const resultMessage = winnerName ? t("compare.better", { name: winnerName }) : t("compare.equal");

  const resultBg = winner === "equal" ? colors.warningBg : colors.successBg;
  const resultTextColor = winner === "equal" ? colors.warningText : colors.successText;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ChevronLeft size={18} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
          style={{
            backgroundColor: colors.glass,
            borderColor: colors.glassBorder,
          }}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("compare.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Two-column comparison */}
        <View style={styles.columnsRow}>
          <ProductColumn analysis={analysis1} counts={counts1} />

          {/* VS divider */}
          <View style={styles.vsContainer}>
            <View style={[styles.vsBadge, { backgroundColor: colors.surfaceTint }]}>
              <Text style={[styles.vsText, { color: colors.primaryDeep }]}>
                {toUpperTR(t("compare.vsLabel"))}
              </Text>
            </View>
          </View>

          <ProductColumn analysis={analysis2} counts={counts2} />
        </View>

        {/* Result card */}
        <Card style={[styles.resultCard, { backgroundColor: resultBg }]}>
          <View style={styles.resultInner}>
            <Text style={[styles.resultLabel, { color: resultTextColor }]}>
              {toUpperTR(t("compare.result"))}
            </Text>
            <Text style={[styles.resultMessage, { color: resultTextColor }]}>{resultMessage}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 40,
    gap: 20,
  },
  columnsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
  scoreWrap: {
    alignItems: "center",
    marginBottom: 4,
  },
  productName: {
    fontFamily: fonts.display700,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    letterSpacing: -0.2,
    paddingHorizontal: 4,
  },
  brand: {
    fontFamily: fonts.body500,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  badgeColumn: {
    gap: 6,
    alignItems: "center",
    marginTop: 4,
  },
  vsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 36,
    width: 40,
  },
  vsBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  vsText: {
    fontFamily: fonts.body800,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  resultCard: {
    borderWidth: 0,
    marginTop: 4,
  },
  resultInner: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 6,
  },
  resultLabel: {
    fontFamily: fonts.body800,
    fontSize: 11,
    letterSpacing: 1,
  },
  resultMessage: {
    fontFamily: fonts.display700,
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
  },
});
