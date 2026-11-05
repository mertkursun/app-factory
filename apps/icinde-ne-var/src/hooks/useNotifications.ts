import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import type { EventSubscription } from "expo";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import {
  registerForPushNotificationsAsync,
  saveTokenToSupabase,
  cancelAllScheduledNotifications,
  scheduleWelcomeNotification,
  scheduleWeeklyReminder,
  configureNotificationHandler,
} from "@/lib/notifications";

const WELCOME_SCHEDULED_KEY = "welcome_notification_scheduled";

/**
 * Hook that manages push notification lifecycle:
 * - Registers for push notifications and saves token
 * - Sets up foreground + response listeners
 * - Handles deep link navigation on notification tap
 * - Schedules welcome & weekly reminders
 * - Respects notificationsEnabled toggle
 */
export function useNotifications(): void {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);
  const tokenRef = useRef<string | null>(null);

  // Configure notification handler once
  useEffect(() => {
    configureNotificationHandler();
  }, []);

  // Register and save token when user is authenticated + notifications enabled
  useEffect(() => {
    if (!user?.id || !notificationsEnabled) return;

    let isMounted = true;

    const register = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token && isMounted) {
        tokenRef.current = token;
        await saveTokenToSupabase(user.id, token);
      }
    };

    register();

    return () => {
      isMounted = false;
    };
  }, [user?.id, notificationsEnabled]);

  // Handle notification response (user tapped a notification)
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as
        Record<string, unknown> | undefined;

      if (!data) return;

      const { type, analysisId } = data;

      switch (type) {
        case "analysis-complete":
          if (typeof analysisId === "string") {
            router.push(`/analysis/${analysisId}`);
          }
          break;
        case "quota-warning":
          router.push("/paywall");
          break;
        case "welcome":
          router.push("/(tabs)");
          break;
        case "weekly-reminder":
          router.push("/(tabs)");
          break;
        default:
          break;
      }
    },
    [router],
  );

  // Set up notification listeners
  useEffect(() => {
    // Foreground notification listener (just for logging / future use)
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // Notification received while app is in foreground
      // Handler configured above will show it
    });

    // Response listener — user tapped a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [handleNotificationResponse]);

  // Schedule / cancel local notifications based on toggle
  useEffect(() => {
    if (!user?.id) return;

    if (notificationsEnabled) {
      // Schedule welcome only once ever
      const scheduleWelcomeOnce = async () => {
        const alreadyScheduled = await AsyncStorage.getItem(WELCOME_SCHEDULED_KEY);
        if (!alreadyScheduled) {
          await scheduleWelcomeNotification(
            t("notifications.welcomeTitle"),
            t("notifications.welcomeBody"),
          );
          await AsyncStorage.setItem(WELCOME_SCHEDULED_KEY, "true");
        }
      };
      scheduleWelcomeOnce();

      // Weekly reminder can be re-scheduled safely (it cancels previous first)
      scheduleWeeklyReminder(
        t("notifications.weeklyReminderTitle"),
        t("notifications.weeklyReminderBody"),
      );
    } else {
      // Cancel all scheduled local notifications
      cancelAllScheduledNotifications();
    }
  }, [notificationsEnabled, user?.id, t]);
}
