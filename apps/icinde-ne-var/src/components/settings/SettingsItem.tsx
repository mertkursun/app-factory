import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme, radius, fonts } from "@/theme/tokens";
import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
  rightElement?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export function SettingsItem({
  icon: Icon,
  label,
  onPress,
  danger = false,
  showChevron = true,
  rightElement,
  iconBg,
  iconColor,
}: SettingsItemProps) {
  const { colors } = useTheme();

  const tileBg = iconBg ?? (danger ? colors.dangerBg : colors.surfaceTint);
  const tileColor = iconColor ?? (danger ? colors.dangerText : colors.primaryDeep);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Icon tile */}
      <View style={[styles.iconTile, { backgroundColor: tileBg }]}>
        <Icon size={16} color={tileColor} />
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            fontFamily: fonts.body600,
            color: danger ? colors.dangerText : colors.text,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Right element or chevron */}
      {rightElement ?? (showChevron ? <ChevronRight size={16} color={colors.muted} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    minHeight: 44,
    gap: 12,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
