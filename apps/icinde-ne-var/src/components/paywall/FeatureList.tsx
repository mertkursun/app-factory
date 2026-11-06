import { View, Text } from "react-native";
import { Check, Infinity, Zap, Shield, FileBarChart } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react-native";

interface FeatureItem {
  icon: LucideIcon;
  key: string;
}

const FEATURES: readonly FeatureItem[] = [
  { icon: Infinity, key: "paywall.unlimitedScans" },
  { icon: Zap, key: "paywall.prioritySpeed" },
  { icon: Shield, key: "paywall.adFree" },
  { icon: FileBarChart, key: "paywall.detailedReports" },
] as const;

const ICON_SIZE = 16;
const CHECK_SIZE = 18;
const PRIMARY_COLOR = "#0F766E";

export function FeatureList() {
  const { t } = useTranslation();

  return (
    <View className="bg-surface border border-border rounded-xl p-4 gap-4">
      {FEATURES.map((feature) => (
        <View key={feature.key} className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <feature.icon size={ICON_SIZE} color={PRIMARY_COLOR} />
          </View>
          <Text className="text-base font-body text-text flex-1">{t(feature.key)}</Text>
          <Check size={CHECK_SIZE} color={PRIMARY_COLOR} />
        </View>
      ))}
    </View>
  );
}
