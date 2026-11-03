import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyzeProduct } from "@/hooks/useAnalysis";
import { useAddToHistory } from "@/hooks/useHistory";
import { useQuota } from "@/hooks/useQuota";
import { useProfile } from "@/hooks/useProfile";
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
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: quota } = useQuota(userId);
  const { data: profile } = useProfile(userId);
  const analyzeMutation = useAnalyzeProduct();
  const addHistoryMutation = useAddToHistory();

  const [state, setState] = useState<ScanFlowState>(INITIAL_STATE);

  const isQuotaExhausted = !quota?.isPro && quota?.remaining === 0;

  const navigateToResult = useCallback(
    async (result: AnalyzeResponse) => {
      if (!userId) return;

      // Gecmise ekle
      addHistoryMutation.mutate({
        user_id: userId,
        analiz_id: result.analysis.id,
        barkod: result.analysis.barkod ?? undefined,
        urun_adi: result.analysis.urun_adi ?? undefined,
        skor: result.analysis.skor as SkorRenk,
      });

      // Sonuc ekranina yonlendir
      router.push(`/analysis/${result.analysis.id}`);
    },
    [userId, addHistoryMutation, router],
  );

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      if (!user) {
        router.push("/(auth)/login");
        return;
      }

      if (isQuotaExhausted) {
        setState({
          isAnalyzing: false,
          error: "Aylık tarama kotanız doldu. Pro'ya yükselterek sınırsız tarama yapabilirsiniz.",
        });
        return;
      }

      setState({ isAnalyzing: true, error: null });

      try {
        const audiences = profile?.audiences ?? [];
        const result = await analyzeMutation.mutateAsync({
          barcode,
          audiences,
        });

        setState(INITIAL_STATE);
        await navigateToResult(result);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Analiz sırasında bir hata oluştu. Tekrar deneyin.";
        setState({ isAnalyzing: false, error: message });
      }
    },
    [user, isQuotaExhausted, profile, analyzeMutation, navigateToResult, router],
  );

  const handlePhotoTaken = useCallback(
    (uri: string) => {
      if (!user) {
        router.push("/(auth)/login");
        return;
      }

      if (isQuotaExhausted) {
        setState({
          isAnalyzing: false,
          error: "Aylık tarama kotanız doldu. Pro'ya yükselterek sınırsız tarama yapabilirsiniz.",
        });
        return;
      }

      // Fotografi ingredient-confirm ekranina gonder
      router.push({
        pathname: "/ingredient-confirm",
        params: { photoUri: uri, ingredients: JSON.stringify([]) },
      });
    },
    [user, isQuotaExhausted, router],
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
