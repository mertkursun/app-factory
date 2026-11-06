import { useState } from "react";
import { Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { signInWithApple, isAppleSignInAvailable } from "@/lib/auth";
import { isExpoGo } from "@/lib/runtime";
import { useTheme, fonts } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BUTTON_HEIGHT = 52;
const BUTTON_RADIUS = 26;
const PRESS_DURATION = 120;

function AppleIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size * 1.125} viewBox="0 0 16 18" fill={color}>
      <Path d="M12.744 9.554c-.022-2.157 1.76-3.193 1.84-3.243-1.002-1.465-2.562-1.665-3.116-1.687-1.326-.134-2.59.781-3.263.781-.673 0-1.714-.761-2.816-.741-1.449.02-2.786.843-3.533 2.142-1.505 2.612-.385 6.482 1.081 8.601.717 1.037 1.572 2.201 2.695 2.159 1.082-.043 1.49-.7 2.797-.7 1.306 0 1.674.7 2.816.678 1.163-.02 1.902-1.056 2.616-2.096.824-1.202 1.163-2.365 1.183-2.426-.026-.011-2.27-.872-2.3-3.468zM10.587 3.07c.596-.722.998-1.725.889-2.725-.859.035-1.9.572-2.516 1.294-.553.64-1.037 1.662-.907 2.642.959.075 1.938-.487 2.534-1.21z" />
    </Svg>
  );
}

export function AppleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (isExpoGo || !isAppleSignInAvailable()) return null;

  const handlePress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signInWithApple();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "ERR_REQUEST_CANCELED") return;
      const message = err instanceof Error ? err.message : t("common.unknownError");
      Alert.alert(t("auth.appleSignInFailed"), message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: PRESS_DURATION });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: PRESS_DURATION });
      }}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={t("auth.appleSignIn")}
      style={[
        animatedStyle,
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: isLoading ? 0.7 : 1,
        },
        shadow.low,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.muted} />
      ) : (
        <>
          <AppleIcon color={colors.text} />
          <Text style={[styles.label, { color: colors.text }]}>{t("auth.appleSignIn")}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    fontFamily: fonts.body600,
    fontSize: 14,
    lineHeight: 20,
  },
});
