import { Pressable } from "react-native";
import { Camera } from "lucide-react-native";
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

const ICON_SIZE = 28;
const PRIMARY_COLOR = "#0F766E";
const SCALE_PRESSED = 0.96;
const PRESS_DURATION_MS = 150;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PhotoCaptureButton({ onPress, disabled }: PhotoCaptureButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(SCALE_PRESSED, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
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
      accessibilityLabel="Fotoğraf çek"
      className="w-16 h-16 rounded-full bg-white items-center justify-center"
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
    >
      <Camera size={ICON_SIZE} color={PRIMARY_COLOR} />
    </AnimatedPressable>
  );
}
