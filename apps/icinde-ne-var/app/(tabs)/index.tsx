import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraOff } from "lucide-react-native";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { ScannerView } from "@/components/scanner/ScannerView";
import { QuotaBadge } from "@/components/scanner/QuotaBadge";

const CAMERA_OFF_ICON_SIZE = 40;
const MUTED_COLOR = "#78716C";

export default function ScanScreen() {
  const { isGranted, canAskAgain, isLoading, requestPermission } = useCameraPermission();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBarcodeScanned = (barcode: string) => {
    // T14'te tam entegrasyon yapılacak
    setIsProcessing(true);
    // eslint-disable-next-line no-console
    console.log("Barkod:", barcode);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const handlePhotoTaken = (uri: string) => {
    // T14'te tam entegrasyon yapılacak
    // eslint-disable-next-line no-console
    console.log("Fotoğraf:", uri);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-text-secondary font-body">Yükleniyor...</Text>
      </View>
    );
  }

  if (!isGranted) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8 gap-6">
          <View className="w-24 h-24 rounded-full bg-surface-secondary items-center justify-center">
            <CameraOff size={CAMERA_OFF_ICON_SIZE} color={MUTED_COLOR} />
          </View>
          <Text className="text-xl font-title text-text text-center">Kamera İzni Gerekli</Text>
          <Text className="text-base font-body text-text-secondary text-center">
            Barkod okumak ve içindekiler etiketini fotoğraflamak için kameraya erişim gerekli.
          </Text>
          {canAskAgain ? (
            <Pressable
              onPress={requestPermission}
              accessibilityRole="button"
              accessibilityLabel="Kamera izni ver"
              className="bg-primary px-8 h-12 rounded-xl items-center justify-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-white font-label">İzin Ver</Text>
            </Pressable>
          ) : (
            <Text className="text-sm font-caption text-muted text-center">
              Ayarlar&apos;dan kamera iznini açmanız gerekiyor.
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Ust bar: QuotaBadge */}
      <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row justify-between items-center px-4 py-2">
          <Text className="text-white text-lg font-title">İçinde Ne Var?</Text>
          <QuotaBadge />
        </View>
      </SafeAreaView>

      {/* Kamera */}
      <ScannerView
        onBarcodeScanned={handleBarcodeScanned}
        onPhotoTaken={handlePhotoTaken}
        isProcessing={isProcessing}
      />
    </View>
  );
}
