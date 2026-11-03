import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useHistory } from "@/hooks/useHistory";
import { HistoryCard } from "@/components/history/HistoryCard";
import { EmptyHistory } from "@/components/history/EmptyHistory";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { IconButton } from "@/components/ui/IconButton";
import { useAuthStore } from "@/stores/authStore";
import { useTheme, fonts, spacing, typography } from "@/theme/tokens";
import type { HistoryItemWithKategori } from "@/services/history";
import { useCallback, useMemo, useState } from "react";

type FilterCategory = "all" | "gida" | "kozmetik" | "temizlik";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  dotColor?: string;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  gida: "#F2B544",
  kozmetik: "#F08BC4",
  temizlik: "#60A5FA",
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
        },
      ]}
    >
      {dotColor && !isActive && <View style={[styles.chipDot, { backgroundColor: dotColor }]} />}
      <Text style={[styles.chipText, { color: isActive ? colors.background : colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ListFooter({ isLoading, color }: { isLoading: boolean; color: string }) {
  if (!isLoading) return null;
  return (
    <View style={styles.footer}>
      <ActivityIndicator color={color} size="small" />
    </View>
  );
}

export default function HistoryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } =
    useHistory(user?.id);

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return allItems;
    return allItems.filter((item) => item.urun_analizleri?.kategori === activeFilter);
  }, [allItems, activeFilter]);

  const safeCount = useMemo(
    () => allItems.filter((item) => item.skor === "yesil").length,
    [allItems],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleCardPress = useCallback(
    (analizId: string) => {
      router.push(`/analysis/${analizId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: HistoryItemWithKategori }) => (
      <HistoryCard item={item} onPress={() => handleCardPress(item.analiz_id)} />
    ),
    [handleCardPress],
  );

  if (isLoading) {
    return <LoadingScreen message={t("history.loading")} />;
  }

  if (error) {
    return (
      <ErrorScreen
        title={t("history.error")}
        message={t("history.errorMessage")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[typography.screenTitle, { color: colors.text }]}>{t("history.title")}</Text>
          {allItems.length > 0 && (
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {t("history.subtitle", { count: allItems.length, safe: safeCount })}
            </Text>
          )}
        </View>
        <IconButton
          icon={<Search size={20} color={colors.muted} />}
          onPress={() => {}}
          accessibilityLabel={t("history.search")}
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScrollView}
      >
        <FilterChip
          label={t("history.filterAll")}
          isActive={activeFilter === "all"}
          onPress={() => setActiveFilter("all")}
        />
        <FilterChip
          label={t("history.filterFood")}
          isActive={activeFilter === "gida"}
          onPress={() => setActiveFilter("gida")}
          dotColor={CATEGORY_DOT_COLORS.gida}
        />
        <FilterChip
          label={t("history.filterCosmetic")}
          isActive={activeFilter === "kozmetik"}
          onPress={() => setActiveFilter("kozmetik")}
          dotColor={CATEGORY_DOT_COLORS.kozmetik}
        />
        <FilterChip
          label={t("history.filterCleaning")}
          isActive={activeFilter === "temizlik"}
          onPress={() => setActiveFilter("temizlik")}
          dotColor={CATEGORY_DOT_COLORS.temizlik}
        />
      </ScrollView>

      {/* List */}
      {filteredItems.length === 0 && allItems.length === 0 ? (
        <EmptyHistory />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<ListFooter isLoading={isFetchingNextPage} color={colors.primary} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    fontFamily: fonts.body500,
    fontSize: 12,
    marginTop: 2,
  },
  chipScrollView: {
    flexGrow: 0,
    marginBottom: 12,
  },
  chipRow: {
    paddingHorizontal: spacing.screenX,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 36,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    fontFamily: fonts.body600,
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 110,
  },
  separator: {
    height: 10,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
