import { View, Text } from "react-native";
import { History } from "lucide-react-native";

const PRIMARY_COLOR = "#0F766E";
const ICON_SIZE = 48;

export default function HistoryScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <History size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text className="font-title text-2xl text-text">Geçmiş</Text>
      <Text className="font-body text-base text-text-secondary">
        Tarama geçmişiniz burada görünecek
      </Text>
    </View>
  );
}
