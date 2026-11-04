import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Sparkles, RotateCcw, X, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/ui/IconButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { useAnalyzeProduct } from "@/hooks/useAnalysis";
import { useAddToHistory } from "@/hooks/useHistory";
import { useProfile } from "@/hooks/useProfile";
import { useTheme, fonts, radius, spacing } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

const PHOTO_CARD_HEIGHT = 92;

export default function IngredientConfirmScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(user?.id);
  const analyzeMutation = useAnalyzeProduct();
  const addHistoryMutation = useAddToHistory();

  const { photoUri, ingredients: rawIngredients } = useLocalSearchParams<{
    photoUri: string;
    ingredients: string;
  }>();

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
            <LinearGradient
              colors={["#243633", "#121F1D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.photoGradient}
            >
              {/* Decorative OCR lines */}
              <View style={styles.ocrLinesContainer}>
                <View style={[styles.ocrLineFirst, { width: "60%" }]} />
                <View style={[styles.ocrLine, { width: "95%" }]} />
                <View style={[styles.ocrLine, { width: "88%" }]} />
                <View style={[styles.ocrLine, { width: "70%" }]} />
                <View style={[styles.ocrLine, { width: "92%" }]} />
              </View>

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
                <Sparkles size={12} color="#9BF0E3" strokeWidth={2.5} />
                <Text style={styles.ocrConfidence}>{t("ingredients.readByAi")}</Text>
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

          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("ingredients.extracted")}
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
            <FlatList
              data={items}
              scrollEnabled={false}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <View
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
              )}
              ListFooterComponent={
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
              }
            />
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
  ocrLinesContainer: {
    gap: 6,
    paddingRight: 74,
  },
  ocrLineFirst: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  ocrLine: {
    height: 4,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
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
