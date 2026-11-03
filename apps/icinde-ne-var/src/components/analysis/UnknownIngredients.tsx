import { View, Text } from "react-native";
import { HelpCircle } from "lucide-react-native";

interface UnknownIngredientsProps {
  items: string[];
}

export function UnknownIngredients({ items }: UnknownIngredientsProps) {
  return (
    <View className="bg-warning-light rounded-xl p-4 mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        <HelpCircle size={16} color="#854D0E" />
        <Text className="text-sm font-label text-warning-text">
          Bilinmeyen Maddeler ({items.length})
        </Text>
      </View>
      <Text className="text-sm font-body text-warning-text">{items.join(", ")}</Text>
    </View>
  );
}
