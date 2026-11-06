import { Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/tokens";
import type { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onPress: () => void;
  size?: number;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 40,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const { colors, shadow } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: 14,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        },
        shadow.low,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}
