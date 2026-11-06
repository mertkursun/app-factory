import { Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme/tokens";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const displayMessage = message ?? t("common.loading");

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator color={colors.primary} size="large" />
      {displayMessage ? (
        <Text className="text-sm font-body text-text-secondary mt-4">{displayMessage}</Text>
      ) : null}
    </SafeAreaView>
  );
}
