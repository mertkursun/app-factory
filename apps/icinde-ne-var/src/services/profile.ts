import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiller"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiller"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiller"]["Update"];

const NO_ROWS_CODE = "PGRST116";

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiller")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== NO_ROWS_CODE) throw error;
  return data;
}

export async function createProfile(profile: ProfileInsert): Promise<ProfileRow> {
  const { data, error } = await supabase.from("profiller").insert(profile).select().single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Omit<ProfileUpdate, "id" | "user_id">,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiller")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
