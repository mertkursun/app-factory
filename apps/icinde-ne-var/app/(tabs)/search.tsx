import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Search, SearchX, TrendingUp } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme, fonts, spacing, typography, radius } from "@/theme/tokens";
import { useSearchProducts, usePopularProducts } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/Badge";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import type { Database } from "@/lib/database.types";
import type { SkorRenk } from "@/lib/schemas";

type AnalysisRow = Database["public"]["Tables"]["urun_analizleri"]["Row"];
type CategoryFilter = "gida" | "kozmetik" | "temizlik" | "genel" | null;

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const PRESS_SCALE = 0.96;
const PRESS_DURATION_MS = 150;

// -- Filter Chip -----------------------------------------------------------

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  dotColor?: string;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  gida: "#E39B07",
  kozmetik: "#D95BA3",
  temizlik: "#3B82F6",
  genel: "#6E807C",
};

function FilterChip({ label, isActive, onPress, dotColor }: FilterChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? colors.text : colors.surface,
          borderColor: isActive ? colors.text : colors.border,
          borderWidth: isActive ? 0 : 1,
        },
      ]}
    >
      {dotColor && !isActive && <View style={[styles.chipDot, { backgroundColor: dotColor }]} />}
      <Text
        style={[
          styles.chipText,
          {
            color: isActive ? colors.background : colors.textSecondary,
            fontWeight: isActive ? "700" : "600",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// -- Product Card ----------------------------------------------------------

const STATUS_CONFIG = {
  yesil: { key: "success" as const, i18nKey: "analysis.safe" },
  sari: { key: "warning" as const, i18nKey: "analysis.caution" },
  kirmizi: { key: "danger" as const, i18nKey: "analysis.danger" },
} as const;

const KATEGORI_KEYS: Record<string, string> = {
  gida: "search.categoryFood",
  kozmetik: "search.categoryCosmetics",
  temizlik: "search.categoryCleaning",
  genel: "search.categoryGeneral",
};

interface ProductCardProps {
  item: AnalysisRow;
  onPress: () => void;
}

function ProductCard({ item, onPress }: ProductCardProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const scale = useSharedValue(1);

  const skor: SkorRenk = item.skor;
  const config = STATUS_CONFIG[skor];
  const productName = item.urun_adi ?? t("common.unknownProduct");
  const kategoriKey = KATEGORI_KEYS[item.kategori];
  const kategoriLabel = kategoriKey ? t(kategoriKey) : String(item.kategori);
  const brandLabel = item.marka ? `${item.marka} · ` : "";
  const subtitle = `${brandLabel}${kategoriLabel}`;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(PRESS_SCALE, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${productName}, ${t(config.i18nKey)}, ${subtitle}`}
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          shadow.low,
        ]}
      >
        <View style={styles.cardTextContent}>
          <Text style={[styles.cardProductName, { color: colors.text }]} numberOfLines={1}>
            {productName}
          </Text>
          <Text style={[styles.cardSubtitle, { color: colors.muted }]}>{subtitle}</Text>
        </View>

        <Badge label={t(config.i18nKey)} status={config.key} />
      </Pressable>
    </Animated.View>
  );
}

// -- Empty Results ---------------------------------------------------------

function EmptyResults({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  if (!hasQuery) return null;

  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceTint }]}>
        <SearchX size={32} color={colors.muted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t("search.noResults")}</Text>
      <Text style={[styles.emptyHint, { color: colors.muted }]}>{t("search.noResultsHint")}</Text>
    </View>
  );
}

// -- Main Screen -----------------------------------------------------------

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(null);
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const isSearching = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchProducts(debouncedQuery, activeCategory);

  const {
    data: popularProducts,
    isLoading: isPopularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = usePopularProducts(activeCategory);

  const displayData = useMemo(
    () => (isSearching ? searchResults : popularProducts) ?? [],
    [isSearching, searchResults, popularProducts],
  );

  const isLoading = isSearching ? isSearchLoading : isPopularLoading;
  const error = isSearching ? searchError : popularError;

  const handleProductPress = useCallback(
    (id: string) => {
      router.push(`/analysis/${id}`);
    },
    [router],
  );

  const handleCategoryPress = useCallback((cat: CategoryFilter) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: AnalysisRow }) => (
      <ProductCard item={item} onPress={() => handleProductPress(item.id)} />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: AnalysisRow) => item.id, []);

  if (error) {
    return (
      <ErrorScreen
        title={t("search.error")}
        message={t("search.errorMessage")}
        onRetry={() => (isSearching ? refetchSearch() : refetchPopular())}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.screenTitle, { color: colors.text }]}>{t("search.title")}</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t("search.placeholder")}
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={t("search.placeholder")}
          />
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScrollView}
      >
        <FilterChip
          label={t("search.categoryAll")}
          isActive={activeCategory === null}
          onPress={() => setActiveCategory(null)}
        />
        <FilterChip
          label={t("search.categoryFood")}
          isActive={activeCategory === "gida"}
          onPress={() => handleCategoryPress("gida")}
          dotColor={CATEGORY_DOT_COLORS.gida}
        />
        <FilterChip
          label={t("search.categoryCosmetics")}
          isActive={activeCategory === "kozmetik"}
          onPress={() => handleCategoryPress("kozmetik")}
          dotColor={CATEGORY_DOT_COLORS.kozmetik}
        />
        <FilterChip
          label={t("search.categoryCleaning")}
          isActive={activeCategory === "temizlik"}
          onPress={() => handleCategoryPress("temizlik")}
          dotColor={CATEGORY_DOT_COLORS.temizlik}
        />
        <FilterChip
          label={t("search.categoryGeneral")}
          isActive={activeCategory === "genel"}
          onPress={() => handleCategoryPress("genel")}
          dotColor={CATEGORY_DOT_COLORS.genel}
        />
      </ScrollView>

      {/* Section title */}
      {!isSearching && !isLoading && displayData.length > 0 && (
        <View style={styles.sectionHeader}>
          <TrendingUp size={14} color={colors.muted} />
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>{t("search.popular")}</Text>
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={[styles.loadingText, { color: colors.muted }]}>{t("search.loading")}</Text>
        </View>
      )}

      {/* Results list */}
      {!isLoading && displayData.length === 0 ? (
        <EmptyResults hasQuery={isSearching} />
      ) : !isLoading ? (
        <FlatList
          data={displayData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 6,
  },
  searchBarContainer: {
    paddingHorizontal: spacing.screenX,
    marginTop: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body400,
    fontSize: 14,
    paddingVertical: 0,
  },
  chipScrollView: {
    flexGrow: 0,
    marginTop: 14,
    marginBottom: 4,
  },
  chipRow: {
    paddingHorizontal: spacing.screenX,
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    minHeight: 34,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    fontFamily: fonts.body700,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.screenX,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: fonts.body700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontFamily: fonts.body500,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 10,
    paddingBottom: 110,
  },
  separator: {
    height: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  cardTextContent: {
    flex: 1,
    gap: 3,
  },
  cardProductName: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  cardSubtitle: {
    fontFamily: fonts.body500,
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    textAlign: "center",
  },
  emptyHint: {
    fontFamily: fonts.body400,
    fontSize: 13,
    textAlign: "center",
  },
});
