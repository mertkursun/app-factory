import { Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

const MIN_TOUCH_HEIGHT = 44;

interface RestoreButtonProps {
  onPress: () => void;
  isDisabled: boolean;
}

export function RestoreButton({ onPress, isDisabled }: RestoreButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={t("paywall.restoreLabel")}
      className="items-center justify-center active:opacity-60"
      style={{ height: MIN_TOUCH_HEIGHT }}
    >
      <Text className="text-primary text-sm font-label">{t("paywall.restore")}</Text>
    </Pressable>
  );
}
