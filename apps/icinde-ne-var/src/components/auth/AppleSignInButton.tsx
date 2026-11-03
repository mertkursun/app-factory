import { Pressable, Text } from "react-native";

export function AppleSignInButton() {
  const handlePress = () => {
    // TODO: Apple Sign-In implementasyonu (EAS dev-client build gerektirir)
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Apple ile devam et"
      className="h-14 rounded-xl bg-text flex-row items-center justify-center gap-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text className="text-xl text-white">{""}</Text>
      <Text className="text-base font-label text-white">Apple ile devam et</Text>
    </Pressable>
  );
}
