import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/theme/tokens";

interface AppState {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  setIsHydrated: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setNotificationsEnabled: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isHydrated: false,
      themeMode: "system" as ThemeMode,
      notificationsEnabled: false,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setIsHydrated: (value) => set({ isHydrated: value }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        themeMode: state.themeMode,
        notificationsEnabled: state.notificationsEnabled,
      }),
    },
  ),
);
