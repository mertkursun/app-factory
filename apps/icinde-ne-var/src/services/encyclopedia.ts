import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type MaddeRow = Database["public"]["Tables"]["maddeler"]["Row"];

const SEARCH_LIMIT = 50;
const POPULAR_LIMIT = 20;

/** Escape ILIKE special characters to prevent wildcard injection */
function escapeIlike(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function searchIngredients(query: string): Promise<MaddeRow[]> {
  const escaped = escapeIlike(query);
  const { data, error } = await supabase
    .from("maddeler")
    .select("*")
    .ilike("ad", `%${escaped}%`)
    .order("ad", { ascending: true })
    .limit(SEARCH_LIMIT);

  if (error) throw error;
  return data ?? [];
}

export async function getIngredientById(id: string): Promise<MaddeRow | null> {
  const { data, error } = await supabase.from("maddeler").select("*").eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getIngredientsByCategory(
  category: "gida" | "kozmetik" | "temizlik" | "genel",
): Promise<MaddeRow[]> {
  const { data, error } = await supabase
    .from("maddeler")
    .select("*")
    .eq("kategori", category)
    .order("ad", { ascending: true })
    .limit(SEARCH_LIMIT);

  if (error) throw error;
  return data ?? [];
}

export async function getPopularIngredients(): Promise<MaddeRow[]> {
  const { data, error } = await supabase
    .from("maddeler")
    .select("*")
    .order("ad", { ascending: true })
    .limit(POPULAR_LIMIT);

  if (error) throw error;
  return data ?? [];
}
