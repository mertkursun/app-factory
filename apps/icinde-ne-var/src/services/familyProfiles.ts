import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type FamilyProfileRow = Database["public"]["Tables"]["aile_profilleri"]["Row"];
type FamilyProfileInsert = Database["public"]["Tables"]["aile_profilleri"]["Insert"];
type FamilyProfileUpdate = Database["public"]["Tables"]["aile_profilleri"]["Update"];

const MAX_PROFILES = 5;

export async function getFamilyProfiles(userId: string): Promise<FamilyProfileRow[]> {
  const { data, error } = await supabase
    .from("aile_profilleri")
    .select("*")
    .eq("user_id", userId)
    .order("sira", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addFamilyProfile(
  profile: Omit<FamilyProfileInsert, "sira">,
): Promise<FamilyProfileRow> {
  // First check count
  const { count, error: countError } = await supabase
    .from("aile_profilleri")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.user_id);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_PROFILES) {
    throw new Error("MAX_PROFILES_REACHED");
  }

  const { data, error } = await supabase
    .from("aile_profilleri")
    .insert({ ...profile, sira: count ?? 0 })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFamilyProfile(
  id: string,
  updates: Omit<FamilyProfileUpdate, "id" | "user_id">,
): Promise<FamilyProfileRow> {
  const { data, error } = await supabase
    .from("aile_profilleri")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFamilyProfile(id: string): Promise<void> {
  const { error } = await supabase.from("aile_profilleri").delete().eq("id", id);

  if (error) throw error;
}
