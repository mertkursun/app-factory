import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type AnalysisRow = Database["public"]["Tables"]["urun_analizleri"]["Row"];

type CategoryFilter = "gida" | "kozmetik" | "temizlik" | "genel" | null;

const SEARCH_LIMIT = 30;
const POPULAR_LIMIT = 20;

export interface SearchProductsParams {
  query: string;
  category: CategoryFilter;
}

export async function searchProducts({
  query,
  category,
}: SearchProductsParams): Promise<AnalysisRow[]> {
  let builder = supabase
    .from("urun_analizleri")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(SEARCH_LIMIT);

  // Text search: ILIKE on urun_adi OR exact match on barkod
  const trimmed = query.trim();
  if (trimmed.length > 0) {
    builder = builder.or(`urun_adi.ilike.%${trimmed}%,barkod.eq.${trimmed}`);
  }

  if (category) {
    builder = builder.eq("kategori", category);
  }

  const { data, error } = await builder;

  if (error) throw error;
  return data ?? [];
}

export async function getPopularProducts(category: CategoryFilter): Promise<AnalysisRow[]> {
  let builder = supabase
    .from("urun_analizleri")
    .select("*")
    .not("barkod", "is", null)
    .not("urun_adi", "is", null)
    .order("created_at", { ascending: false })
    .limit(POPULAR_LIMIT);

  if (category) {
    builder = builder.eq("kategori", category);
  }

  const { data, error } = await builder;

  if (error) throw error;
  return data ?? [];
}
