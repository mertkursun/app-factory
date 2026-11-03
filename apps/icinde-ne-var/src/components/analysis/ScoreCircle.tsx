import { View, Text } from "react-native";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react-native";
import { SCORE_COLORS } from "@/lib/constants";
import type { SkorRenk } from "@/lib/schemas";

interface ScoreCircleProps {
  skor: SkorRenk;
}

const SCORE_ICONS = {
  yesil: ShieldCheck,
  sari: AlertTriangle,
  kirmizi: ShieldAlert,
} as const;

export function ScoreCircle({ skor }: ScoreCircleProps) {
  const config = SCORE_COLORS[skor];
  const Icon = SCORE_ICONS[skor];

  return (
    <View className="items-center py-6">
      <View
        className="w-32 h-32 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: config.bg, borderWidth: 6, borderColor: config.text }}
        accessibilityLabel={`Skor: ${config.label}`}
        accessibilityRole="image"
      >
        <Icon size={32} color={config.text} />
      </View>
      <Text className="text-xl font-title" style={{ color: config.text }}>
        {config.label}
      </Text>
    </View>
  );
}
