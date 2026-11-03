import { View, Text, Pressable, StyleSheet } from "react-native";
import { PackageOpen } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, typography, fonts } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { IngredientItem } from "./IngredientItem";

interface IngredientListProps {
  items: string[];
  onRemove: (index: number) => void;
  onAddPress?: () => void;
  disabled?: boolean;
}

export function IngredientList({
  items,
  onRemove,
  onAddPress,
  disabled = false,
}: IngredientListProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <PackageOpen size={48} color={colors.muted} />
        <Text style={[typography.cardTitleLg, { color: colors.text, textAlign: "center" }]}>
          {t("ingredients.noContent")}
        </Text>
        <Text
          style={[typography.bodySecondary, { color: colors.textSecondary, textAlign: "center" }]}
        >
          {t("ingredients.noContentHint")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={[{ fontFamily: fonts.body700, fontSize: 15 }, { color: colors.text }]}>
          {t("ingredients.extracted")}
        </Text>
        <View style={[styles.countBadge, { backgroundColor: colors.surfaceTint }]}>
          <Text style={[typography.badge, { color: colors.primaryDeep }]}>{items.length}</Text>
        </View>
      </View>

      {/* Ingredient list card */}
      <Card style={styles.listCard}>
        {items.map((item, index) => (
          <IngredientItem
            key={`${item}-${index}`}
            name={item}
            onRemove={() => onRemove(index)}
            disabled={disabled}
            isLast={index === items.length - 1}
          />
        ))}
        {/* Add ingredient button */}
        {onAddPress ? (
          <Pressable
            onPress={onAddPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t("ingredients.addButton")}
            style={[styles.addButton, { borderTopWidth: 1, borderTopColor: colors.border }]}
          >
            <Text style={{ fontFamily: fonts.body700, fontSize: 13, color: colors.primary }}>
              {t("ingredients.addButton")}
            </Text>
          </Pressable>
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  countBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  listCard: {
    overflow: "hidden",
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
});
