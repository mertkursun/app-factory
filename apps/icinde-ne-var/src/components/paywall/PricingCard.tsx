import { View, Text } from "react-native";

interface PricingCardProps {
  priceString: string;
  isLoading: boolean;
}

export function PricingCard({ priceString, isLoading }: PricingCardProps) {
  return (
    <View className="items-center">
      {isLoading ? (
        <View className="h-10 w-32 bg-border rounded-lg" />
      ) : (
        <Text className="text-3xl font-display text-text">{priceString}</Text>
      )}
      <Text className="text-sm font-caption text-text-secondary mt-1">/ay</Text>
      <Text className="text-xs font-caption text-muted mt-2 text-center">
        Abonelik her ay otomatik yenilenir.{"\n"}İstediğiniz zaman iptal edebilirsiniz.
      </Text>
    </View>
  );
}
