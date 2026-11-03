import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;
const PRIMARY_COLOR = "#0F766E";
const PULSE_DURATION_MS = 1500;
const OPACITY_MIN = 0.6;
const OPACITY_MAX = 1.0;

interface CornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  animatedOpacity: Animated.SharedValue<number>;
}

function Corner({ position, animatedOpacity }: CornerProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }));

  const positionStyles = {
    "top-left": { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
    "top-right": {
      top: 0,
      right: 0,
      borderTopWidth: CORNER_WIDTH,
      borderRightWidth: CORNER_WIDTH,
    },
    "bottom-left": {
      bottom: 0,
      left: 0,
      borderBottomWidth: CORNER_WIDTH,
      borderLeftWidth: CORNER_WIDTH,
    },
    "bottom-right": {
      bottom: 0,
      right: 0,
      borderBottomWidth: CORNER_WIDTH,
      borderRightWidth: CORNER_WIDTH,
    },
  };

  const borderRadii = {
    "top-left": { borderTopLeftRadius: 12 },
    "top-right": { borderTopRightRadius: 12 },
    "bottom-left": { borderBottomLeftRadius: 12 },
    "bottom-right": { borderBottomRightRadius: 12 },
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: CORNER_SIZE,
          height: CORNER_SIZE,
          borderColor: PRIMARY_COLOR,
        },
        positionStyles[position],
        borderRadii[position],
        animatedStyle,
      ]}
    />
  );
}

export function ScanFrame() {
  const opacity = useSharedValue(OPACITY_MIN);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(OPACITY_MAX, {
        duration: PULSE_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  return (
    <View className="w-64 h-64">
      <Corner position="top-left" animatedOpacity={opacity} />
      <Corner position="top-right" animatedOpacity={opacity} />
      <Corner position="bottom-left" animatedOpacity={opacity} />
      <Corner position="bottom-right" animatedOpacity={opacity} />
    </View>
  );
}
