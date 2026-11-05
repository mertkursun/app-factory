import { View, Text, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";

interface UnknownIngredientsProps {
  items: string[];
}

export function UnknownIngredients({ items }: UnknownIngredientsProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surfaceTint }]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${t("analysis.unknownCount", { count: items.length })}. ${items.join(", ")}`}
    >
      <View style={styles.headerRow}>
        <Info size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.primaryDeep }]}>
          {t("analysis.unknownCount", { count: items.length })}
        </Text>
      </View>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{items.join(", ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: fonts.body700,
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 18,
  },
});
