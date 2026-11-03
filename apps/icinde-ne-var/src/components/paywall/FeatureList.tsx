import { View, Text } from "react-native";
import { Check, Infinity, Zap, Shield, FileBarChart } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

interface Feature {
  icon: LucideIcon;
  label: string;
}

const FEATURES: readonly Feature[] = [
  { icon: Infinity, label: "Sınırsız ürün taraması" },
  { icon: Zap, label: "Öncelikli analiz hızı" },
  { icon: Shield, label: "Reklamsız deneyim" },
  { icon: FileBarChart, label: "Detaylı madde raporları" },
] as const;

const ICON_SIZE = 16;
const CHECK_SIZE = 18;
const PRIMARY_COLOR = "#0F766E";

export function FeatureList() {
  return (
    <View className="bg-surface border border-border rounded-xl p-4 gap-4">
      {FEATURES.map((feature) => (
        <View key={feature.label} className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <feature.icon size={ICON_SIZE} color={PRIMARY_COLOR} />
          </View>
          <Text className="text-base font-body text-text flex-1">{feature.label}</Text>
          <Check size={CHECK_SIZE} color={PRIMARY_COLOR} />
        </View>
      ))}
    </View>
  );
}
