import { View, StyleSheet } from "react-native";
import { Chip } from "@/components/ui/Chip";
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
    <View style={styles.grid}>
      {allAudiences.map((audience) => {
        const isSelected = selected.includes(audience);
        const emoji = CHIP_EMOJIS[audience] ?? "";
        const label = AUDIENCE_LABELS[audience] ?? audience;

        return (
          <View key={audience} style={styles.chipWrapper}>
            <Chip
              emoji={emoji}
              label={label}
              isSelected={isSelected}
              onToggle={() => handleToggle(audience)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipWrapper: {
    width: "48%",
    flexGrow: 1,
  },
});
