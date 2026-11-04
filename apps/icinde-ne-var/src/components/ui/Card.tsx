import { View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/tokens";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export function Card({ children, style, borderRadius = 22 }: CardProps) {
  const { colors, shadow } = useTheme();

  return (
    <View
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
