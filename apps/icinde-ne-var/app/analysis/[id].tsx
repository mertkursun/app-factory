import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useAnalysis } from "@/hooks/useAnalysis";
import { ScoreCircle } from "@/components/analysis/ScoreCircle";
import { ProfileWarnings } from "@/components/analysis/ProfileWarnings";
import { ExplanationCard } from "@/components/analysis/ExplanationCard";
import { IngredientDetails } from "@/components/analysis/IngredientDetails";
import { UnknownIngredients } from "@/components/analysis/UnknownIngredients";
import { DisclaimerNote } from "@/components/analysis/DisclaimerNote";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import type { SkorRenk } from "@/lib/schemas";

interface AnalysisMadde {
  maddeId: string | null;
  ad: string;
  riskSeviyesi: string;
  islev: string | null;
  kaynak: string | null;
  aiTahmini: boolean;
}

interface ProfilUyarisi {
  kitle: string;
  maddeAd: string;
  riskSeviyesi: string;
  aciklama: string;
}

export default function AnalysisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: analysis, isLoading, error } = useAnalysis(id);

  if (isLoading) {
    return <LoadingScreen message="Analiz yükleniyor..." />;
  }

  if (error || !analysis) {
    return (
      <ErrorScreen
        title="Analiz bulunamadı"
        message="Analiz sırasında bir sorun oluştu. Tekrar deneyin."
        onRetry={() => router.back()}
      />
    );
  }

  const maddeler = (analysis.maddeler as AnalysisMadde[] | null) ?? [];
  const profilUyarilari = (analysis.profil_uyarilari as ProfilUyarisi[] | null) ?? [];
  const skor = analysis.skor as SkorRenk;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Geri"
          style={{ minHeight: 44, minWidth: 44 }}
          className="items-center justify-center"
        >
          <ArrowLeft size={24} color="#1C1917" />
        </Pressable>
        <Text className="text-lg font-title text-text flex-1" numberOfLines={1}>
          {analysis.urun_adi ?? "Sonuç"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profil uyarıları (en üstte) */}
        {profilUyarilari.length > 0 && <ProfileWarnings warnings={profilUyarilari} />}

        {/* Skor dairesi */}
        <ScoreCircle skor={skor} />

        {/* Ürün bilgisi */}
        <View className="items-center mb-4">
          <Text className="text-base font-title text-text text-center">
            {analysis.urun_adi ?? "Bilinmeyen Ürün"}
          </Text>
          <Text className="text-sm font-caption text-text-secondary mt-1">
            {analysis.kategori.charAt(0).toUpperCase() + analysis.kategori.slice(1)}
            {analysis.barkod ? ` — ${analysis.barkod}` : ""}
          </Text>
        </View>

        {/* Claude açıklaması */}
        <ExplanationCard text={analysis.aciklama} />

        {/* Madde detayları (accordion) */}
        <IngredientDetails maddeler={maddeler} />

        {/* Bilinmeyen maddeler */}
        {analysis.bilinmeyenler.length > 0 && <UnknownIngredients items={analysis.bilinmeyenler} />}

        {/* Disclaimer */}
        <DisclaimerNote />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
