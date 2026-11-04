import { View, Text, StyleSheet } from "react-native";
import { forwardRef } from "react";
import ViewShot, { type ViewShotRef } from "react-native-view-shot";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

// ── Types ──────────────────────────────────────────────────────────

type StatusKey = "success" | "warning" | "danger";

interface MaddeSummary {
  safe: number;
  caution: number;
  danger: number;
}

interface ShareCardProps {
  productName: string;
  brand: string | null;
  skor: SkorRenk;
  maddeSummary: MaddeSummary;
}

// ── Constants ──────────────────────────────────────────────────────

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;
const SCORE_SIZE = 240;
const RING_WIDTH = 20;

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

// ── Component ──────────────────────────────────────────────────────

export const ShareCard = forwardRef<ViewShotRef, ShareCardProps>(function ShareCard(
  { productName, brand, skor, maddeSummary },
  ref,
) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const status = SKOR_TO_STATUS[skor];
  const numericScore = SKOR_NUMERIC[skor];

  const statusColorMap: Record<StatusKey, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  const statusBgMap: Record<StatusKey, string> = {
    success: colors.successBg,
    warning: colors.warningBg,
    danger: colors.dangerBg,
  };

  const scoreLabelMap: Record<StatusKey, string> = {
    success: t("analysis.shareScoreSafe"),
    warning: t("analysis.shareScoreCaution"),
    danger: t("analysis.shareScoreDanger"),
  };

  const statusColor = statusColorMap[status];
  const statusBg = statusBgMap[status];
  const scoreLabel = scoreLabelMap[status];

  const ringRadius = (SCORE_SIZE - RING_WIDTH) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - numericScore / 100);
  const innerSize = SCORE_SIZE - RING_WIDTH * 2;

  const summaryParts: string[] = [];
  if (maddeSummary.safe > 0) {
    summaryParts.push(t("analysis.safeCount", { count: maddeSummary.safe }));
  }
  if (maddeSummary.caution > 0) {
    summaryParts.push(t("analysis.cautionCount", { count: maddeSummary.caution }));
  }
  if (maddeSummary.danger > 0) {
    summaryParts.push(t("analysis.dangerCount", { count: maddeSummary.danger }));
  }
  const summaryText = summaryParts.join(" · ");

  return (
    <ViewShot
      ref={ref}
      options={{ format: "png", quality: 1, width: CARD_WIDTH, height: CARD_HEIGHT }}
      style={styles.offscreen}
    >
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        {/* Status glow background */}
        <View style={[styles.glowBg, { backgroundColor: statusColor, opacity: 0.12 }]} />

        {/* App name header */}
        <View style={styles.headerRow}>
          <View style={[styles.appBadge, { backgroundColor: colors.surfaceTint }]}>
            <Text style={[styles.appName, { color: colors.primary }]}>{t("common.appName")}</Text>
          </View>
        </View>

        {/* Product info */}
        <View style={styles.productSection}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {productName}
          </Text>
          {brand ? <Text style={[styles.brand, { color: colors.muted }]}>{brand}</Text> : null}
        </View>

        {/* Score circle */}
        <View style={styles.scoreSection}>
          <View
            style={[styles.scoreContainer, { backgroundColor: statusBg, borderColor: statusColor }]}
          >
            <View style={styles.scoreCircleWrapper}>
              <Svg width={SCORE_SIZE} height={SCORE_SIZE}>
                <Defs>
                  <LinearGradient id="shareGloss" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="rgba(255,255,255,0.3)" />
                    <Stop offset="1" stopColor="rgba(0,0,0,0.08)" />
                  </LinearGradient>
                </Defs>

                {/* Track */}
                <Circle
                  cx={SCORE_SIZE / 2}
                  cy={SCORE_SIZE / 2}
                  r={ringRadius}
                  stroke={colors.border}
                  strokeWidth={RING_WIDTH}
                  fill="none"
                  opacity={0.5}
                />

                {/* Score arc */}
                <Circle
                  cx={SCORE_SIZE / 2}
                  cy={SCORE_SIZE / 2}
                  r={ringRadius}
                  stroke={statusColor}
                  strokeWidth={RING_WIDTH}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation={-90}
                  origin={`${SCORE_SIZE / 2}, ${SCORE_SIZE / 2}`}
                />

                {/* Gloss overlay */}
                <Circle
                  cx={SCORE_SIZE / 2}
                  cy={SCORE_SIZE / 2}
                  r={ringRadius}
                  stroke="url(#shareGloss)"
                  strokeWidth={RING_WIDTH}
                  fill="none"
                />
              </Svg>

              {/* Inner content */}
              <View
                style={[
                  styles.scoreInner,
                  {
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize / 2,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text style={[styles.scoreNumber, { color: statusColor }]}>{numericScore}</Text>
              </View>
            </View>

            {/* Score label */}
            <Text style={[styles.scoreLabel, { color: statusColor }]}>{scoreLabel}</Text>
          </View>
        </View>

        {/* Summary */}
        {summaryText.length > 0 ? (
          <View style={styles.summarySection}>
            <View style={[styles.summaryBadge, { backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {summaryText}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.footerText, { color: colors.muted }]}>
            {t("analysis.shareFooter")}
          </Text>
        </View>
      </View>
    </ViewShot>
  );
});

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  offscreen: {
    position: "absolute",
    left: -9999,
    top: -9999,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 80,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  glowBg: {
    position: "absolute",
    top: -200,
    left: -100,
    right: -100,
    height: 600,
    borderRadius: 300,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  appBadge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: radius.pill,
  },
  appName: {
    fontFamily: fonts.display700,
    fontSize: 36,
    letterSpacing: -0.5,
  },
  productSection: {
    gap: 12,
    marginTop: 20,
  },
  productName: {
    fontFamily: fonts.display800,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1.5,
  },
  brand: {
    fontFamily: fonts.body500,
    fontSize: 34,
    lineHeight: 40,
  },
  scoreSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 80,
    borderRadius: radius.xl,
    borderWidth: 2,
    gap: 20,
  },
  scoreCircleWrapper: {
    width: SCORE_SIZE,
    height: SCORE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreInner: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontFamily: fonts.display800,
    fontSize: 80,
    lineHeight: 80,
    letterSpacing: -4,
  },
  scoreLabel: {
    fontFamily: fonts.body800,
    fontSize: 32,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  summarySection: {
    alignItems: "center",
  },
  summaryBadge: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: radius.pill,
  },
  summaryText: {
    fontFamily: fonts.body600,
    fontSize: 30,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    gap: 20,
  },
  footerDivider: {
    width: 120,
    height: 2,
    borderRadius: 1,
  },
  footerText: {
    fontFamily: fonts.body500,
    fontSize: 28,
    textAlign: "center",
  },
});
