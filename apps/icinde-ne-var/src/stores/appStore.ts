import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/theme/tokens";

interface AppState {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  activeFamilyProfileId: string | null;
  pendingDisplayName: string | null;
  setHasSeenOnboarding: (value: boolean) => void;
  setIsHydrated: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setNotificationsEnabled: (value: boolean) => void;
  setActiveFamilyProfileId: (id: string | null) => void;
  setPendingDisplayName: (name: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isHydrated: false,
      themeMode: "system" as ThemeMode,
      notificationsEnabled: false,
      activeFamilyProfileId: null,
      pendingDisplayName: null,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setIsHydrated: (value) => set({ isHydrated: value }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
      setActiveFamilyProfileId: (id) => set({ activeFamilyProfileId: id }),
      setPendingDisplayName: (name) => set({ pendingDisplayName: name }),
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
        activeFamilyProfileId: state.activeFamilyProfileId,
        pendingDisplayName: state.pendingDisplayName,
      }),
    },
  ),
);
