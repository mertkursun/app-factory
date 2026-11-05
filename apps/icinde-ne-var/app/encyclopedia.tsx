import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Search, ChevronDown, ChevronUp } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme, fonts, spacing, radius } from "@/theme/tokens";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchIngredients, usePopularIngredients } from "@/hooks/useEncyclopedia";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import type { Database } from "@/lib/database.types";

type MaddeRow = Database["public"]["Tables"]["maddeler"]["Row"];

type RiskSeviyesi = MaddeRow["risk_seviyesi"];
type BadgeStatus = "success" | "warning" | "danger";

const DEBOUNCE_MS = 300;

const RISK_STATUS_MAP: Record<RiskSeviyesi, BadgeStatus> = {
  guvenli: "success",
  dikkat: "warning",
  sakincali: "danger",
};

const RISK_I18N_KEY: Record<RiskSeviyesi, string> = {
  guvenli: "encyclopedia.safe",
  dikkat: "encyclopedia.caution",
  sakincali: "encyclopedia.danger",
};

const CATEGORY_I18N_KEY: Record<string, string> = {
  gida: "encyclopedia.categoryFood",
  kozmetik: "encyclopedia.categoryCosmetic",
  temizlik: "encyclopedia.categoryCleaning",
  genel: "encyclopedia.categoryGeneral",
};

// ── Ingredient Detail Card ──────────────────────────────────────

interface IngredientDetailProps {
  item: MaddeRow;
}

function IngredientDetail({ item }: IngredientDetailProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
      <View style={[s.detailContainer, { borderTopColor: colors.border }]}>
        {/* Function */}
        {item.islev ? (
          <View style={s.detailRow}>
            <Text style={[s.detailLabel, { color: colors.muted }]}>
              {t("encyclopedia.function")}
            </Text>
            <Text style={[s.detailValue, { color: colors.text }]}>{item.islev}</Text>
          </View>
        ) : null}

        {/* Category */}
        <View style={s.detailRow}>
          <Text style={[s.detailLabel, { color: colors.muted }]}>{t("encyclopedia.category")}</Text>
          <Text style={[s.detailValue, { color: colors.text }]}>
            {t(CATEGORY_I18N_KEY[item.kategori] ?? "encyclopedia.categoryGeneral")}
          </Text>
        </View>

        {/* Source */}
        {item.kaynak ? (
          <View style={s.detailRow}>
            <Text style={[s.detailLabel, { color: colors.muted }]}>{t("encyclopedia.source")}</Text>
            <Text style={[s.detailValue, { color: colors.textSecondary }]}>{item.kaynak}</Text>
          </View>
        ) : null}

        {/* Synonyms */}
        {item.es_anlamlilar && item.es_anlamlilar.length > 0 ? (
          <View style={s.detailRow}>
            <Text style={[s.detailLabel, { color: colors.muted }]}>
              {t("encyclopedia.synonyms")}
            </Text>
            <Text style={[s.detailValue, { color: colors.textSecondary }]}>
              {item.es_anlamlilar.join(", ")}
            </Text>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

// ── Ingredient Row ──────────────────────────────────────────────

interface IngredientRowProps {
  item: MaddeRow;
  isExpanded: boolean;
  onToggle: () => void;
}

function IngredientRow({ item, isExpanded, onToggle }: IngredientRowProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const badgeStatus = RISK_STATUS_MAP[item.risk_seviyesi];
  const badgeLabel = t(RISK_I18N_KEY[item.risk_seviyesi]);
  const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;

  return (
    <Card style={s.ingredientCard}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${item.ad} — ${badgeLabel}`}
        accessibilityState={{ expanded: isExpanded }}
        style={s.ingredientPressable}
      >
        <View style={s.ingredientHeader}>
          <View style={s.ingredientNameRow}>
            <Text numberOfLines={1} style={[s.ingredientName, { color: colors.text }]}>
              {item.ad}
            </Text>
            <Badge label={badgeLabel} status={badgeStatus} />
          </View>
          <ChevronIcon size={16} color={colors.muted} />
        </View>
      </Pressable>
      {isExpanded ? <IngredientDetail item={item} /> : null}
    </Card>
  );
}

// ── Empty Search State ──────────────────────────────────────────

function EmptySearchState() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={s.emptyContainer}>
      <View style={[s.emptyIconWrap, { backgroundColor: colors.surfaceTint }]}>
        <Search size={28} color={colors.muted} />
      </View>
      <Text style={[s.emptyTitle, { color: colors.text }]}>{t("encyclopedia.noResults")}</Text>
      <Text style={[s.emptyHint, { color: colors.muted }]}>{t("encyclopedia.noResultsHint")}</Text>
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────

export default function EncyclopediaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(searchText.trim(), DEBOUNCE_MS);

  const isSearching = debouncedQuery.length >= 2;

  const searchResult = useSearchIngredients(debouncedQuery);
  const popularResult = usePopularIngredients();

  const items = isSearching ? (searchResult.data ?? []) : (popularResult.data ?? []);
  const isError = isSearching ? searchResult.isError : popularResult.isError;
  const refetch = isSearching ? searchResult.refetch : popularResult.refetch;

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MaddeRow }) => (
      <IngredientRow
        item={item}
        isExpanded={expandedId === item.id}
        onToggle={() => handleToggle(item.id)}
      />
    ),
    [expandedId, handleToggle],
  );

  const keyExtractor = useCallback((item: MaddeRow) => item.id, []);

  const sectionTitle = isSearching ? undefined : t("encyclopedia.popular");

  if (popularResult.isLoading && !isSearching) {
    return <LoadingScreen message={t("encyclopedia.loading")} />;
  }

  if (isError && items.length === 0) {
    return (
      <ErrorScreen
        title={t("encyclopedia.error")}
        message={t("encyclopedia.errorMessage")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          style={[
            s.backButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            shadow.low,
          ]}
        >
          <ChevronLeft size={18} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.text }]}>{t("encyclopedia.title")}</Text>
        <View style={s.headerSpacer} />
      </View>

      {/* Search bar */}
      <View style={s.searchContainer}>
        <View
          style={[
            s.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.muted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t("encyclopedia.searchPlaceholder")}
            placeholderTextColor={colors.muted}
            style={[s.searchInput, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={t("encyclopedia.searchPlaceholder")}
          />
          {isSearching && searchResult.isFetching ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}
        </View>
      </View>

      {/* Section label */}
      {sectionTitle ? (
        <Text style={[s.sectionLabel, { color: colors.muted }]}>{sectionTitle}</Text>
      ) : null}

      {/* Results */}
      {isSearching && !searchResult.isFetching && items.length === 0 ? (
        <EmptySearchState />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={s.listContent}
          ItemSeparatorComponent={() => <View style={s.separator} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body400,
    fontSize: 14,
    paddingVertical: 0,
  },
  sectionLabel: {
    fontFamily: fonts.body800,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: spacing.screenX + 4,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 8,
    paddingBottom: 100,
  },
  separator: {
    height: 8,
  },
  ingredientCard: {
    overflow: "hidden",
  },
  ingredientPressable: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ingredientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientNameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientName: {
    fontFamily: fonts.body600,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  detailContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 12,
    marginHorizontal: 0,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontFamily: fonts.body800,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  detailValue: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 19.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: fonts.display700,
    fontSize: 16,
    textAlign: "center",
  },
  emptyHint: {
    fontFamily: fonts.body400,
    fontSize: 13,
    textAlign: "center",
  },
});
