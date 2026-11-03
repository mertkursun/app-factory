import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";

const REMOVE_ICON_SIZE = 14;
const DANGER_COLOR = "#DC2626";
const PRESSED_SCALE = 0.96;

interface IngredientItemProps {
  name: string;
  onRemove: () => void;
  disabled?: boolean;
}

export function IngredientItem({ name, onRemove, disabled = false }: IngredientItemProps) {
  return (
    <View className="flex-row items-center bg-surface border border-border rounded-sm px-4 py-3">
      <Text className="flex-1 text-base font-body text-text">{name}</Text>
      <Pressable
        onPress={onRemove}
        disabled={disabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${name} maddesini sil`}
        className="w-8 h-8 rounded-full bg-danger-light items-center justify-center"
        style={({ pressed }) => ({
          transform: [{ scale: pressed && !disabled ? PRESSED_SCALE : 1 }],
          opacity: disabled ? 0.5 : 1,
        })}
      >
        <X size={REMOVE_ICON_SIZE} color={DANGER_COLOR} />
      </Pressable>
    </View>
  );
}
