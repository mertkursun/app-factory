import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
} from "@/services/favorites";
import type { Database } from "@/lib/database.types";

type FavoriInsert = Database["public"]["Tables"]["favoriler"]["Insert"];

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => getFavorites(userId!),
    enabled: !!userId,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: FavoriInsert) => addFavorite(record),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", variables.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["isFavorite", variables.analiz_id],
      });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, analizId }: { userId: string; analizId: string }) =>
      removeFavorite(userId, analizId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["isFavorite", variables.analizId],
      });
    },
  });
}

export function useIsFavorite(userId: string | undefined, analizId: string | undefined) {
  return useQuery({
    queryKey: ["isFavorite", analizId, userId],
    queryFn: () => checkIsFavorite(userId!, analizId!),
    enabled: !!userId && !!analizId,
  });
}
