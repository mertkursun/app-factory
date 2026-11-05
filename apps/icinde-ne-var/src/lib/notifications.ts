import * as Notifications from "expo-notifications";
import {
  SchedulableTriggerInputTypes,
  AndroidImportance,
  type NotificationContentInput,
} from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "./supabase";

/** Notification channel ID for Android */
const ANDROID_CHANNEL_ID = "default";

/** Configure how notifications appear when the app is in the foreground */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Set up Android notification channel */
async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Varsayılan",
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0F766E",
    });
  }
}

/**
 * Request push notification permissions and return the Expo push token.
 * Returns null if permissions are denied, device is a simulator,
 * or we're running in Expo Go.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    return null;
  }

  await setupAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
    if (!projectId) {
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    // Expo Go or misconfigured project — fail gracefully
    return null;
  }
}

/**
 * Save a push token to Supabase for the given user.
 * Uses upsert to avoid duplicates.
 */
export async function saveTokenToSupabase(userId: string, token: string): Promise<void> {
  const platform = Platform.OS === "ios" ? "ios" : "android";

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: userId,
      token,
      platform,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,token" },
  );

  if (error) {
    // Non-critical — don't crash the app
    // eslint-disable-next-line no-console
    console.warn("Failed to save push token:", error.message);
  }
}

/**
 * Remove a push token from Supabase when the user signs out.
 */
export async function removeTokenFromSupabase(userId: string, token: string): Promise<void> {
  await supabase.from("push_tokens").delete().eq("user_id", userId).eq("token", token);
}

interface LocalNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  /** Delay in seconds before showing the notification */
  delaySeconds?: number;
  /** Unique identifier for cancelling later */
  identifier?: string;
}

/**
 * Schedule a local push notification.
 * Returns the notification identifier for potential cancellation.
 */
export async function scheduleLocalNotification(
  options: LocalNotificationOptions,
): Promise<string> {
  const trigger: Notifications.NotificationTriggerInput = options.delaySeconds
    ? {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: options.delaySeconds,
      }
    : null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: options.title,
      body: options.body,
      data: options.data ?? {},
      sound: "default",
    },
    trigger,
    identifier: options.identifier,
  });

  return id;
}

/**
 * Cancel a previously scheduled notification by its identifier.
 */
export async function cancelScheduledNotification(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Well-known notification identifiers ───────────────────────────
export const NOTIFICATION_IDS = {
  WELCOME: "welcome-reminder",
  QUOTA_WARNING: "quota-warning",
  WEEKLY_REMINDER: "weekly-reminder",
} as const;

// ─── Local notification schedulers ─────────────────────────────────

const ONE_HOUR_SECONDS = 3_600;

/** Monday = 2 in Expo (1=Sun, 2=Mon, ..., 7=Sat) */
const MONDAY_WEEKDAY = 2;
const WEEKLY_REMINDER_HOUR = 10;
const WEEKLY_REMINDER_MINUTE = 0;

/**
 * Schedule a welcome notification 1 hour after registration.
 */
export async function scheduleWelcomeNotification(title: string, body: string): Promise<void> {
  await scheduleLocalNotification({
    title,
    body,
    delaySeconds: ONE_HOUR_SECONDS,
    identifier: NOTIFICATION_IDS.WELCOME,
    data: { type: "welcome" },
  });
}

/**
 * Schedule a quota warning notification when remaining quota is low.
 * Only fires if remaining is 1 or fewer.
 */
export async function scheduleQuotaWarning(
  remaining: number,
  title: string,
  body: string,
): Promise<void> {
  // Cancel previous one first
  await cancelScheduledNotification(NOTIFICATION_IDS.QUOTA_WARNING);

  if (remaining > 1) return;

  await scheduleLocalNotification({
    title,
    body,
    identifier: NOTIFICATION_IDS.QUOTA_WARNING,
    data: { type: "quota-warning", remaining },
  });
}

/**
 * Schedule a repeating weekly reminder every Monday at 10:00.
 * Uses a weekly calendar trigger for recurring delivery.
 */
export async function scheduleWeeklyReminder(title: string, body: string): Promise<void> {
  // Cancel previous one first
  await cancelScheduledNotification(NOTIFICATION_IDS.WEEKLY_REMINDER);

  const content: NotificationContentInput = {
    title,
    body,
    data: { type: "weekly-reminder" },
    sound: "default",
  };

  await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: MONDAY_WEEKDAY,
      hour: WEEKLY_REMINDER_HOUR,
      minute: WEEKLY_REMINDER_MINUTE,
    },
    identifier: NOTIFICATION_IDS.WEEKLY_REMINDER,
  });
}

/**
 * Cancel the weekly reminder notification.
 */
export async function cancelWeeklyReminder(): Promise<void> {
  await cancelScheduledNotification(NOTIFICATION_IDS.WEEKLY_REMINDER);
}

/**
 * Cancel the quota warning notification.
 */
export async function cancelQuotaWarning(): Promise<void> {
  await cancelScheduledNotification(NOTIFICATION_IDS.QUOTA_WARNING);
}

/**
 * Get all currently scheduled notifications.
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
