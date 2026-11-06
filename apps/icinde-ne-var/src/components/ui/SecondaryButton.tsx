import { Pressable, Text, type ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTheme, typography, radius } from "@/theme/tokens";
import type { ReactNode } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  height?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  height = 52,
  disabled = false,
  style,
}: SecondaryButtonProps) {
  const { colors, shadow } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: 120 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        animatedStyle,
        {
          height,
          borderRadius: radius.pill,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: disabled ? 0.5 : 1,
        },
        shadow.low,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          typography.button,
          { color: colors.text, fontFamily: "PlusJakartaSans_600SemiBold", fontSize: 14 },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
