import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WifiOff, RefreshCw } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme/tokens";

interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: colors.background }}
    >
      <View className="w-16 h-16 rounded-full bg-surface-secondary items-center justify-center mb-4">
        <WifiOff size={32} color={colors.muted} />
      </View>
      <Text className="text-lg font-title text-text text-center mb-2">
        {t("common.networkError")}
      </Text>
      <Text className="text-sm font-body text-text-secondary text-center mb-6">
        {t("common.networkErrorMessage")}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t("common.retry")}
          className="flex-row items-center gap-2 bg-primary px-6 h-12 rounded-full active:opacity-70 active:scale-95"
        >
          <RefreshCw size={16} color={colors.primaryFg} />
          <Text className="text-white text-sm font-label">{t("common.retry")}</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
