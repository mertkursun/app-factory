import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useHistory } from "@/hooks/useHistory";
import { HistoryCard } from "@/components/history/HistoryCard";
import { EmptyHistory } from "@/components/history/EmptyHistory";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useAuthStore } from "@/stores/authStore";
import type { HistoryItemWithKategori } from "@/services/history";
import { useCallback } from "react";

const PRIMARY_COLOR = "#0F766E";
const ESTIMATED_ITEM_SIZE = 88;

function ListFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <View className="py-4 items-center">
      <ActivityIndicator color={PRIMARY_COLOR} size="small" />
    </View>
  );
}

function ItemSeparator() {
  return <View className="h-3" />;
}

export default function HistoryScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } =
    useHistory(user?.id);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

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
    return <LoadingScreen message="Geçmiş yükleniyor..." />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Bir hata oluştu"
        message="Geçmiş yüklenirken bir sorun oluştu."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 py-3">
        <Text className="text-2xl font-title text-text">Geçmiş</Text>
      </View>

      {items.length === 0 ? (
        <EmptyHistory />
      ) : (
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={ItemSeparator}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<ListFooter isLoading={isFetchingNextPage} />}
        />
      )}
    </SafeAreaView>
  );
}
