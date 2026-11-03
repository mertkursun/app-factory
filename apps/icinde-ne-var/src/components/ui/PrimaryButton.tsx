import { Pressable, Text, ActivityIndicator, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTheme, typography, radius } from "@/theme/tokens";
import type { ReactNode } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_DURATION = 120;

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  height?: number;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  height = 56,
  style,
}: PrimaryButtonProps) {
  const { gradient, shadow, colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: PRESS_DURATION });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: PRESS_DURATION });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }, style]}
    >
      <LinearGradient
        colors={[...gradient.primary]}
        locations={[...gradient.primaryLocations]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            height,
            borderRadius: radius.pill,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          },
          shadow.primaryButton,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primaryFg} />
        ) : (
          <>
            {iconPosition === "left" && icon}
            <Text style={[typography.button, { color: colors.primaryFg }]}>{label}</Text>
            {iconPosition === "right" && icon}
          </>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}
