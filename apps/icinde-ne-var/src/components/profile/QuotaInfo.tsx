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
          shadow.card,
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
        shadow.card,
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
          {/* Inner surface circle */}
          <View style={[styles.ringInner, { backgroundColor: colors.surface }]}>
            <Text style={[styles.ringUsed, { color: colors.text }]}>{used}</Text>
            <Text style={[styles.ringTotal, { color: colors.muted }]}>/ {total}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            {t("profile.monthlyQuota")}
          </Text>
          <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
            {t("profile.quotaDesc")}
          </Text>
        </View>

        {/* Pro pill */}
        <Pressable
          onPress={() => router.push("/paywall")}
          accessibilityRole="button"
          accessibilityLabel={t("profile.goToPro")}
          style={({ pressed }) => [
            styles.proPill,
            { backgroundColor: colors.text, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.proPillText, { color: colors.background }]}>
            {t("profile.goToPro")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
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
  ringInner: {
    position: "absolute",
    width: RING_SIZE - 14,
    height: RING_SIZE - 14,
    borderRadius: (RING_SIZE - 14) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ringUsed: {
    fontFamily: fonts.display800,
    fontSize: 17,
    lineHeight: 17,
    letterSpacing: -0.5,
  },
  ringTotal: {
    fontFamily: fonts.body600,
    fontSize: 9,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    gap: 3,
  },
  infoTitle: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  infoDesc: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 17.4,
  },
  proPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
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
