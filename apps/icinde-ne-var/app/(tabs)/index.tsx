import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraOff, AlertTriangle, X, Crown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { useScanFlow } from "@/hooks/useScanFlow";
import { ScannerView } from "@/components/scanner/ScannerView";
import { QuotaBadge } from "@/components/scanner/QuotaBadge";

const CAMERA_OFF_ICON_SIZE = 40;
const ICON_SIZE = 20;
const MUTED_COLOR = "#78716C";
const WHITE = "#FFFFFF";
const PRESSED_SCALE = 0.96;

export default function ScanScreen() {
  const router = useRouter();
  const {
    isGranted,
    canAskAgain,
    isLoading: permissionLoading,
    requestPermission,
  } = useCameraPermission();
  const {
    isAnalyzing,
    error,
    isQuotaExhausted,
    handleBarcodeScanned,
    handlePhotoTaken,
    clearError,
  } = useScanFlow();

  if (permissionLoading) {
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
        isProcessing={isAnalyzing}
      />

      {/* Kota doldu banner */}
      {isQuotaExhausted && !isAnalyzing && (
        <View className="absolute bottom-44 left-4 right-4 bg-danger-light rounded-xl p-4 gap-3">
          <View className="flex-row items-center gap-2">
            <AlertTriangle size={ICON_SIZE} color="#991B1B" />
            <Text className="text-danger-text font-label flex-1">Tarama Kotanız Doldu</Text>
          </View>
          <Text className="text-sm font-body text-danger-text/80">
            Bu ay için ücretsiz tarama hakkınız kalmadı.
          </Text>
          <Pressable
            onPress={() => router.push("/paywall")}
            accessibilityRole="button"
            accessibilityLabel="Pro'ya yükselt"
            className="bg-primary h-11 rounded-lg items-center justify-center flex-row gap-2"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? PRESSED_SCALE : 1 }],
            })}
          >
            <Crown size={ICON_SIZE} color={WHITE} />
            <Text className="text-white font-label">Pro&apos;ya Yükselt</Text>
          </Pressable>
        </View>
      )}

      {/* Hata mesaji */}
      {error && !isAnalyzing && (
        <View className="absolute bottom-44 left-4 right-4 bg-surface rounded-xl p-4 gap-2 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <AlertTriangle size={ICON_SIZE} color="#991B1B" />
              <Text className="text-text font-label flex-1" numberOfLines={1}>
                Hata
              </Text>
            </View>
            <Pressable
              onPress={clearError}
              accessibilityRole="button"
              accessibilityLabel="Hatayı kapat"
              className="w-8 h-8 items-center justify-center"
            >
              <X size={ICON_SIZE} color={MUTED_COLOR} />
            </Pressable>
          </View>
          <Text className="text-sm font-body text-text-secondary">{error}</Text>
        </View>
      )}

      {/* Analiz loading overlay */}
      {isAnalyzing && (
        <View className="absolute inset-0 bg-white/60 items-center justify-center z-20">
          <View className="bg-surface rounded-2xl p-8 items-center gap-4 shadow-lg">
            <ActivityIndicator size="large" color="#0F766E" />
            <Text className="text-base font-label text-text">Analiz ediliyor...</Text>
            <Text className="text-sm font-caption text-text-secondary text-center">
              Ürün içeriği inceleniyor
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
