import { View, Text } from "react-native";
import { Info } from "lucide-react-native";

export function DisclaimerNote() {
  return (
    <View className="flex-row items-start gap-2 p-3 rounded-xl bg-surface-secondary">
      <Info size={14} color="#78716C" />
      <Text className="flex-1 text-xs font-caption text-muted leading-4">
        Bu analiz bilgilendirme amaçlıdır, tıbbi tavsiye niteliği taşımaz. Sağlık kararlarınız için
        mutlaka bir uzmana danışın.
      </Text>
    </View>
  );
}
