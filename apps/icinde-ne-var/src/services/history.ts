import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type HistoryRow = Database["public"]["Tables"]["tarama_gecmisi"]["Row"];
type HistoryInsert = Database["public"]["Tables"]["tarama_gecmisi"]["Insert"];

const PAGE_SIZE = 20;

export interface HistoryPage {
  items: HistoryRow[];
  hasMore: boolean;
}

export async function getHistory(userId: string, page: number = 0): Promise<HistoryPage> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const { data, error, count } = await supabase
    .from("tarama_gecmisi")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to - 1);

  if (error) throw error;

  return {
    items: data ?? [],
    hasMore: (count ?? 0) > to,
  };
}

export async function addToHistory(record: HistoryInsert): Promise<HistoryRow> {
  const { data, error } = await supabase.from("tarama_gecmisi").insert(record).select().single();

  if (error) throw error;
  return data;
}
