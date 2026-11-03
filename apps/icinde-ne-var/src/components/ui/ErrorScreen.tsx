import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, RefreshCw } from "lucide-react-native";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({
  title = "Bir hata oluştu",
  message = "Lütfen tekrar deneyin.",
  onRetry,
}: ErrorScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-8">
      <View className="w-16 h-16 rounded-full bg-danger/10 items-center justify-center mb-4">
        <AlertCircle size={32} color="#DC2626" />
      </View>
      <Text className="text-lg font-title text-text text-center mb-2">{title}</Text>
      <Text className="text-sm font-body text-text-secondary text-center mb-6">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Tekrar dene"
          className="flex-row items-center gap-2 bg-primary px-6 h-12 rounded-full"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <RefreshCw size={16} color="#FFFFFF" />
          <Text className="text-white text-sm font-label">Tekrar Dene</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
