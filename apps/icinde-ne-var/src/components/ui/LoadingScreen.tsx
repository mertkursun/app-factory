import { Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Yükleniyor..." }: LoadingScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator color="#0F766E" size="large" />
      {message ? (
        <Text className="text-sm font-body text-text-secondary mt-4">{message}</Text>
      ) : null}
    </SafeAreaView>
  );
}
