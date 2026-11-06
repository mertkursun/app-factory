import { Text, Pressable, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";

const CTA_HEIGHT = 56;

interface PurchaseButtonProps {
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export function PurchaseButton({ onPress, isLoading, isDisabled }: PurchaseButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={t("paywall.subscribe")}
      className={`bg-primary rounded-xl items-center justify-center ${isDisabled ? "opacity-50" : "active:scale-[0.97]"}`}
      style={{ height: CTA_HEIGHT }}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white text-base font-label">{t("paywall.subscribe")}</Text>
      )}
    </Pressable>
  );
}
