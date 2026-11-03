import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect, type ReactNode } from "react";
import { useTheme, fonts } from "@/theme/tokens";

const BLOB_SIZE = 250;
const ILLUSTRATION_W = 264;
const ILLUSTRATION_H = 250;
const FLOAT_DURATION = 2500;
const FLOAT_DISTANCE = 8;

interface SlideItemProps {
  title: string;
  description: string;
  illustration: ReactNode;
  width: number;
}

export function SlideItem({ title, description, illustration, width }: SlideItemProps) {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-FLOAT_DISTANCE, {
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(FLOAT_DISTANCE, {
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
  }, [translateY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, { width }]}>
      {/* Illustration area with radial blob */}
      <View style={styles.illustrationWrapper}>
        <View style={[styles.blob, { backgroundColor: colors.surfaceTint }]} />
        <Animated.View style={[styles.illustrationContainer, floatStyle]}>
          {illustration}
        </Animated.View>
      </View>

      {/* Text block */}
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  illustrationWrapper: {
    width: ILLUSTRATION_W,
    height: ILLUSTRATION_H,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  blob: {
    position: "absolute",
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    opacity: 0.6,
  },
  illustrationContainer: {
    width: ILLUSTRATION_W,
    height: ILLUSTRATION_H,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    paddingHorizontal: 0,
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.display800,
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.7,
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.body400,
    fontSize: 14,
    lineHeight: 21.7,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
