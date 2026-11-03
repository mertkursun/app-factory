import { View, Text, Pressable } from "react-native";
import { AUDIENCE_LABELS } from "@/lib/constants";

const CHIP_EMOJIS: Record<string, string> = {
  bebek: "\u{1F476}",
  hamile: "\u{1F930}",
  hassas_cilt: "\u{1F590}",
  gluten_alerjisi: "\u{1F33E}",
  laktoz_intoleransi: "\u{1F95B}",
  fistik_alerjisi: "\u{1F95C}",
  vegan: "\u{1F33F}",
  diyabet: "\u{1FA78}",
};

interface AudienceSelectorProps {
  selected: string[];
  onChange: (audiences: string[]) => void;
  disabled?: boolean;
}

export function AudienceSelector({ selected, onChange, disabled }: AudienceSelectorProps) {
  const allAudiences = Object.keys(AUDIENCE_LABELS);

  const handleToggle = (audience: string) => {
    if (disabled) return;
    const isSelected = selected.includes(audience);
    const updated = isSelected ? selected.filter((a) => a !== audience) : [...selected, audience];
    onChange(updated);
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {allAudiences.map((audience) => {
        const isSelected = selected.includes(audience);
        const emoji = CHIP_EMOJIS[audience] ?? "";
        const label = AUDIENCE_LABELS[audience] ?? audience;

        return (
          <Pressable
            key={audience}
            onPress={() => handleToggle(audience)}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected, disabled }}
            accessibilityLabel={label}
            className={`min-h-[44px] flex-row items-center rounded-full border px-4 py-2 ${
              isSelected ? "border-primary bg-primary" : "border-border bg-surface"
            }`}
            style={({ pressed }) => ({
              opacity: pressed || disabled ? 0.6 : 1,
            })}
          >
            <Text className="mr-1.5 text-sm">{emoji}</Text>
            <Text
              className={`font-label text-sm ${
                isSelected ? "text-primary-foreground" : "text-text"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
