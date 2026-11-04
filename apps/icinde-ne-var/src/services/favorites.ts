import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type FavoriRow = Database["public"]["Tables"]["favoriler"]["Row"];
type FavoriInsert = Database["public"]["Tables"]["favoriler"]["Insert"];

export async function getFavorites(userId: string): Promise<FavoriRow[]> {
  const { data, error } = await supabase
    .from("favoriler")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addFavorite(record: FavoriInsert): Promise<FavoriRow> {
  const { data, error } = await supabase.from("favoriler").insert(record).select().single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(userId: string, analizId: string): Promise<void> {
  const { error } = await supabase
    .from("favoriler")
    .delete()
    .eq("user_id", userId)
    .eq("analiz_id", analizId);

  if (error) throw error;
}

export async function isFavorite(userId: string, analizId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("favoriler")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("analiz_id", analizId);

  if (error) throw error;
  return (count ?? 0) > 0;
}
