import { View } from "react-native";
import { useTheme } from "@/theme/tokens";

type Status = "success" | "warning" | "danger";

interface StatusDotProps {
  status: Status;
  size?: number;
}

export function StatusDot({ status, size = 30 }: StatusDotProps) {
  const { colors } = useTheme();

  const bgMap: Record<Status, string> = {
    success: colors.successBg,
    warning: colors.warningBg,
    danger: colors.dangerBg,
  };

  const colorMap: Record<Status, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  const innerSize = Math.round(size * 0.27);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        backgroundColor: bgMap[status],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colorMap[status],
        }}
      />
    </View>
  );
}
