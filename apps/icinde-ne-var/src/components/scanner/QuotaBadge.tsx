import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import { useQuota } from "@/hooks/useQuota";
import { useAuthStore } from "@/stores/authStore";
import { fonts } from "@/theme/tokens";
import { FREE_MONTHLY_QUOTA } from "@/lib/constants";

const RING_SIZE = 20;
const RING_STROKE = 2.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function QuotaBadge() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: quota } = useQuota(userId);
  const router = useRouter();

  if (!quota) return null;

  if (quota.isPro) {
    return (
      <Pressable
        onPress={() => router.push("/paywall")}
        accessibilityRole="button"
        accessibilityLabel="Pro"
        style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={styles.proText}>PRO</Text>
      </Pressable>
    );
  }

  const total = FREE_MONTHLY_QUOTA;
  const used = quota.used;
  const progress = total > 0 ? Math.min(used / total, 1) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Pressable
      onPress={() => router.push("/paywall")}
      accessibilityRole="button"
      accessibilityLabel={`${used}/${total}`}
      style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.ringContainer}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Track */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="#5EEAD4"
            strokeWidth={RING_STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
      </View>
      <Text style={styles.quotaText}>
        {used}/{total}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingLeft: 7,
    paddingRight: 12,
    paddingVertical: 6,
    minHeight: 44,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
  },
  quotaText: {
    fontFamily: fonts.body700,
    fontSize: 12,
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"] as const,
  },
  proText: {
    fontFamily: fonts.display800,
    fontSize: 12,
    color: "#5EEAD4",
    letterSpacing: 1,
  },
});
