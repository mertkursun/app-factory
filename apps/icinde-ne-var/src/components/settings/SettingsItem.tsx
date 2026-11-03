import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

interface SettingsItemProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  description?: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}

export function SettingsItem({
  icon: Icon,
  iconColor,
  label,
  description,
  onPress,
  danger = false,
  showChevron = true,
}: SettingsItemProps) {
  const defaultIconColor = "#78716C";
  const dangerColor = "#DC2626";
  const resolvedIconColor = danger ? dangerColor : (iconColor ?? defaultIconColor);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="min-h-[44px] flex-row items-center gap-3 py-3.5"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <Icon size={20} color={resolvedIconColor} />
      <View className="flex-1">
        <Text className={`font-body text-base ${danger ? "text-danger" : "text-text"}`}>
          {label}
        </Text>
        {description ? (
          <Text className="mt-0.5 font-caption text-xs text-text-secondary">{description}</Text>
        ) : null}
      </View>
      {showChevron ? <ChevronRight size={18} color={defaultIconColor} /> : null}
    </Pressable>
  );
}
