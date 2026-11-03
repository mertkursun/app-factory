import { useCallback, useEffect } from "react";
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useTheme, fonts } from "@/theme/tokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/* ── Timing cues (seconds → ms) from splash-anim.jsx ── */
const CUE_YAPRAK = 1100;
const CUE_NOKTALAR = 1900;
const CUE_ISIM = 2800;
const CUE_CIKIS = 5100;
const TOTAL_DURATION = 5700;

const RING_CIRCUMFERENCE = 2 * Math.PI * 31;
const HANDLE_LENGTH = Math.hypot(25, 25);
const VEIN_LENGTH = 22;

const ENTER = Easing.out(Easing.cubic);
const DRAW = Easing.inOut(Easing.cubic);
const POP = Easing.bezier(0.34, 1.56, 0.64, 1);

const DOT_SIZE = 9;
const LOGO_SCALE = 86 / 120;

/* ── 165deg gradient direction ── */
const DEG_165 = (165 * Math.PI) / 180;
const GRAD_START = {
  x: 0.5 - 0.5 * Math.sin(DEG_165),
  y: 0.5 + 0.5 * Math.cos(DEG_165),
};
const GRAD_END = {
  x: 0.5 + 0.5 * Math.sin(DEG_165),
  y: 0.5 - 0.5 * Math.cos(DEG_165),
};

interface SplashAnimationProps {
  onFinish: () => void;
}

