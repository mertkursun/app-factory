import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  setIsHydrated: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      isHydrated: false,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setIsHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
    },
  ),
);
