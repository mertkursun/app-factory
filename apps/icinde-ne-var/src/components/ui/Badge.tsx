import { View, Text } from "react-native";
import { useTheme, typography } from "@/theme/tokens";

type BadgeStatus = "success" | "warning" | "danger";

interface BadgeProps {
  label: string;
  status: BadgeStatus;
}

export function Badge({ label, status }: BadgeProps) {
  const { colors } = useTheme();

  const bgMap: Record<BadgeStatus, string> = {
    success: colors.successBg,
    warning: colors.warningBg,
    danger: colors.dangerBg,
  };

  const textMap: Record<BadgeStatus, string> = {
    success: colors.successText,
    warning: colors.warningText,
    danger: colors.dangerText,
  };

  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 9,
        borderRadius: 999,
        backgroundColor: bgMap[status],
      }}
    >
      <Text style={[typography.badge, { color: textMap[status] }]}>{label}</Text>
    </View>
  );
}
