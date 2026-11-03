import "../global.css";
import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";

const STALE_TIME_MS = 1000 * 60 * 5;

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: STALE_TIME_MS,
    },
  },
});

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isInitialized } = useAuthStore();
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
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

  return <Slot />;
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isHydrated = useAppStore((s) => s.isHydrated);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  useEffect(() => {
    if (fontsLoaded && isInitialized && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized, isHydrated]);

  if (!fontsLoaded || !isInitialized || !isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AuthGate />
    </QueryClientProvider>
  );
}
