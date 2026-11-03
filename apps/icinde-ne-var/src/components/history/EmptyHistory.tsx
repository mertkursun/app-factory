import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";

const ICON_COLOR = "#78716C";
const ICON_SIZE = 36;

export function EmptyHistory() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <View className="w-20 h-20 rounded-full bg-surface-secondary items-center justify-center">
        <ScanLine size={ICON_SIZE} color={ICON_COLOR} />
      </View>
      <Text className="text-lg font-title text-text text-center">Henüz tarama yapmadınız</Text>
      <Text className="text-sm font-body text-text-secondary text-center">
        İlk ürününüzü tarayarak içindekileri öğrenin.
      </Text>
      <Pressable
        onPress={() => router.push("/(tabs)")}
        className="bg-primary px-6 h-12 rounded-xl items-center justify-center"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.96 : 1 }],
        })}
        accessibilityRole="button"
        accessibilityLabel="Taramaya başla"
      >
        <Text className="text-primary-foreground text-sm font-label">Tara</Text>
      </Pressable>
    </View>
  );
}
