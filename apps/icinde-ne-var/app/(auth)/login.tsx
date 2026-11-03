import { View, Text } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-xl font-title text-text">Giriş</Text>
      <Text className="text-base font-body text-text-secondary mt-2">
        T05 görevinde tamamlanacak
      </Text>
    </View>
  );
}
