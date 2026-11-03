import { View, Text } from "react-native";
import { MessageSquareText } from "lucide-react-native";

interface ExplanationCardProps {
  text: string;
}

export function ExplanationCard({ text }: ExplanationCardProps) {
  return (
    <View className="bg-surface border border-border rounded-xl p-4 mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        <MessageSquareText size={16} color="#0F766E" />
        <Text className="text-sm font-label text-primary">Özet</Text>
      </View>
      <Text className="text-base font-body text-text leading-6">{text}</Text>
    </View>
  );
}
