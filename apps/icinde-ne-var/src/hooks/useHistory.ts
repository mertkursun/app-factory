import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, addToHistory } from "@/services/history";

export function useHistory(userId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["history", userId],
    queryFn: ({ pageParam }) => getHistory(userId!, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    enabled: !!userId,
  });
}

export function useAddToHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToHistory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["history", variables.user_id],
      });
    },
  });
}
