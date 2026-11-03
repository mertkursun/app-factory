import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  LOG_LEVEL,
} from "react-native-purchases";
import { Platform } from "react-native";

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? "";
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? "";
const PRO_ENTITLEMENT_ID = "pro";

let isConfigured = false;

export function configureRevenueCat(userId?: string): void {
  if (isConfigured) return;

  const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  if (!apiKey) {
    console.warn("RevenueCat API key not set");
    return;
  }

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({
      apiKey,
      appUserID: userId ?? null,
    });
    isConfigured = true;
  } catch (err) {
    console.warn("RevenueCat configuration failed:", err);
  }
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function purchaseProPackage(): Promise<CustomerInfo | null> {
  try {
    const offerings = await Purchases.getOfferings();
    const proPackage = offerings.current?.availablePackages[0];
    if (!proPackage) return null;

    const { customerInfo } = await Purchases.purchasePackage(proPackage);
    return customerInfo;
  } catch (err: unknown) {
    const purchaseErr = err as { userCancelled?: boolean };
    if (purchaseErr.userCancelled) return null;
    throw err;
  }
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

export function isProFromCustomerInfo(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return typeof info.entitlements.active[PRO_ENTITLEMENT_ID] !== "undefined";
}

export async function identifyUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch {
    // Expo Go veya config hata durumunda sessizce devam et
  }
}
