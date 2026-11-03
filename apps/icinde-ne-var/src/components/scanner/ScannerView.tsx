import { useRef, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { CameraView, type BarcodeScanningResult, type BarcodeType } from "expo-camera";
import { FlashToggle } from "./FlashToggle";
import { PhotoCaptureButton } from "./PhotoCaptureButton";
import { ScanFrame } from "./ScanFrame";

interface ScannerViewProps {
  onBarcodeScanned: (barcode: string) => void;
  onPhotoTaken: (uri: string) => void;
  isProcessing: boolean;
}

const BARCODE_COOLDOWN_MS = 3000;
const PHOTO_QUALITY = 0.8;

const BARCODE_TYPES: BarcodeType[] = ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"];

export function ScannerView({ onBarcodeScanned, onPhotoTaken, isProcessing }: ScannerViewProps) {
  const cameraRef = useRef<CameraView>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleBarcode = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned || isProcessing) return;
      setScanned(true);
      onBarcodeScanned(result.data);
      setTimeout(() => setScanned(false), BARCODE_COOLDOWN_MS);
    },
    [scanned, isProcessing, onBarcodeScanned],
  );

  const handlePhoto = useCallback(async () => {
    if (isProcessing || !cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: PHOTO_QUALITY,
    });
    if (photo?.uri) {
      onPhotoTaken(photo.uri);
    }
  }, [isProcessing, onPhotoTaken]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        enableTorch={flashEnabled}
        barcodeScannerSettings={{
          barcodeTypes: BARCODE_TYPES,
        }}
        onBarcodeScanned={handleBarcode}
      >
        {/* Overlay: Tarama cercevesi */}
        <View className="flex-1">
          {/* Ust karartma */}
          <View className="flex-1 bg-black/40" />

          {/* Ortadaki tarama alani */}
          <View className="flex-row items-center">
            <View className="flex-1 bg-black/40" />
            <ScanFrame />
            <View className="flex-1 bg-black/40" />
          </View>

          {/* Alt karartma */}
          <View className="flex-1 bg-black/40 items-center pt-6">
            <Text className="text-white/80 text-sm font-caption">Barkodu çerçeveye hizalayın</Text>
          </View>
        </View>
      </CameraView>

      {/* Alt kontroller */}
      <View className="absolute bottom-32 left-0 right-0 flex-row justify-center items-center gap-12">
        <FlashToggle enabled={flashEnabled} onToggle={toggleFlash} />
        <PhotoCaptureButton onPress={handlePhoto} disabled={isProcessing} />
        {/* Bosboş yer tutucu (simetri icin) */}
        <View className="w-12 h-12" />
      </View>
    </View>
  );
}
