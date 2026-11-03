import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { ScanLine } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface PhotoCaptureButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const OUTER_SIZE = 76;
const RING_WIDTH = 4;
const GAP_WIDTH = 4;
const INNER_SIZE = OUTER_SIZE - (RING_WIDTH + GAP_WIDTH) * 2;
const ICON_SIZE = 26;
const SCALE_PRESSED = 0.96;
const PRESS_DURATION_MS = 150;
const PRIMARY_DEEP = "#0B6E66";
const CAMERA_BG = "#0A1413";
const TEAL_RING_START = "#5EEAD4";
const TEAL_RING_END = "#0F9B8E";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PhotoCaptureButton({ onPress, disabled }: PhotoCaptureButtonProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    scale.value = withTiming(SCALE_PRESSED, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    scale.value = withTiming(1, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={t("scanner.shutter")}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
    >
      {/* Outer teal ring */}
      <LinearGradient
        colors={[TEAL_RING_START, TEAL_RING_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outerRing}
      >
        {/* Camera bg gap */}
        <View style={styles.gap}>
          {/* White gradient inner */}
          <LinearGradient
            colors={["#FFFFFF", "#E8E8E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.inner}
          >
            <ScanLine size={ICON_SIZE} color={PRIMARY_DEEP} />
          </LinearGradient>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  gap: {
    width: OUTER_SIZE - RING_WIDTH * 2,
    height: OUTER_SIZE - RING_WIDTH * 2,
    borderRadius: (OUTER_SIZE - RING_WIDTH * 2) / 2,
    backgroundColor: CAMERA_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
