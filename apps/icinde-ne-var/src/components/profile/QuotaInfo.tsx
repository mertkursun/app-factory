import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Crown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";
import { FREE_MONTHLY_QUOTA } from "@/lib/constants";

interface QuotaInfoProps {
  used: number;
  remaining: number;
  isPro: boolean;
}

const RING_SIZE = 64;
const RING_STROKE = 5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function QuotaInfo({ used, remaining, isPro }: QuotaInfoProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const router = useRouter();

  if (isPro) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          shadow.low,
        ]}
      >
        <View style={styles.proContent}>
          <Crown size={22} color={colors.primary} />
          <Text style={[styles.proTitle, { color: colors.text }]}>{t("profile.unlimited")}</Text>
          <Text style={[styles.proDesc, { color: colors.muted }]}>{t("profile.proActive")}</Text>
        </View>
      </View>
    );
  }

  const total = FREE_MONTHLY_QUOTA;
  const progress = total > 0 ? Math.min(used / total, 1) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        shadow.low,
      ]}
    >
      <View style={styles.row}>
        {/* Conic ring */}
        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            {/* Track */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.border}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            {/* Progress */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={remaining <= 1 ? colors.danger : colors.primary}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              rotation={-90}
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringText}>
            <Text style={[styles.ringUsed, { color: colors.text }]}>{used}</Text>
            <Text style={[styles.ringSep, { color: colors.muted }]}>/</Text>
            <Text style={[styles.ringTotal, { color: colors.muted }]}>{total}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {t("profile.monthlyQuota")}
          </Text>
          <Text style={[styles.infoDesc, { color: colors.muted }]}>{t("profile.quotaDesc")}</Text>
        </View>

        {/* Pro pill */}
        <Pressable
          onPress={() => router.push("/paywall")}
          accessibilityRole="button"
          accessibilityLabel={t("profile.goToPro")}
          style={({ pressed }) => [
            styles.proPill,
            { backgroundColor: colors.surfaceTint, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Crown size={12} color={colors.primary} />
          <Text style={[styles.proPillText, { color: colors.primary }]}>
            {t("profile.goToPro")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  ringUsed: {
    fontFamily: fonts.display800,
    fontSize: 16,
  },
  ringSep: {
    fontFamily: fonts.body400,
    fontSize: 12,
    marginHorizontal: 1,
  },
  ringTotal: {
    fontFamily: fonts.body400,
    fontSize: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontFamily: fonts.display700,
    fontSize: 14,
  },
  infoDesc: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 17,
  },
  proPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    minHeight: 32,
  },
  proPillText: {
    fontFamily: fonts.body700,
    fontSize: 12,
  },
  proContent: {
    alignItems: "center",
    gap: 8,
  },
  proTitle: {
    fontFamily: fonts.display800,
    fontSize: 22,
  },
  proDesc: {
    fontFamily: fonts.body500,
    fontSize: 12,
  },
});
