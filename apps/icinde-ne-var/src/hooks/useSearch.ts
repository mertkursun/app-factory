import { useQuery } from "@tanstack/react-query";
import { searchProducts, getPopularProducts } from "@/services/search";

type CategoryFilter = "gida" | "kozmetik" | "temizlik" | "genel" | null;

const MIN_QUERY_LENGTH = 2;

export function useSearchProducts(query: string, category: CategoryFilter) {
  return useQuery({
    queryKey: ["search", query, category],
    queryFn: () => searchProducts({ query, category }),
    enabled: query.length >= MIN_QUERY_LENGTH,
  });
}

export function usePopularProducts(category: CategoryFilter) {
  return useQuery({
    queryKey: ["popular-products", category],
    queryFn: () => getPopularProducts(category),
  });
}
