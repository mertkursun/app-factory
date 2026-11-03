import { Text, Pressable, ActivityIndicator } from "react-native";

const PRESSED_SCALE = 0.96;
const CTA_HEIGHT = 56;

interface PurchaseButtonProps {
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export function PurchaseButton({ onPress, isLoading, isDisabled }: PurchaseButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel="Pro aboneliğe geç"
      className="bg-primary rounded-xl items-center justify-center"
      style={({ pressed }) => ({
        height: CTA_HEIGHT,
        opacity: isDisabled ? 0.5 : 1,
        transform: [{ scale: pressed && !isDisabled ? PRESSED_SCALE : 1 }],
      })}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white text-base font-label">Pro&apos;ya Başla</Text>
      )}
    </Pressable>
  );
}
