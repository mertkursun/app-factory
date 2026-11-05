import { useState, useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { useAnalyzeProduct } from "@/hooks/useAnalysis";
import { useAddToHistory } from "@/hooks/useHistory";
import { useQuota } from "@/hooks/useQuota";
import { useProfile } from "@/hooks/useProfile";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles";
import { uploadPhoto } from "@/lib/photoUpload";
import { extractIngredients } from "@/services/ocr";
import type { AnalyzeResponse } from "@/services/analysis";
import type { SkorRenk } from "@/lib/schemas";

interface ScanFlowState {
  isAnalyzing: boolean;
  error: string | null;
}

const INITIAL_STATE: ScanFlowState = {
  isAnalyzing: false,
  error: null,
};

export function useScanFlow() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const activeFamilyProfileId = useAppStore((s) => s.activeFamilyProfileId);
  const { data: quota } = useQuota(userId);
  const { data: profile } = useProfile(userId);
  const { data: familyProfiles } = useFamilyProfiles(userId);
  const analyzeMutation = useAnalyzeProduct();
  const addHistoryMutation = useAddToHistory();

  const [state, setState] = useState<ScanFlowState>(INITIAL_STATE);
  const busyRef = useRef(false);

  const isQuotaExhausted = !quota?.isPro && quota?.remaining === 0;

  const navigateToResult = useCallback(
    (result: AnalyzeResponse) => {
      if (!userId) return;

      addHistoryMutation.mutate({
        user_id: userId,
        analiz_id: result.analysis.id,
        barkod: result.analysis.barkod ?? undefined,
        urun_adi: result.analysis.urun_adi ?? undefined,
        skor: result.analysis.skor as SkorRenk,
      });

      router.push(`/analysis/${result.analysis.id}`);
    },
    [userId, addHistoryMutation, router],
  );

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      if (busyRef.current) return;
      if (!user) {
        router.push("/(auth)/login");
        return;
      }

      if (isQuotaExhausted) {
        setState({
          isAnalyzing: false,
          error: t("scanner.quotaExhaustedError"),
        });
        return;
      }

      busyRef.current = true;
      setState({ isAnalyzing: true, error: null });

      try {
        const activeFamilyProfile = familyProfiles?.find((p) => p.id === activeFamilyProfileId);
        const audiences = activeFamilyProfile?.audiences ?? profile?.audiences ?? [];
        const lang = i18n.language;
        const result = await analyzeMutation.mutateAsync({
          barcode,
          audiences,
          lang,
        });

        setState(INITIAL_STATE);
        navigateToResult(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t("analysis.errorMessage");
        setState({ isAnalyzing: false, error: message });
      } finally {
        busyRef.current = false;
      }
    },
    [
      user,
      isQuotaExhausted,
      profile,
      familyProfiles,
      activeFamilyProfileId,
      analyzeMutation,
      navigateToResult,
      router,
      t,
      i18n,
    ],
  );

  const handlePhotoTaken = useCallback(
    async (uri: string) => {
      if (busyRef.current) return;
      if (!user) {
        router.push("/(auth)/login");
        return;
      }

      if (isQuotaExhausted) {
        setState({
          isAnalyzing: false,
          error: t("scanner.quotaExhaustedError"),
        });
        return;
      }

      busyRef.current = true;
      setState({ isAnalyzing: true, error: null });

      try {
        const lang = i18n.language;
        const storagePath = await uploadPhoto(uri);
        const ocrResult = await extractIngredients(storagePath, lang);

        setState(INITIAL_STATE);
        router.push({
          pathname: "/ingredient-confirm",
          params: {
            photoUri: uri,
            storagePath,
            ingredients: JSON.stringify(ocrResult.ingredients),
            productName: ocrResult.productName ?? "",
            category: ocrResult.category ?? "genel",
            brand: ocrResult.brand ?? "",
            countryOfOrigin: ocrResult.countryOfOrigin ?? "",
            ingredientsFromLabel: ocrResult.ingredientsFromLabel ? "true" : "false",
          },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t("scanner.photoError");
        setState({ isAnalyzing: false, error: message });
      } finally {
        busyRef.current = false;
      }
    },
    [user, isQuotaExhausted, router, t, i18n],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    isQuotaExhausted: !!isQuotaExhausted,
    handleBarcodeScanned,
    handlePhotoTaken,
    clearError,
  };
}
