import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type SkorRenk = Database["public"]["Tables"]["urun_analizleri"]["Row"]["skor"];

export interface CompareHistoryItem {
  analiz_id: string;
  urun_adi: string | null;
  skor: SkorRenk;
  created_at: string;
}

export async function getHistoryForPicker(userId: string): Promise<CompareHistoryItem[]> {
  const { data, error } = await supabase
    .from("tarama_gecmisi")
    .select("analiz_id, urun_adi, skor, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? []) as CompareHistoryItem[];
}
