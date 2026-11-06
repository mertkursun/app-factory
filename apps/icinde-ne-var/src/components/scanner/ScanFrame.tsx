import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

const FRAME_SIZE = 220;
const BRACKET_LENGTH = 18;
const STROKE_WIDTH = 5;
const BRACKET_COLOR = "#5EEAD4";
const SCAN_LINE_DURATION_MS = 2600;

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const size = BRACKET_LENGTH + STROKE_WIDTH;
  const half = STROKE_WIDTH / 2;

  const pathMap: Record<string, string> = {
    tl: `M ${half} ${BRACKET_LENGTH + half} L ${half} ${half} L ${BRACKET_LENGTH + half} ${half}`,
    tr: `M ${size - BRACKET_LENGTH - half} ${half} L ${size - half} ${half} L ${size - half} ${BRACKET_LENGTH + half}`,
    bl: `M ${half} ${size - BRACKET_LENGTH - half} L ${half} ${size - half} L ${BRACKET_LENGTH + half} ${size - half}`,
    br: `M ${size - BRACKET_LENGTH - half} ${size - half} L ${size - half} ${size - half} L ${size - half} ${size - BRACKET_LENGTH - half}`,
  };

  const positionStyle = {
    tl: { top: -STROKE_WIDTH / 2, left: -STROKE_WIDTH / 2 },
    tr: { top: -STROKE_WIDTH / 2, right: -STROKE_WIDTH / 2 },
    bl: { bottom: -STROKE_WIDTH / 2, left: -STROKE_WIDTH / 2 },
    br: { bottom: -STROKE_WIDTH / 2, right: -STROKE_WIDTH / 2 },
  };

  return (
    <View style={[styles.bracketContainer, positionStyle[position]]}>
      <Svg width={size} height={size}>
        <Path
          d={pathMap[position]}
          stroke={BRACKET_COLOR}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export function ScanFrame() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(FRAME_SIZE - 4, {
        duration: SCAN_LINE_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [translateY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.frame}>
      {/* Radial teal glow */}
      <View style={styles.glow} />

      {/* Corner brackets */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Scan line */}
      <Animated.View style={[styles.scanLine, scanLineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
  },
  bracketContainer: {
    position: "absolute",
  },
  glow: {
    position: "absolute",
    top: -30,
    left: -30,
    right: -30,
    bottom: -30,
    borderRadius: 110,
    backgroundColor: "rgba(45,212,191,0.18)",
    shadowColor: "#5EEAD4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: BRACKET_COLOR,
    borderRadius: 2,
    shadowColor: BRACKET_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
});
