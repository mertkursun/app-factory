import { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Building2,
  Globe,
  Share2,
  Scale,
  Heart,
  Volume2,
  VolumeX,
  AlertTriangle,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useShareAnalysis } from "@/hooks/useShareAnalysis";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useAuthStore } from "@/stores/authStore";
import { generateAnalysisSummary } from "@/utils/analysisNarrator";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { ProfileWarnings } from "@/components/analysis/ProfileWarnings";
import { ExplanationCard } from "@/components/analysis/ExplanationCard";
import { AlternativesList } from "@/components/analysis/AlternativesList";
import { IngredientDetails } from "@/components/analysis/IngredientDetails";
import { UnknownIngredients } from "@/components/analysis/UnknownIngredients";
import { DisclaimerNote } from "@/components/analysis/DisclaimerNote";
import { ShareCard } from "@/components/analysis/ShareCard";
import { IconButton } from "@/components/ui/IconButton";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { ProductPickerSheet } from "@/components/compare/ProductPickerSheet";
import { useTheme, fonts, spacing, radius } from "@/theme/tokens";
import { AUDIENCE_LABEL_KEYS } from "@/lib/constants";
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

const INGREDIENT_WEIGHT = { guvenli: 100, dikkat: 35, sakincali: 0 } as const;
const FALLBACK_SCORE: Record<SkorRenk, number> = { yesil: 90, sari: 55, kirmizi: 20 };

function computeNumericScore(
  summary: { safe: number; caution: number; danger: number },
  skor: SkorRenk,
): number {
  const total = summary.safe + summary.caution + summary.danger;
  if (total === 0) return FALLBACK_SCORE[skor];

  const weighted =
    summary.safe * INGREDIENT_WEIGHT.guvenli +
    summary.caution * INGREDIENT_WEIGHT.dikkat +
    summary.danger * INGREDIENT_WEIGHT.sakincali;

  return Math.round(weighted / total);
}

function capitalize(str: string): string {
  return str.charAt(0).toLocaleUpperCase("tr-TR") + str.slice(1);
}

