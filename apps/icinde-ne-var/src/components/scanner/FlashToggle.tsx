import { Pressable } from "react-native";
import { Zap, ZapOff } from "lucide-react-native";

interface FlashToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const ICON_SIZE = 22;
const FLASH_ON_COLOR = "#FACC15";
const FLASH_OFF_COLOR = "#FFFFFF";

export function FlashToggle({ enabled, onToggle }: FlashToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={enabled ? "Flaşı kapat" : "Flaşı aç"}
      className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {enabled ? (
        <Zap size={ICON_SIZE} color={FLASH_ON_COLOR} />
      ) : (
        <ZapOff size={ICON_SIZE} color={FLASH_OFF_COLOR} />
      )}
    </Pressable>
  );
}
