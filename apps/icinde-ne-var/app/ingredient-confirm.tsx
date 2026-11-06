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
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Sparkles, RotateCcw, X, Plus, Camera } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/ui/IconButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyzeProduct } from "@/hooks/useAnalysis";
import { useAddToHistory } from "@/hooks/useHistory";
import { useProfile } from "@/hooks/useProfile";
import { uploadPhoto } from "@/lib/photoUpload";
import { extractIngredients } from "@/services/ocr";
import { launchCameraAsync, MediaTypeOptions } from "expo-image-picker";
import { useTheme, fonts, radius, spacing } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

const PHOTO_CARD_HEIGHT = 160;

export default function IngredientConfirmScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, shadow } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const analyzeMutation = useAnalyzeProduct();
  const addHistoryMutation = useAddToHistory();

  const {
    photoUri,
    storagePath,
    ingredients: rawIngredients,
    productName: routeProductName,
    category: routeCategory,
    brand: routeBrand,
    countryOfOrigin: routeCountryOfOrigin,
    ingredientsFromLabel: routeIngredientsFromLabel,
  } = useLocalSearchParams<{
    photoUri: string;
    storagePath: string;
    ingredients: string;
    productName: string;
    category: string;
    brand: string;
    countryOfOrigin: string;
    ingredientsFromLabel: string;
  }>();

  const [isFromLabel, setIsFromLabel] = useState(routeIngredientsFromLabel === "true");
  const [isRescanningLabel, setIsRescanningLabel] = useState(false);
  const [currentPhotoUri, setCurrentPhotoUri] = useState(photoUri ?? "");

  const initialIngredients: string[] = (() => {
    if (!rawIngredients) return [];
    try {
      const parsed: unknown = JSON.parse(rawIngredients);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return parsed as string[];
      }
      return [];
    } catch {
      return [];
    }
  })();
  const [items, setItems] = useState<string[]>(initialIngredients);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleRescanLabel = useCallback(async () => {
    if (isRescanningLabel) return;
    try {
      const result = await launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;

      setIsRescanningLabel(true);
      const newUri = result.assets[0].uri;
      const newStoragePath = await uploadPhoto(newUri);
      const lang = i18n.language;
      const ocrResult = await extractIngredients(newStoragePath, lang);

      if (ocrResult.ingredients.length > 0) {
        setItems(ocrResult.ingredients);
        setIsFromLabel(ocrResult.ingredientsFromLabel);
        setCurrentPhotoUri(newUri);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("scanner.photoError");
      setSubmitError(message);
    } finally {
      setIsRescanningLabel(false);
    }
  }, [isRescanningLabel, i18n, t]);

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
      const lang = i18n.language;
      const result = await analyzeMutation.mutateAsync({
        storagePath: storagePath ?? undefined,
        ingredients: items,
        productName: routeProductName || undefined,
        category: routeCategory || undefined,
        brand: routeBrand || undefined,
        countryOfOrigin: routeCountryOfOrigin || undefined,
        audiences,
        lang,
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
    storagePath,
    routeProductName,
    routeCategory,
    routeBrand,
    routeCountryOfOrigin,
    router,
    t,
    i18n,
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
            icon={<ChevronLeft size={18} color={colors.text} />}
            onPress={() => router.back()}
            accessibilityLabel={t("common.back")}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
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
          <View style={[styles.photoCard, shadow.card]}>
            {currentPhotoUri ? (
              <Image
                source={{ uri: currentPhotoUri }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
            ) : null}
            <LinearGradient
              colors={["rgba(18,31,29,0.3)", "rgba(18,31,29,0.85)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.photoGradient}
            >
              {/* Retake pill */}
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel={t("ingredients.retake")}
                style={({ pressed }) => [styles.retakePill, { opacity: pressed ? 0.7 : 1 }]}
              >
                <RotateCcw size={12} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.retakeText}>{t("ingredients.retake")}</Text>
              </Pressable>

              {/* AI read indicator */}
              <View style={styles.ocrConfidenceRow}>
                <Sparkles size={12} color={isFromLabel ? "#9BF0E3" : "#FFD580"} strokeWidth={2.5} />
                <Text style={[styles.ocrConfidence, !isFromLabel && { color: "#FFD580" }]}>
                  {isFromLabel ? t("ingredients.readByAi") : t("ingredients.estimatedByAi")}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Error banner */}
          {submitError ? (
            <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg }]}>
              <Text style={{ fontFamily: fonts.body500, fontSize: 13, color: colors.dangerText }}>
                {submitError}
              </Text>
            </View>
          ) : null}

          {/* AI estimation warning + rescan CTA */}
          {!isFromLabel && items.length > 0 ? (
            <View style={[styles.estimationBanner, { backgroundColor: colors.warningBg }]}>
              <Text style={{ fontFamily: fonts.body500, fontSize: 13, color: colors.warningText }}>
                {t("ingredients.estimationWarning")}
              </Text>
              <Pressable
                onPress={handleRescanLabel}
                disabled={isRescanningLabel}
                accessibilityRole="button"
                accessibilityLabel={t("ingredients.scanLabel")}
                style={[
                  styles.rescanBtn,
                  {
                    backgroundColor: colors.warning,
                    opacity: isRescanningLabel ? 0.6 : 1,
                  },
                ]}
              >
                <Camera size={14} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.rescanBtnText}>
                  {isRescanningLabel ? t("ingredients.scanning") : t("ingredients.scanLabel")}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isFromLabel ? t("ingredients.extracted") : t("ingredients.estimated")}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.surfaceTint }]}>
              <Text
                style={{
                  fontFamily: fonts.body800,
                  fontSize: 11,
                  color: colors.primaryDeep,
                }}
              >
                {items.length}
              </Text>
            </View>
          </View>

          {/* Ingredient list card */}
          <Card style={styles.listCard} borderRadius={radius.lg}>
            {items.map((item, index) => (
              <View
                key={`${item}-${index}`}
                style={[
                  styles.ingredientRow,
                  index < items.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.ingredientText, { color: colors.text }]} numberOfLines={1}>
                  {item}
                </Text>
                <Pressable
                  onPress={() => handleRemove(index)}
                  disabled={isSubmitting}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t("ingredients.removeIngredient", { name: item })}
                  style={({ pressed }) => ({
                    minWidth: 44,
                    minHeight: 44,
                    alignItems: "center" as const,
                    justifyContent: "center" as const,
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <X size={14} color={colors.muted} strokeWidth={2.2} />
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={handleAddPress}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={t("ingredients.addButton")}
              style={styles.addButton}
            >
              <Plus size={14} color={colors.primary} strokeWidth={2.5} />
              <Text style={[styles.addButtonText, { color: colors.primary }]}>
                {t("ingredients.addButton")}
              </Text>
            </Pressable>
          </Card>

          {/* Inline add input */}
          {showAddInput ? (
            <View style={styles.addInputRow}>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    letterSpacing: -0.3,
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
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: 18,
  },
  photoGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  retakePill: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  retakeText: {
    fontFamily: fonts.body700,
    fontSize: 11,
    color: "#FFFFFF",
  },
  ocrConfidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ocrConfidence: {
    fontFamily: fonts.body600,
    fontSize: 11,
    color: "#9BF0E3",
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  estimationBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  rescanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  rescanBtnText: {
    fontFamily: fonts.body700,
    fontSize: 12,
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: fonts.display700,
    fontSize: 15,
  },
  countBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  listCard: {
    flex: 1,
    overflow: "hidden",
    marginTop: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ingredientText: {
    fontFamily: fonts.body500,
    fontSize: 13,
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontFamily: fonts.body700,
    fontSize: 13,
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
    paddingBottom: 20,
    paddingTop: 14,
  },
});
