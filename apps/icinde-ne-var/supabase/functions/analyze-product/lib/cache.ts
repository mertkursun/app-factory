import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

export async function getCachedAnalysis(
  client: SupabaseClient,
  barcode: string,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await client
    .from("urun_analizleri")
    .select("*")
    .eq("barkod", barcode)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Record<string, unknown>;
}
