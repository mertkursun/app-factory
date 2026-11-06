import "../global.css";
import "@/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NativeSplash from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { configureRevenueCat, identifyUser } from "@/lib/revenuecat";
import { SplashAnimation } from "@/components/splash/SplashAnimation";
import { useNotifications } from "@/hooks/useNotifications";
import { useTheme } from "@/theme/tokens";

const STALE_TIME_MS = 1000 * 60 * 5;

NativeSplash.preventAutoHideAsync();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isInitialized } = useAuthStore();
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
  const { colors } = useTheme();
  const isHydrated = useAppStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isInitialized || !isHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!hasSeenOnboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)");
    } else if (hasSeenOnboarding && !session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (hasSeenOnboarding && session && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)");
    }
  }, [session, isInitialized, isHydrated, hasSeenOnboarding, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="analysis/[id]" />
      <Stack.Screen name="ingredient-confirm" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="legal" />
    </Stack>
  );
}

export default function RootLayout() {
  const { colors } = useTheme();
  const queryClientRef = useRef(
    new QueryClient({
      defaultOptions: {
        queries: { retry: 2, staleTime: STALE_TIME_MS },
      },
    }),
  );
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAppStore((s) => s.isHydrated);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  useEffect(() => {
    configureRevenueCat();
  }, []);

  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id);
    }
  }, [user?.id]);

  // Push notification lifecycle (token registration, listeners, local scheduling)
  useNotifications();

  useEffect(() => {
    if (fontsLoaded && isInitialized && isHydrated) {
      NativeSplash.hideAsync();
    }
  }, [fontsLoaded, isInitialized, isHydrated]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded || !isInitialized || !isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <QueryClientProvider client={queryClientRef.current}>
        <StatusBar style={showSplash ? "light" : "auto"} />
        <AuthGate />
        {showSplash && (
          <View style={splashOverlay}>
            <SplashAnimation onFinish={handleSplashFinish} />
          </View>
        )}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const splashOverlay = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
}).overlay;
