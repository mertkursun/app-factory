import { useCallback } from "react";
import { View, Text, StyleSheet, Platform, Pressable, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraOff, AlertTriangle, X, Crown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { useMediaLibraryPermission } from "@/hooks/useMediaLibraryPermission";
import { useScanFlow } from "@/hooks/useScanFlow";
import { ScannerView } from "@/components/scanner/ScannerView";
import { QuotaBadge } from "@/components/scanner/QuotaBadge";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useTheme, fonts } from "@/theme/tokens";

const ICON_SIZE = 20;

export default function ScanScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isGranted,
    canAskAgain,
    isLoading: permissionLoading,
    requestPermission,
  } = useCameraPermission();
  const mediaLib = useMediaLibraryPermission();
  const {
    isAnalyzing,
    error,
    isQuotaExhausted,
    handleBarcodeScanned,
    handlePhotoTaken,
    clearError,
  } = useScanFlow();

  const handleGalleryPress = useCallback(async () => {
    let hasAccess = mediaLib.isGranted;

    if (!hasAccess) {
      hasAccess = await mediaLib.requestPermission();
    }

    if (!hasAccess) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      handlePhotoTaken(result.assets[0].uri);
    }
  }, [mediaLib, handlePhotoTaken]);

  if (permissionLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.cameraBg }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!isGranted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={styles.permissionContent}>
          <View style={[styles.permissionIcon, { backgroundColor: colors.surfaceTint }]}>
            <CameraOff size={40} color={colors.muted} />
          </View>
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            {t("scanner.cameraPermissionRequired")}
          </Text>
          <Text style={[styles.permissionDesc, { color: colors.textSecondary }]}>
            {t("scanner.cameraPermissionDesc")}
          </Text>
          {canAskAgain ? (
            <PrimaryButton
              label={t("scanner.grantPermission")}
              onPress={requestPermission}
              height={48}
            />
          ) : (
            <Text style={[styles.settingsHint, { color: colors.muted }]}>
              {t("scanner.openSettings")}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.cameraBg }]}>
      <ScannerView
        onBarcodeScanned={handleBarcodeScanned}
        onPhotoTaken={handlePhotoTaken}
        isProcessing={isAnalyzing}
        onGalleryPress={handleGalleryPress}
        isGalleryDisabled={mediaLib.isDenied}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { top: insets.top + 12 }]}>
        <BrandPill />
        <QuotaBadge />
      </View>

      {/* Quota exhausted banner */}
      {isQuotaExhausted && !isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.dangerBg }]}>
          <View style={styles.bannerRow}>
            <AlertTriangle size={ICON_SIZE} color={colors.dangerText} />
            <Text style={[styles.bannerTitle, { color: colors.dangerText }]}>
              {t("scanner.quotaExhausted")}
            </Text>
          </View>
          <Text style={[styles.bannerDesc, { color: colors.dangerText, opacity: 0.8 }]}>
            {t("scanner.quotaExhaustedDesc")}
          </Text>
          <PrimaryButton
            label={t("scanner.upgradePro")}
            onPress={() => router.push("/paywall")}
            height={44}
            icon={<Crown size={18} color={colors.primaryFg} />}
          />
        </View>
      )}

      {/* Error banner */}
      {error && !isAnalyzing && (
        <View style={[styles.banner, { backgroundColor: colors.surface }]}>
          <View style={styles.bannerRowBetween}>
            <View style={styles.bannerRow}>
              <AlertTriangle size={ICON_SIZE} color={colors.dangerText} />
              <Text style={[styles.bannerTitle, { color: colors.text }]} numberOfLines={1}>
                {t("common.error")}
              </Text>
            </View>
            <Pressable
              onPress={clearError}
              accessibilityRole="button"
              accessibilityLabel={t("scanner.closeError")}
              style={styles.closeButton}
            >
              <X size={ICON_SIZE} color={colors.muted} />
            </Pressable>
          </View>
          <Text style={[styles.bannerDesc, { color: colors.textSecondary }]}>{error}</Text>
        </View>
      )}

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <View style={[styles.analyzingCard, { backgroundColor: colors.surface }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.analyzingTitle, { color: colors.text }]}>
              {t("common.analyzing")}
            </Text>
            <Text style={[styles.analyzingDesc, { color: colors.textSecondary }]}>
              {t("scanner.analyzingSubtitle")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function BrandPill() {
  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={16} tint="dark" style={styles.brandPillBlur}>
        <BrandPillContent />
      </BlurView>
    );
  }

  return (
    <View style={[styles.brandPillBlur, styles.brandPillAndroid]}>
      <BrandPillContent />
    </View>
  );
}

function BrandPillContent() {
  return (
    <View style={styles.brandPillInner}>
      <Logo size={22} variant="white" />
      <Text style={styles.brandText}>{"İçinde Ne Var?"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionContent: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: {
    fontFamily: fonts.display700,
    fontSize: 20,
    textAlign: "center",
  },
  permissionDesc: {
    fontFamily: fonts.body400,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  settingsHint: {
    fontFamily: fonts.body500,
    fontSize: 13,
    textAlign: "center",
  },
  topBar: {
    position: "absolute",
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  brandPillBlur: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  brandPillAndroid: {
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  brandPillInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 7,
  },
  brandText: {
    fontFamily: fonts.display700,
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  banner: {
    position: "absolute",
    bottom: 110,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    zIndex: 20,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bannerRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontFamily: fonts.body700,
    fontSize: 14,
    flex: 1,
  },
  bannerDesc: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 19,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  analyzingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  analyzingCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  analyzingTitle: {
    fontFamily: fonts.body700,
    fontSize: 16,
  },
  analyzingDesc: {
    fontFamily: fonts.body500,
    fontSize: 13,
    textAlign: "center",
  },
});
