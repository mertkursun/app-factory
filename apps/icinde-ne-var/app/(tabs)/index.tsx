import { View, Text } from "react-native";
import { ScanLine } from "lucide-react-native";

const PRIMARY_COLOR = "#0F766E";
const ICON_SIZE = 48;

export default function ScanScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <ScanLine size={ICON_SIZE} color={PRIMARY_COLOR} />
      <Text className="font-title text-2xl text-text">Tarama</Text>
      <Text className="font-body text-base text-text-secondary">
        Kameranızı barkoda veya etikete tutun
      </Text>
    </View>
  );
}
