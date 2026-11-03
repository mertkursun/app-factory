import { View, Text } from "react-native";
import { Crown } from "lucide-react-native";

export function ProBadge() {
  return (
    <View
      className="flex-row items-center gap-1 rounded-full bg-primary/15 px-3 py-1"
      accessibilityRole="text"
      accessibilityLabel="Pro üyelik aktif"
    >
      <Crown size={14} className="text-primary" />
      <Text className="font-label text-xs text-primary">Pro</Text>
    </View>
  );
}