export default function AnalysisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: analysis, isLoading, error } = useAnalysis(id);
  const { captureRef, share, isSharing } = useShareAnalysis();
  const { speak, stop: stopSpeech, isSpeaking } = useTextToSpeech();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { data: isFavorite } = useIsFavorite(user?.id, id);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleCompareSelect = useCallback(
    (analizId: string) => {
      setPickerVisible(false);
      router.push({ pathname: "/compare", params: { id1: id, id2: analizId } });
    },
    [id, router],
  );

  const handleToggleFavorite = useCallback(() => {
    if (!user || !id || !analysis) return;
    if (isFavorite) {
      removeFavorite.mutate({ userId: user.id, analizId: id });
    } else {
      addFavorite.mutate({
        user_id: user.id,
        analiz_id: id,
        urun_adi: analysis.urun_adi,
        barkod: analysis.barkod,
        skor: analysis.skor,
      });
    }
  }, [user, id, analysis, isFavorite, addFavorite, removeFavorite]);

  const maddeler = useMemo(
    () => (analysis ? parseAnalysisMaddeler(analysis.maddeler) : []),
    [analysis],
  );

  const profilUyarilari = useMemo(
    () => (analysis ? parseProfilUyarilari(analysis.profil_uyarilari) : []),
    [analysis],
  );

  const affectedAudiences = useMemo(() => {
    const audiences = new Set<string>();
    for (const w of profilUyarilari) {
      if (w.riskSeviyesi === "sakincali" || w.riskSeviyesi === "dikkat") {
        audiences.add(w.kitle);
      }
    }
    return [...audiences];
  }, [profilUyarilari]);

  const maddeSummary = useMemo(() => {
    let safe = 0;
    let caution = 0;
    let danger = 0;
    for (const m of maddeler) {
      if (m.riskSeviyesi === "guvenli") safe++;
      else if (m.riskSeviyesi === "dikkat") caution++;
      else if (m.riskSeviyesi === "sakincali") danger++;
    }
    return { safe, caution, danger };
  }, [maddeler]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const handleSpeak = useCallback(() => {
    if (!analysis) return;
    const summary = generateAnalysisSummary(
      {
        skor: analysis.skor as SkorRenk,
        maddeSummary,
        aciklama: analysis.aciklama,
      },
      t,
    );
    speak(summary);
  }, [analysis, maddeSummary, speak, t]);

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

  const skor = analysis.skor as SkorRenk;
  const status = SKOR_TO_STATUS[skor];
  const numericScore = computeNumericScore(maddeSummary, skor);

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
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {t("analysis.result")}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon={
              isSpeaking ? (
                <VolumeX size={18} color={colors.primary} />
              ) : (
                <Volume2 size={18} color={colors.text} />
              )
            }
            onPress={handleSpeak}
            accessibilityLabel={
              isSpeaking ? t("analysis.stopSpeaking") : t("analysis.speakAnalysis")
            }
            style={{
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }}
          />
          <IconButton
            icon={
              <Heart
                size={18}
                color={isFavorite ? colors.danger : colors.text}
                fill={isFavorite ? colors.danger : "transparent"}
              />
            }
            onPress={handleToggleFavorite}
            accessibilityLabel={isFavorite ? t("favorites.removed") : t("favorites.added")}
            style={{
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }}
          />
          <IconButton
            icon={<Scale size={18} color={colors.text} />}
            onPress={() => setPickerVisible(true)}
            accessibilityLabel={t("compare.title")}
            style={{
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }}
          />
          <IconButton
            icon={
              isSharing ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Share2 size={18} color={colors.text} />
              )
            }
            onPress={share}
            accessibilityLabel={t("analysis.share")}
            style={{
              backgroundColor: colors.glass,
              borderColor: colors.glassBorder,
            }}
          />
        </View>
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
          {affectedAudiences.length > 0 && (
            <View style={styles.profileChipRow}>
              <AlertTriangle size={13} color={colors.danger} />
              <Text style={[styles.profileChipText, { color: colors.danger }]}>
                {affectedAudiences
                  .map((a) => (AUDIENCE_LABEL_KEYS[a] ? t(AUDIENCE_LABEL_KEYS[a]) : a))
                  .join(", ")}{" "}
                {t("analysis.profileScoreNote")}
              </Text>
            </View>
          )}
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

          {/* Brand & Country */}
          {analysis.marka || analysis.uretim_ulkesi ? (
            <View style={styles.metaRow}>
              {analysis.marka ? (
                <View style={styles.metaItem}>
                  <Building2 size={13} color={colors.muted} strokeWidth={2} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {analysis.marka}
                  </Text>
                </View>
              ) : null}
              {analysis.uretim_ulkesi ? (
                <View style={styles.metaItem}>
                  <Globe size={13} color={colors.muted} strokeWidth={2} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {analysis.uretim_ulkesi}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {/* Summary */}
        <ExplanationCard text={analysis.aciklama} />

        {/* Alternatives (only for sari/kirmizi) */}
        {skor === "sari" || skor === "kirmizi" ? (
          <AlternativesList data={analysis.alternatifler} />
        ) : null}

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

      {/* Offscreen ShareCard for capture */}
      <ShareCard
        ref={captureRef}
        productName={analysis.urun_adi ?? t("common.unknownProduct")}
        brand={analysis.marka ?? null}
        skor={skor}
        maddeSummary={maddeSummary}
      />

      {/* Compare product picker */}
      <ProductPickerSheet
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleCompareSelect}
        excludeId={id}
      />
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
  headerTitleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
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
  profileChipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(224,62,62,0.1)",
  },
  profileChipText: {
    fontFamily: fonts.body600,
    fontSize: 12,
    lineHeight: 16,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: fonts.body500,
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpacer: {
    height: 28,
  },
});
