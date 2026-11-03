import { Text, Pressable } from "react-native";

const MIN_TOUCH_HEIGHT = 44;

interface RestoreButtonProps {
  onPress: () => void;
  isDisabled: boolean;
}

export function RestoreButton({ onPress, isDisabled }: RestoreButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="Satın alımları geri yükle"
      className="items-center justify-center"
      style={({ pressed }) => ({
        height: MIN_TOUCH_HEIGHT,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text className="text-primary text-sm font-label">Satın Alımları Geri Yükle</Text>
    </Pressable>
  );
}