export function SplashAnimation({ onFinish }: SplashAnimationProps) {
  const { width, height } = useWindowDimensions();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const C = isDark
    ? {
        ring: "#5EEAD4",
        leaf: "#2DD4BF",
        vein: "#0A1514",
        ok: "#3BD98A",
        wa: "#F5C242",
        no: "#F36B6B",
        tile: "rgba(45,212,191,0.08)",
        tileBorder: "rgba(94,234,212,0.22)",
        glow: "rgba(45,212,191,0.28)",
        ringLine: "rgba(94,234,212,0.12)",
        title: "#F1F5F3",
        tag: "rgba(241,245,243,0.66)",
        pillBg: "rgba(94,234,212,0.12)",
        pillBorder: "rgba(94,234,212,0.18)",
        pillText: "rgba(241,245,243,0.85)",
        spinnerTrack: "rgba(241,245,243,0.35)",
        spinnerHead: "#F1F5F3",
      }
    : {
        ring: "#FFFFFF",
        leaf: "#9BF0E3",
        vein: "#0B6E66",
        ok: "#6EE7A8",
        wa: "#FBD36A",
        no: "#FF8A8A",
        tile: "rgba(255,255,255,0.14)",
        tileBorder: "rgba(255,255,255,0.28)",
        glow: "rgba(94,234,212,0.35)",
        ringLine: "rgba(255,255,255,0.12)",
        title: "#FFFFFF",
        tag: "rgba(255,255,255,0.72)",
        pillBg: "rgba(255,255,255,0.12)",
        pillBorder: "rgba(255,255,255,0.18)",
        pillText: "rgba(255,255,255,0.85)",
        spinnerTrack: "rgba(255,255,255,0.35)",
        spinnerHead: "#FFFFFF",
      };

  /* ── Shared values ── */
  const tileOpacity = useSharedValue(0);
  const tileScale = useSharedValue(0.7);
  const ringProgress = useSharedValue(0);
  const handleProgress = useSharedValue(0);
  const leafScale = useSharedValue(0);
  const veinProgress = useSharedValue(0);
  const dot0 = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(28);
  const tagOpacity = useSharedValue(0);
  const tagTranslateY = useSharedValue(20);
  const ambientRingsScale = useSharedValue(0.86);
  const ambientRingsOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const driftY = useSharedValue(0);
  const exitOpacity = useSharedValue(1);
  const spinnerRotation = useSharedValue(0);

  const startAnimations = useCallback(() => {
    /* Ambient rings expand */
    ambientRingsScale.value = withTiming(1, { duration: 1600, easing: ENTER });
    ambientRingsOpacity.value = withTiming(1, { duration: 800, easing: ENTER });

    /* Glow pulse 4s loop */
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );

    /* Spinner rotation loop */
    spinnerRotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
    );

    /* Halka: tile pops, ring + handle draw */
    tileOpacity.value = withTiming(1, { duration: 350, easing: ENTER });
    tileScale.value = withTiming(1, { duration: 700, easing: POP });
    ringProgress.value = withDelay(150, withTiming(1, { duration: 800, easing: DRAW }));
    handleProgress.value = withDelay(750, withTiming(1, { duration: 500, easing: DRAW }));

    /* Yaprak: leaf grows, vein draws */
    leafScale.value = withDelay(CUE_YAPRAK + 50, withTiming(1, { duration: 600, easing: POP }));
    veinProgress.value = withDelay(
      CUE_YAPRAK + 350,
      withTiming(1, { duration: 400, easing: DRAW }),
    );

    /* Noktalar: staggered dot drops */
    dot0.value = withDelay(CUE_NOKTALAR, withTiming(1, { duration: 500, easing: POP }));
    dot1.value = withDelay(CUE_NOKTALAR + 140, withTiming(1, { duration: 500, easing: POP }));
    dot2.value = withDelay(CUE_NOKTALAR + 280, withTiming(1, { duration: 500, easing: POP }));

    /* Isim: title + tagline rise */
    titleOpacity.value = withDelay(CUE_ISIM, withTiming(1, { duration: 500, easing: ENTER }));
    titleTranslateY.value = withDelay(CUE_ISIM, withTiming(0, { duration: 700, easing: ENTER }));
    tagOpacity.value = withDelay(CUE_ISIM + 200, withTiming(1, { duration: 500, easing: ENTER }));
    tagTranslateY.value = withDelay(
      CUE_ISIM + 200,
      withTiming(0, { duration: 700, easing: ENTER }),
    );

    /* Drift: whole piece drifts up from Isim cue */
    driftY.value = withDelay(
      CUE_ISIM,
      withTiming(-26, { duration: TOTAL_DURATION - CUE_ISIM, easing: ENTER }),
    );

    /* Cikis: fade out content */
    exitOpacity.value = withDelay(CUE_CIKIS, withTiming(0, { duration: 550, easing: ENTER }));
  }, [
    tileOpacity,
    tileScale,
    ringProgress,
    handleProgress,
    leafScale,
    veinProgress,
    dot0,
    dot1,
    dot2,
    titleOpacity,
    titleTranslateY,
    tagOpacity,
    tagTranslateY,
    ambientRingsScale,
    ambientRingsOpacity,
    glowScale,
    driftY,
    exitOpacity,
    spinnerRotation,
  ]);

  useEffect(() => {
    startAnimations();
    const timer = setTimeout(onFinish, TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, [startAnimations, onFinish]);

  /* ── Animated props for SVG ── */
  const ringAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_CIRCUMFERENCE * (1 - ringProgress.value),
  }));

  const handleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: HANDLE_LENGTH * (1 - handleProgress.value),
    opacity: handleProgress.value > 0.01 ? 1 : 0,
  }));

  const veinAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: VEIN_LENGTH * (1 - veinProgress.value),
  }));

  /* ── Animated styles ── */
  const tileStyle = useAnimatedStyle(() => ({
    opacity: tileOpacity.value,
    transform: [{ scale: tileScale.value }],
  }));

  const leafStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leafScale.value }],
  }));

  const useDotStyle = (sv: { value: number }) =>
    useAnimatedStyle(() => ({
      opacity: interpolate(sv.value, [0, 0.3], [0, 1]),
      transform: [
        { translateY: interpolate(sv.value, [0, 1], [-34 * LOGO_SCALE, 0]) },
        { scaleY: interpolate(sv.value, [0.6, 1], [1.25, 1]) },
      ],
    }));

  const dot0Style = useDotStyle(dot0);
  const dot1Style = useDotStyle(dot1);
  const dot2Style = useDotStyle(dot2);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: tagTranslateY.value }],
  }));

  const ringsStyle = useAnimatedStyle(() => ({
    opacity: ambientRingsOpacity.value,
    transform: [{ scale: ambientRingsScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: driftY.value }],
  }));

  const exitStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinnerRotation.value}deg` }],
  }));

  const gradientColors: [string, string, string] = isDark
    ? ["#17403A", "#0E1918", "#0A1514"]
    : ["#1CB9A7", "#0F8E83", "#0A5B55"];

  const centerY = height * 0.38;

  return (
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={onFinish}
      accessibilityLabel={t("splash.title")}
    >
      <LinearGradient
        colors={gradientColors}
        locations={isDark ? [0, 0.5, 1] : [0, 0.45, 1]}
        start={isDark ? { x: 0.5, y: 0 } : GRAD_START}
        end={isDark ? { x: 0.5, y: 1 } : GRAD_END}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[StyleSheet.absoluteFill, exitStyle]}>
          {/* Ambient rings */}
          <Animated.View
            style={[
              styles.ring,
              {
                width: 420,
                height: 420,
                borderRadius: 210,
                borderColor: C.ringLine,
                left: width / 2 - 210,
                top: centerY - 210,
              },
              ringsStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              {
                width: 300,
                height: 300,
                borderRadius: 150,
                borderColor: C.ringLine,
                left: width / 2 - 150,
                top: centerY - 150,
              },
              ringsStyle,
            ]}
          />

          {/* Teal radial glow */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: 130,
                backgroundColor: C.glow,
                left: width / 2 - 130,
                top: centerY - 130,
              },
              glowStyle,
            ]}
          />

          {/* Drifting content group */}
          <Animated.View style={[StyleSheet.absoluteFill, driftStyle]}>
            {/* Glass tile + Logo SVG */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: centerY - 66,
                alignItems: "center",
              }}
            >
              <Animated.View
                style={[
                  styles.tile,
                  { backgroundColor: C.tile, borderColor: C.tileBorder },
                  tileStyle,
                ]}
              >
                {/* Inset top glass shine */}
                <View style={styles.tileShine} />

                {/* Logo SVG */}
                <Svg width={86} height={86} viewBox="0 0 120 120">
                  <Defs>
                    <SvgLinearGradient id="splashRing" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={C.ring} />
                      <Stop offset="1" stopColor={C.ring} />
                    </SvgLinearGradient>
                  </Defs>

                  <Circle cx={50} cy={50} r={26} fill={C.ring} opacity={0.12} />

                  <AnimatedCircle
                    cx={50}
                    cy={50}
                    r={31}
                    stroke={C.ring}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    animatedProps={ringAnimatedProps}
                    rotation={-90}
                    origin="50, 50"
                  />

                  <AnimatedPath
                    d="M74 74 L99 99"
                    stroke={C.ring}
                    strokeWidth={13}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={HANDLE_LENGTH}
                    animatedProps={handleAnimatedProps}
                  />
                </Svg>

                {/* Leaf overlay */}
                <Animated.View style={[styles.leafOverlay, leafStyle]} pointerEvents="none">
                  <Svg width={86} height={86} viewBox="0 0 120 120">
                    <Path
                      d="M50 26 C63 30 69 43 64 55 C53 57 41 50 41 37 C43 31 46 27 50 26 Z"
                      fill={C.leaf}
                    />
                    <AnimatedPath
                      d="M46 50 C52 44 58 38 62 32"
                      stroke={C.vein}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={VEIN_LENGTH}
                      animatedProps={veinAnimatedProps}
                    />
                  </Svg>
                </Animated.View>

                {/* Dots */}
                <View style={styles.dotsContainer} pointerEvents="none">
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: C.ok,
                        left: 37 * LOGO_SCALE - DOT_SIZE / 2,
                        top: 61 * LOGO_SCALE - DOT_SIZE / 2,
                      },
                      dot0Style,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: C.wa,
                        left: 50 * LOGO_SCALE - DOT_SIZE / 2,
                        top: 65 * LOGO_SCALE - DOT_SIZE / 2,
                      },
                      dot1Style,
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: C.no,
                        left: 63 * LOGO_SCALE - DOT_SIZE / 2,
                        top: 61 * LOGO_SCALE - DOT_SIZE / 2,
                      },
                      dot2Style,
                    ]}
                  />
                </View>
              </Animated.View>
            </View>

            {/* Title — 26px below tile */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: centerY + 66 + 26,
                  alignItems: "center",
                },
                titleStyle,
              ]}
            >
              <Text
                style={{
                  fontFamily: fonts.display800,
                  fontSize: 32,
                  lineHeight: 34,
                  letterSpacing: -0.8,
                  color: C.title,
                  textAlign: "center",
                }}
              >
                {t("splash.title")}
              </Text>
            </Animated.View>

            {/* Tagline — 10px below title */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: centerY + 66 + 26 + 34 + 10,
                  alignItems: "center",
                },
                tagStyle,
              ]}
            >
              <Text
                style={{
                  fontFamily: fonts.body600,
                  fontSize: 13,
                  letterSpacing: 0.3,
                  color: C.tag,
                  textAlign: "center",
                }}
              >
                {t("splash.tagline")}
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Loading pill */}
          <View style={styles.pillContainer}>
            <View style={[styles.pill, { backgroundColor: C.pillBg, borderColor: C.pillBorder }]}>
              <Animated.View
                style={[
                  styles.spinner,
                  { borderColor: C.spinnerTrack, borderTopColor: C.spinnerHead },
                  spinnerStyle,
                ]}
              />
              <Text
                style={{
                  fontFamily: fonts.body600,
                  fontSize: 11,
                  color: C.pillText,
                }}
              >
                {t("splash.loading")}
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 1,
  },
  tile: {
    width: 132,
    height: 132,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tileShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  leafOverlay: {
    position: "absolute",
    width: 86,
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    position: "absolute",
    width: 86,
    height: 86,
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  pillContainer: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  spinner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});
