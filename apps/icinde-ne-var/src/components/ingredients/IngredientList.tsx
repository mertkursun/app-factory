import { View, Text } from "react-native";
import { PackageOpen } from "lucide-react-native";
import { IngredientItem } from "./IngredientItem";

const EMPTY_ICON_SIZE = 48;
const MUTED_COLOR = "#78716C";

interface IngredientListProps {
  items: string[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function IngredientList({ items, onRemove, disabled = false }: IngredientListProps) {
  if (items.length === 0) {
    return (
      <View className="items-center py-8 gap-3">
        <PackageOpen size={EMPTY_ICON_SIZE} color={MUTED_COLOR} />
        <Text className="text-base font-title text-text text-center">{"İçerik çıkarılmadı"}</Text>
        <Text className="text-sm font-body text-text-secondary text-center">
          {"Aşağıdaki alandan elle ekleyebilirsiniz."}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-base font-title text-text">{"Çıkarılan İçerikler"}</Text>
        <View className="bg-primary rounded-full px-2 py-0.5">
          <Text className="text-xs font-label text-primary-foreground">{items.length}</Text>
        </View>
      </View>
      {items.map((item, index) => (
        <IngredientItem
          key={`${item}-${index}`}
          name={item}
          onRemove={() => onRemove(index)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}
