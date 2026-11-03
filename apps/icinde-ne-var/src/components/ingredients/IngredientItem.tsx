import { View, Text, Pressable, StyleSheet } from "react-native";
import { X } from "lucide-react-native";
import { useTheme, typography } from "@/theme/tokens";
import { useTranslation } from "react-i18next";

interface IngredientItemProps {
  name: string;
  onRemove: () => void;
  disabled?: boolean;
  isLast?: boolean;
}

const PRESS_SCALE = 0.96;

export function IngredientItem({
  name,
  onRemove,
  disabled = false,
  isLast = false,
}: IngredientItemProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[typography.bodySecondary, { color: colors.text, flex: 1 }]} numberOfLines={1}>
        {name}
      </Text>
      <Pressable
        onPress={onRemove}
        disabled={disabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t("ingredients.removeIngredient", { name })}
        style={({ pressed }) => ({
          minWidth: 44,
          minHeight: 44,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: pressed && !disabled ? PRESS_SCALE : 1 }],
          opacity: disabled ? 0.5 : 1,
        })}
      >
        <X size={16} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
