import { View, Text } from "react-native";

export default function VerifyOTPScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-xl font-title text-text">OTP Doğrulama</Text>
      <Text className="text-base font-body text-text-secondary mt-2">
        T06 görevinde tamamlanacak
      </Text>
    </View>
  );
}
