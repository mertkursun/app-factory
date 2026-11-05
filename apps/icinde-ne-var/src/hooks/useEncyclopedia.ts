import { useQuery } from "@tanstack/react-query";
import {
  searchIngredients,
  getIngredientById,
  getPopularIngredients,
} from "@/services/encyclopedia";

const MIN_SEARCH_LENGTH = 2;
const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes

export function useSearchIngredients(query: string) {
  return useQuery({
    queryKey: ["encyclopedia", "search", query],
    queryFn: () => searchIngredients(query),
    enabled: query.length >= MIN_SEARCH_LENGTH,
    staleTime: STALE_TIME_MS,
  });
}

export function useIngredientDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["encyclopedia", "detail", id],
    queryFn: () => getIngredientById(id!),
    enabled: !!id,
    staleTime: STALE_TIME_MS,
  });
}

export function usePopularIngredients() {
  return useQuery({
    queryKey: ["encyclopedia", "popular"],
    queryFn: getPopularIngredients,
    staleTime: STALE_TIME_MS,
  });
}
