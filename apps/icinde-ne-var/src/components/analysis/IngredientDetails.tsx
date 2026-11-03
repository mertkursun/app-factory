import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { SCORE_COLORS } from "@/lib/constants";
import type { SkorRenk } from "@/lib/schemas";

interface Madde {
  maddeId: string | null;
  ad: string;
  riskSeviyesi: string;
  islev: string | null;
  kaynak: string | null;
  aiTahmini: boolean;
}

interface IngredientDetailsProps {
  maddeler: Madde[];
}

const RISK_TO_SKOR: Record<string, SkorRenk> = {
  guvenli: "yesil",
  dikkat: "sari",
  sakincali: "kirmizi",
};

export function IngredientDetails({ maddeler }: IngredientDetailsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (maddeler.length === 0) return null;

  return (
    <View className="mb-4">
      <Text className="text-sm font-label text-text-secondary mb-2">
        Maddeler ({maddeler.length})
      </Text>
      <View className="bg-surface border border-border rounded-xl overflow-hidden">
        {maddeler.map((madde, index) => {
          const isExpanded = expandedIndex === index;
          const skorKey = RISK_TO_SKOR[madde.riskSeviyesi] ?? "sari";
          const color = SCORE_COLORS[skorKey];

          return (
            <View key={`${madde.ad}-${index}`}>
              {index > 0 && <View className="h-px bg-border" />}
              <Pressable
                onPress={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex-row items-center px-4 py-3"
                accessibilityRole="button"
                accessibilityLabel={`${madde.ad}, risk: ${color.label}`}
                accessibilityState={{ expanded: isExpanded }}
                style={{ minHeight: 44 }}
              >
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: color.text }}
                />
                <Text className="flex-1 text-base font-body text-text">{madde.ad}</Text>
                {madde.aiTahmini && (
                  <Text className="text-xs font-caption text-muted mr-2">AI</Text>
                )}
                {isExpanded ? (
                  <ChevronUp size={16} color="#78716C" />
                ) : (
                  <ChevronDown size={16} color="#78716C" />
                )}
              </Pressable>

              {isExpanded && (
                <View className="px-4 pb-3 pl-10">
                  <Text className="text-sm font-caption text-text-secondary mb-1">
                    Risk: {color.label}
                  </Text>
                  {madde.islev ? (
                    <Text className="text-sm font-body text-text-secondary">
                      İşlev: {madde.islev}
                    </Text>
                  ) : null}
                  {madde.aiTahmini ? (
                    <Text className="text-xs font-caption text-muted mt-1">
                      Bu madde veritabanında bulunamadı, AI tahmini ile değerlendirildi
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
