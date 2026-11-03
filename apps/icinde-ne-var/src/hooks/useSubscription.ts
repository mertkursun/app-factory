import { useState, useEffect, useCallback } from "react";
import { type CustomerInfo, type PurchasesOffering } from "react-native-purchases";
import {
  getOfferings,
  purchaseProPackage,
  restorePurchases,
  getCustomerInfo,
  isProFromCustomerInfo,
} from "@/lib/revenuecat";

interface SubscriptionState {
  isPro: boolean;
  offering: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    offering: null,
    customerInfo: null,
    isLoading: true,
  });

  useEffect(() => {
    async function load() {
      const [info, offering] = await Promise.all([getCustomerInfo(), getOfferings()]);
      setState({
        isPro: isProFromCustomerInfo(info),
        offering,
        customerInfo: info,
        isLoading: false,
      });
    }
    load();
  }, []);

  const purchase = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const info = await purchaseProPackage();
      if (info) {
        setState((prev) => ({
          ...prev,
          isPro: isProFromCustomerInfo(info),
          customerInfo: info,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const restore = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const info = await restorePurchases();
      setState((prev) => ({
        ...prev,
        isPro: isProFromCustomerInfo(info),
        customerInfo: info,
        isLoading: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  return { ...state, purchase, restore };
}
