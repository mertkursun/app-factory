import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react-native";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteCard } from "@/components/favorites/FavoriteCard";
import { EmptyFavorites } from "@/components/favorites/EmptyFavorites";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useAuthStore } from "@/stores/authStore";
import { useTheme, fonts, spacing, typography } from "@/theme/tokens";
import type { Database } from "@/lib/database.types";
import { useCallback } from "react";

type FavoriRow = Database["public"]["Tables"]["favoriler"]["Row"];

function ListFooter({ isLoading, color }: { isLoading: boolean; color: string }) {
  if (!isLoading) return null;
  return (
    <View style={styles.footer}>
      <ActivityIndicator color={color} size="small" />
    </View>
  );
}

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  const { data: favorites, isLoading, error, refetch, isRefetching } = useFavorites(user?.id);

  const handleCardPress = useCallback(
    (analizId: string) => {
      router.push(`/analysis/${analizId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: FavoriRow }) => (
      <FavoriteCard item={item} onPress={() => handleCardPress(item.analiz_id)} />
    ),
    [handleCardPress],
  );

  if (isLoading) {
    return <LoadingScreen message={t("favorites.loading")} />;
  }

  if (error) {
    return (
      <ErrorScreen
        title={t("favorites.error")}
        message={t("favorites.errorMessage")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.screenTitle, { color: colors.text }]}>{t("favorites.title")}</Text>
        {(favorites?.length ?? 0) > 0 && (
          <View style={styles.countRow}>
            <Heart size={13} color={colors.danger} fill={colors.danger} />
            <Text style={[styles.subtitle, { color: colors.muted }]}>{favorites?.length ?? 0}</Text>
          </View>
        )}
      </View>

      {/* List */}
      {!favorites || favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<ListFooter isLoading={isRefetching} color={colors.primary} />}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
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
    paddingHorizontal: spacing.screenX,
    paddingTop: 6,
    gap: 4,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  subtitle: {
    fontFamily: fonts.body500,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
    paddingTop: 16,
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
