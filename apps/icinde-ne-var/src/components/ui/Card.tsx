import { View, type StyleProp, type ViewStyle, type AccessibilityRole } from "react-native";
import { useTheme } from "@/theme/tokens";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  accessible?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
}

export function Card({
  children,
  style,
  borderRadius = 22,
  accessible,
  accessibilityRole,
  accessibilityLabel,
}: CardProps) {
  const { colors, shadow } = useTheme();

  return (
    <View
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius,
        },
        shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
