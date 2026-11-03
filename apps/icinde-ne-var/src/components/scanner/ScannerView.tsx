import { useRef, useState, useCallback, type ReactNode } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { CameraView, type BarcodeScanningResult, type BarcodeType } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Sparkles, ImageIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { fonts } from "@/theme/tokens";
import { FlashToggle } from "./FlashToggle";
import { PhotoCaptureButton } from "./PhotoCaptureButton";
import { ScanFrame } from "./ScanFrame";

interface ScannerViewProps {
  onBarcodeScanned: (barcode: string) => void;
  onPhotoTaken: (uri: string) => void;
  isProcessing: boolean;
  onGalleryPress?: () => void;
}

const BARCODE_COOLDOWN_MS = 3000;
const PHOTO_QUALITY = 0.8;
const BARCODE_TYPES: BarcodeType[] = ["ean13", "ean8", "upc_a", "upc_e", "code128", "code39"];
const GLASS_BUTTON_SIZE = 48;

function GlassButton({
  onPress,
  accessibilityLabel,
  children,
}: {
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
}) {
  if (Platform.OS === "ios") {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [styles.glassButton, { opacity: pressed ? 0.7 : 1 }]}
      >
        <BlurView intensity={16} tint="dark" style={styles.glassBlur}>
          {children}
        </BlurView>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.glassButton,
        styles.glassAndroid,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}

export function ScannerView({
  onBarcodeScanned,
  onPhotoTaken,
  isProcessing,
  onGalleryPress,
}: ScannerViewProps) {
  const { t } = useTranslation();
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

  const handleGallery = useCallback(() => {
    onGalleryPress?.();
  }, [onGalleryPress]);

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.absoluteFill}
        facing="back"
        enableTorch={flashEnabled}
        barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
        onBarcodeScanned={handleBarcode}
      />

      {/* Top gradient overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "transparent"]}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.55)"]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Centered scan frame */}
      <View style={styles.frameContainer}>
        <ScanFrame />
      </View>

      {/* Hint pill below frame */}
      <View style={styles.hintContainer}>
        <View style={styles.hintPill}>
          <Sparkles size={14} color="#FFFFFF" />
          <Text style={styles.hintText}>{t("scanner.hintPrimary")}</Text>
        </View>
        <Text style={styles.hintSecondary}>{t("scanner.hintSecondary")}</Text>
      </View>

      {/* Controls row */}
      <View style={styles.controlsRow}>
        <FlashToggle enabled={flashEnabled} onToggle={toggleFlash} />
        <PhotoCaptureButton onPress={handlePhoto} disabled={isProcessing} />
        <GlassButton onPress={handleGallery} accessibilityLabel={t("scanner.gallery")}>
          <ImageIcon size={22} color="#FFFFFF" />
        </GlassButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    zIndex: 1,
  },
  frameContainer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    marginTop: -40,
  },
  hintContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "38%",
    alignItems: "center",
    zIndex: 3,
    gap: 6,
  },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  hintText: {
    fontFamily: fonts.body600,
    fontSize: 12,
    color: "#FFFFFF",
  },
  hintSecondary: {
    fontFamily: fonts.body400,
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
  },
  controlsRow: {
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    zIndex: 4,
  },
  glassButton: {
    width: GLASS_BUTTON_SIZE,
    height: GLASS_BUTTON_SIZE,
    borderRadius: GLASS_BUTTON_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  glassBlur: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: GLASS_BUTTON_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  glassAndroid: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
});
