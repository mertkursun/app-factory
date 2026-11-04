import { useRef, useState, useCallback } from "react";
import { type ViewShotRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export function useShareAnalysis() {
  const captureRef = useRef<ViewShotRef>(null);
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(async () => {
    if (!captureRef.current?.capture) return;

    setIsSharing(true);
    try {
      const uri = await captureRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) return;

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        UTI: "public.png",
      });
    } catch (error: unknown) {
      // Sharing cancelled by user or failed — silent fail is acceptable
      if (error instanceof Error && error.message?.includes("cancelled")) {
        return;
      }
      throw error;
    } finally {
      setIsSharing(false);
    }
  }, []);

  return { captureRef, share, isSharing } as const;
}
