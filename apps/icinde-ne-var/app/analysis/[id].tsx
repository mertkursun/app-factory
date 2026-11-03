import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Share2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAnalysis } from "@/hooks/useAnalysis";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { ProfileWarnings } from "@/components/analysis/ProfileWarnings";
import { ExplanationCard } from "@/components/analysis/ExplanationCard";
import { IngredientDetails } from "@/components/analysis/IngredientDetails";
import { UnknownIngredients } from "@/components/analysis/UnknownIngredients";
import { DisclaimerNote } from "@/components/analysis/DisclaimerNote";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useTheme, fonts, spacing } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

type StatusKey = "success" | "warning" | "danger";

interface AnalysisMadde {
  maddeId: string | null;
  ad: string;
  riskSeviyesi: string;
  islev: string | null;
  kaynak: string | null;
  aiTahmini: boolean;
}

interface ProfilUyarisi {
  kitle: string;
  maddeAd: string;
  riskSeviyesi: string;
  aciklama: string;
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

const CATEGORY_BADGE_STATUS: Record<string, StatusKey> = {
  gida: "success",
  kozmetik: "warning",
  temizlik: "warning",
  genel: "success",
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

  const maddeler = (analysis.maddeler as AnalysisMadde[] | null) ?? [];
  const profilUyarilari = (analysis.profil_uyarilari as ProfilUyarisi[] | null) ?? [];
  const skor = analysis.skor as SkorRenk;
  const status = SKOR_TO_STATUS[skor];
  const numericScore = SKOR_NUMERIC[skor];

  const statusColorMap: Record<StatusKey, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };
  const haloColor = statusColorMap[status];

  const categoryLabel = capitalize(analysis.kategori);
  const categoryBadgeStatus = CATEGORY_BADGE_STATUS[analysis.kategori] ?? "success";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Status halo (decorative) */}
      <View
        style={[
          styles.halo,
          {
            backgroundColor: haloColor,
            opacity: 0.08,
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={20} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel={t("common.back")}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {t("analysis.result")}
        </Text>
        <IconButton
          icon={<Share2 size={18} color={colors.text} />}
          onPress={() => {}}
          accessibilityLabel={t("analysis.share")}
        />
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
            <Badge label={categoryLabel} status={categoryBadgeStatus} />
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
        {analysis.bilinmeyenler.length > 0 ? (
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
    top: -60,
    left: "25%",
    width: "50%",
    height: 200,
    borderRadius: 100,
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
    textAlign: "center",
    fontFamily: fonts.body700,
    fontSize: 17,
    lineHeight: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productInfo: {
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  productName: {
    fontFamily: fonts.display800,
    fontSize: 21,
    lineHeight: 28,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barcodeText: {
    fontFamily: fonts.body500,
    fontSize: 11,
    lineHeight: 16,
    fontVariant: ["tabular-nums"],
  },
  bottomSpacer: {
    height: 32,
  },
});
