import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { IngredientList } from "@/components/ingredients/IngredientList";
import { IconButton } from "@/components/ui/IconButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyzeProduct } from "@/hooks/useAnalysis";
import { useAddToHistory } from "@/hooks/useHistory";
import { useProfile } from "@/hooks/useProfile";
import { useTheme, typography, fonts, radius, spacing } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

const PHOTO_CARD_HEIGHT = 92;
const OCR_CONFIDENCE = 94;

export default function IngredientConfirmScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const analyzeMutation = useAnalyzeProduct();
  const addHistoryMutation = useAddToHistory();

  const { photoUri, ingredients: rawIngredients } = useLocalSearchParams<{
    photoUri: string;
    ingredients: string;
  }>();

  const initialIngredients: string[] = rawIngredients ? JSON.parse(rawIngredients) : [];
  const [items, setItems] = useState<string[]>(initialIngredients);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleAdd = useCallback(() => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
    setShowAddInput(false);
  }, [newItem, items]);

  const handleRemove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddPress = useCallback(() => {
    setShowAddInput(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting || items.length === 0) return;
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const audiences = profile?.audiences ?? [];
      const result = await analyzeMutation.mutateAsync({
        photoUri,
        ingredients: items,
        audiences,
      });

      addHistoryMutation.mutate({
        user_id: user.id,
        analiz_id: result.analysis.id,
        barkod: result.analysis.barkod ?? undefined,
        urun_adi: result.analysis.urun_adi ?? undefined,
        skor: result.analysis.skor as SkorRenk,
      });

      router.push(`/analysis/${result.analysis.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("ingredients.analyzeError");
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    items,
    user,
    profile,
    analyzeMutation,
    addHistoryMutation,
    photoUri,
    router,
    t,
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon={<ArrowLeft size={20} color={colors.text} />}
            onPress={() => router.back()}
            accessibilityLabel={t("common.back")}
          />
          <Text
            style={[
              { fontFamily: fonts.body700, fontSize: 17, color: colors.text },
              styles.headerTitle,
            ]}
            numberOfLines={1}
          >
            {t("ingredients.confirm")}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photo card */}
          <View style={[styles.photoCard, { borderRadius: radius.lg }]}>
            <LinearGradient
              colors={["#243633", "#121F1D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.photoGradient, { borderRadius: radius.lg }]}
            >
              {/* Decorative OCR lines */}
              <View style={styles.ocrLinesContainer}>
                {[40, 28, 36, 20, 32].map((w, i) => (
                  <View key={i} style={[styles.ocrLine, { width: `${w}%` }]} />
                ))}
              </View>

              {/* Retake pill */}
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel={t("ingredients.retake")}
                style={({ pressed }) => [
                  styles.retakePill,
                  {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <RefreshCw size={12} color="#FFFFFF" />
                <Text style={styles.retakeText}>{t("ingredients.retake")}</Text>
              </Pressable>

              {/* OCR confidence */}
              <Text style={styles.ocrConfidence}>
                {t("ingredients.ocrConfidence", { percent: OCR_CONFIDENCE })}
              </Text>
            </LinearGradient>
          </View>

          {/* Error banner */}
          {submitError ? (
            <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg }]}>
              <Text style={[typography.bodySecondary, { color: colors.dangerText }]}>
                {submitError}
              </Text>
            </View>
          ) : null}

          {/* Ingredient list */}
          <IngredientList
            items={items}
            onRemove={handleRemove}
            onAddPress={handleAddPress}
            disabled={isSubmitting}
          />

          {/* Inline add input */}
          {showAddInput ? (
            <View style={[styles.addInputRow, { borderColor: colors.border }]}>
              <TextInput
                autoFocus
                style={[
                  styles.addInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    fontFamily: fonts.body400,
                  },
                ]}
                placeholder={t("ingredients.addPlaceholder")}
                placeholderTextColor={colors.muted}
                value={newItem}
                onChangeText={setNewItem}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                editable={!isSubmitting}
                accessibilityLabel={t("ingredients.addInput")}
              />
            </View>
          ) : null}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <PrimaryButton
            label={t("ingredients.analyzeButton")}
            onPress={handleConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting || items.length === 0}
            icon={<Sparkles size={18} color={colors.primaryFg} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 16,
  },
  photoCard: {
    height: PHOTO_CARD_HEIGHT,
    overflow: "hidden",
    marginBottom: 20,
  },
  photoGradient: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  ocrLinesContainer: {
    gap: 5,
  },
  ocrLine: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 1,
  },
  retakePill: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  retakeText: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  ocrConfidence: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: "#9BF0E3",
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  addInputRow: {
    marginTop: 12,
  },
  addInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  bottomCta: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
