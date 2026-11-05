import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme, fonts } from "@/theme/tokens";

/** Shared dot colors for product categories */
export const CATEGORY_DOT_COLORS: Record<string, string> = {
  gida: "#E39B07",
  kozmetik: "#D95BA3",
  temizlik: "#3B82F6",
  genel: "#6E807C",
};

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  dotColor?: string;
}

export function FilterChip({ label, isActive, onPress, dotColor }: FilterChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? colors.text : colors.surface,
          borderColor: isActive ? colors.text : colors.border,
          borderWidth: isActive ? 0 : 1,
        },
      ]}
    >
      {dotColor && !isActive && <View style={[styles.chipDot, { backgroundColor: dotColor }]} />}
      <Text
        style={[
          styles.chipText,
          {
            color: isActive ? colors.background : colors.textSecondary,
            fontWeight: isActive ? "700" : "600",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    minHeight: 34,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    fontFamily: fonts.body700,
    fontSize: 12,
  },
});
