import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme, fonts } from "@/theme/tokens";
import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export function SettingsItem({
  icon: Icon,
  label,
  onPress,
  showChevron = true,
  rightElement,
  iconBg,
  iconColor,
}: SettingsItemProps) {
  const { colors } = useTheme();

  const tileBg = iconBg ?? colors.surfaceTint;
  const tileColor = iconColor ?? colors.primaryDeep;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {({ pressed }) => (
        <View style={[styles.row, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={[styles.iconTile, { backgroundColor: tileBg }]}>
            <Icon size={16} color={tileColor} />
          </View>
          <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
            {label}
          </Text>
          {rightElement ?? (showChevron ? <ChevronRight size={16} color={colors.muted} /> : null)}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontFamily: fonts.body600,
    fontSize: 14,
    lineHeight: 20,
  },
});
