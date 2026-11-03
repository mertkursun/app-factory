import { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Plus, Check } from "lucide-react-native";
import { Image } from "expo-image";
import { IngredientList } from "@/components/ingredients/IngredientList";

const ICON_SIZE = 24;
const SMALL_ICON_SIZE = 20;
const TEXT_COLOR = "#1C1917";
const MUTED_COLOR = "#78716C";
const WHITE = "#FFFFFF";
const PRESSED_SCALE = 0.96;
const THUMBNAIL_HEIGHT = 80;

export default function IngredientConfirmScreen() {
  const router = useRouter();
  const { photoUri, ingredients: rawIngredients } = useLocalSearchParams<{
    photoUri: string;
    ingredients: string;
  }>();

  const initialIngredients: string[] = rawIngredients ? JSON.parse(rawIngredients) : [];
  const [items, setItems] = useState<string[]>(initialIngredients);
  const [newItem, setNewItem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = useCallback(() => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
  }, [newItem, items]);

  const handleRemove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);
    // T14'te Edge Function entegrasyonu yapilacak
    // analyzeProduct({ photoUri, ingredients: items, audiences: [...] })
    // eslint-disable-next-line no-console
    console.log("Analiz baslatiliyor:", items);
    setIsSubmitting(false);
  }, [isSubmitting, items]);

  const isConfirmDisabled = isSubmitting || items.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 gap-3">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Geri"
            className="w-11 h-11 items-center justify-center rounded-full"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? PRESSED_SCALE : 1 }],
            })}
          >
            <ArrowLeft size={ICON_SIZE} color={TEXT_COLOR} />
          </Pressable>
          <Text className="text-lg font-title text-text flex-1">{"İçeriği Onayla"}</Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Fotograf onizleme */}
          {photoUri ? (
            <View
              className="w-full rounded-md overflow-hidden mb-4"
              style={{ height: THUMBNAIL_HEIGHT }}
            >
              <Image
                source={{ uri: photoUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                accessibilityLabel="Fotoğraf önizleme"
              />
            </View>
          ) : null}

          {/* Aciklama */}
          <Text className="text-sm font-caption text-text-secondary mb-4">
            {
              "Fotoğraftan çıkarılan maddeler aşağıda. Eksik veya yanlış olanları düzenleyebilirsiniz."
            }
          </Text>

          {/* Madde listesi */}
          <IngredientList items={items} onRemove={handleRemove} disabled={isSubmitting} />

          {/* Yeni madde ekle */}
          <View className="flex-row items-center gap-2 mt-4 mb-6">
            <TextInput
              className="flex-1 h-12 bg-surface border border-border rounded-sm px-4 text-base font-body text-text"
              placeholder="Madde ekle..."
              placeholderTextColor={MUTED_COLOR}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              editable={!isSubmitting}
              accessibilityLabel="Yeni madde gir"
            />
            <Pressable
              onPress={handleAdd}
              disabled={isSubmitting || newItem.trim().length === 0}
              accessibilityRole="button"
              accessibilityLabel="Madde ekle"
              className="w-12 h-12 bg-primary rounded-full items-center justify-center"
              style={({ pressed }) => ({
                transform: [{ scale: pressed && !isSubmitting ? PRESSED_SCALE : 1 }],
                opacity: isSubmitting || newItem.trim().length === 0 ? 0.5 : 1,
              })}
            >
              <Plus size={SMALL_ICON_SIZE} color={WHITE} />
            </Pressable>
          </View>
        </ScrollView>

        {/* Alt buton — sticky bottom */}
        <View className="px-4 pb-4">
          <Pressable
            onPress={handleConfirm}
            disabled={isConfirmDisabled}
            accessibilityRole="button"
            accessibilityLabel={
              isSubmitting ? "Analiz ediliyor" : `${items.length} maddeyi analiz et`
            }
            className="bg-primary h-14 rounded-full flex-row items-center justify-center gap-2"
            style={({ pressed }) => ({
              transform: [{ scale: pressed && !isConfirmDisabled ? PRESSED_SCALE : 1 }],
              opacity: isConfirmDisabled ? 0.5 : 1,
            })}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <Check size={SMALL_ICON_SIZE} color={WHITE} />
            )}
            <Text className="text-white text-base font-label">
              {isSubmitting ? "Analiz ediliyor..." : `${items.length} Maddeyi Analiz Et`}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
