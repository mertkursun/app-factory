import { View, Text } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme, fonts } from "@/theme/tokens";
import { useTranslation } from "react-i18next";
import { toUpperTR } from "@/utils/text";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ScoreStatus = "success" | "warning" | "danger";

interface ScoreCircleProps {
  score: number;
  status: ScoreStatus;
  size?: number;
}

const RING_WIDTH = 14;
const OUTER_SIZE = 168;

export function ScoreCircle({ score, status, size = OUTER_SIZE }: ScoreCircleProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const statusColorMap: Record<ScoreStatus, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  const statusColor = statusColorMap[status];
  const progress = useSharedValue(0);

  const ringRadius = (size - RING_WIDTH) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const innerSize = size - RING_WIDTH * 2;

  useEffect(() => {
    progress.value = withDelay(
      200,
      withTiming(score / 100, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const statusLabel: Record<ScoreStatus, string> = {
    success: t("analysis.safe"),
    warning: t("analysis.caution"),
    danger: t("analysis.danger"),
  };

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Glow */}
      <View
        style={{
          position: "absolute",
          width: size - 28,
          height: size - 28,
          borderRadius: (size - 28) / 2,
          backgroundColor: statusColor,
          opacity: 0.15,
          shadowColor: statusColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.55,
          shadowRadius: 25,
        }}
      />

      {/* SVG Ring */}
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Defs>
          <LinearGradient id="glossGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="rgba(255,255,255,0.45)" />
            <Stop offset="0.45" stopColor="rgba(255,255,255,0)" />
            <Stop offset="1" stopColor="rgba(0,0,0,0.12)" />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={ringRadius}
          stroke={colors.border}
          strokeWidth={RING_WIDTH}
          fill="none"
        />

        {/* Score arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={ringRadius}
          stroke={statusColor}
          strokeWidth={RING_WIDTH}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Gloss overlay */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={ringRadius}
          stroke="url(#glossGrad)"
          strokeWidth={RING_WIDTH}
          fill="none"
        />
      </Svg>

      {/* Inner circle */}
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.display800,
            fontSize: 54,
            lineHeight: 54,
            letterSpacing: -3,
            color: statusColor,
          }}
        >
          {score}
        </Text>
        <Text
          style={{
            fontFamily: fonts.body800,
            fontSize: 12,
            letterSpacing: 1.2,
            color: statusColor,
            marginTop: 2,
          }}
        >
          {toUpperTR(statusLabel[status])}
        </Text>
      </View>
    </View>
  );
}
