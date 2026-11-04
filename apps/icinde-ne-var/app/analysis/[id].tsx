import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAnalysis } from "@/hooks/useAnalysis";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { ProfileWarnings } from "@/components/analysis/ProfileWarnings";
import { ExplanationCard } from "@/components/analysis/ExplanationCard";
import { IngredientDetails } from "@/components/analysis/IngredientDetails";
import { UnknownIngredients } from "@/components/analysis/UnknownIngredients";
import { DisclaimerNote } from "@/components/analysis/DisclaimerNote";
import { IconButton } from "@/components/ui/IconButton";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useTheme, fonts, spacing } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

type StatusKey = "success" | "warning" | "danger";

const analysisMaddeSchema = z.object({
  maddeId: z.string().nullable(),
  ad: z.string(),
  riskSeviyesi: z.string(),
  islev: z.string().nullable(),
  kaynak: z.string().nullable(),
  aiTahmini: z.boolean(),
});

const profilUyarisiSchema = z.object({
  kitle: z.string(),
  maddeAd: z.string(),
  riskSeviyesi: z.string(),
  aciklama: z.string(),
});

type AnalysisMadde = z.infer<typeof analysisMaddeSchema>;
type ProfilUyarisi = z.infer<typeof profilUyarisiSchema>;

function parseAnalysisMaddeler(data: unknown): AnalysisMadde[] {
  const result = z.array(analysisMaddeSchema).safeParse(data);
  return result.success ? result.data : [];
}

function parseProfilUyarilari(data: unknown): ProfilUyarisi[] {
  const result = z.array(profilUyarisiSchema).safeParse(data);
  return result.success ? result.data : [];
}

const SKOR_TO_STATUS: Record<SkorRenk, StatusKey> = {
  yesil: "success",
  sari: "warning",
  kirmizi: "danger",
};

const SKOR_NUMERIC: Record<SkorRenk, number> = {
  yesil: 86,
  sari: 58,
  kirmizi: 25,
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function AnalysisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data: analysis, isLoading, error } = useAnalysis(id);

  if (isLoading) {
    return <LoadingScreen message={t("analysis.loading")} />;
  }

  if (error || !analysis) {
    return (
      <ErrorScreen
        title={t("analysis.notFound")}
        message={t("analysis.errorMessage")}
        onRetry={() => router.back()}
      />
    );
  }

  const maddeler = parseAnalysisMaddeler(analysis.maddeler);
  const profilUyarilari = parseProfilUyarilari(analysis.profil_uyarilari);
  const skor = analysis.skor as SkorRenk;
  const status = SKOR_TO_STATUS[skor];
  const numericScore = SKOR_NUMERIC[skor];

  const statusColorMap: Record<StatusKey, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };
  const haloColor = statusColorMap[status];

  const categoryBadgeLabel = capitalize(analysis.kategori);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Status halo (large blurred glow) */}
      <View style={[styles.halo, { backgroundColor: haloColor }]} />

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
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {t("analysis.result")}
        </Text>
        {/* TODO: Share functionality - add when implemented */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile warnings */}
        {profilUyarilari.length > 0 ? <ProfileWarnings warnings={profilUyarilari} /> : null}

        {/* Score circle */}
        <View style={styles.scoreContainer}>
          <ScoreCircle score={numericScore} status={status} />
        </View>

        {/* Product info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {analysis.urun_adi ?? t("common.unknownProduct")}
          </Text>
          <View style={styles.productMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.surfaceTint }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.primaryDeep }]}>
                {categoryBadgeLabel}
              </Text>
            </View>
            {analysis.barkod ? (
              <Text style={[styles.barcodeText, { color: colors.muted }]}>{analysis.barkod}</Text>
            ) : null}
          </View>
        </View>

        {/* Summary */}
        <ExplanationCard text={analysis.aciklama} />

        {/* Ingredients */}
        <IngredientDetails maddeler={maddeler} />

        {/* Unknown ingredients */}
        {analysis.bilinmeyenler?.length > 0 ? (
          <UnknownIngredients items={analysis.bilinmeyenler} />
        ) : null}

        {/* Disclaimer */}
        <DisclaimerNote />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  halo: {
    position: "absolute",
    top: -120,
    left: -60,
    right: -60,
    height: 380,
    borderRadius: 190,
    opacity: 0.55,
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
    gap: 14,
    paddingBottom: 28,
  },
  scoreContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  productInfo: {
    alignItems: "center",
    gap: 8,
  },
  productName: {
    fontFamily: fonts.display800,
    fontSize: 21,
    lineHeight: 24,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontFamily: fonts.body700,
    fontSize: 11,
  },
  barcodeText: {
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 16,
    fontVariant: ["tabular-nums"],
  },
  bottomSpacer: {
    height: 28,
  },
});
