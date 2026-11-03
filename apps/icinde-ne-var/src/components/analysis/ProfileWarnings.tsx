import { View, Text } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { AUDIENCE_LABELS } from "@/lib/constants";

interface Warning {
  kitle: string;
  maddeAd: string;
  riskSeviyesi: string;
  aciklama: string;
}

interface ProfileWarningsProps {
  warnings: Warning[];
}

export function ProfileWarnings({ warnings }: ProfileWarningsProps) {
  return (
    <View className="gap-2 mb-4">
      {warnings.map((w, i) => {
        const isDanger = w.riskSeviyesi === "sakincali";
        return (
          <View
            key={`${w.kitle}-${w.maddeAd}-${i}`}
            className={`flex-row items-start gap-3 p-3 rounded-xl ${isDanger ? "bg-danger-light" : "bg-warning-light"}`}
            accessibilityRole="alert"
          >
            <AlertTriangle size={18} color={isDanger ? "#DC2626" : "#CA8A04"} />
            <View className="flex-1">
              <Text
                className={`text-sm font-label ${isDanger ? "text-danger-text" : "text-warning-text"}`}
              >
                {AUDIENCE_LABELS[w.kitle] ?? w.kitle}: {w.maddeAd}
              </Text>
              <Text
                className={`text-xs font-caption mt-1 ${isDanger ? "text-danger-text" : "text-warning-text"}`}
              >
                {w.aciklama}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
