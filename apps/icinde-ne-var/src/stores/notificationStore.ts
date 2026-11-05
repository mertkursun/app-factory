import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationState {
  weeklyReminder: boolean;
  quotaWarning: boolean;
  setWeeklyReminder: (enabled: boolean) => void;
  setQuotaWarning: (enabled: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      weeklyReminder: false,
      quotaWarning: true,
      setWeeklyReminder: (enabled) => set({ weeklyReminder: enabled }),
      setQuotaWarning: (enabled) => set({ quotaWarning: enabled }),
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        weeklyReminder: state.weeklyReminder,
        quotaWarning: state.quotaWarning,
      }),
    },
  ),
);
