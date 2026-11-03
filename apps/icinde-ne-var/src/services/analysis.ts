import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type AnalysisRow = Database["public"]["Tables"]["urun_analizleri"]["Row"];

const NO_ROWS_CODE = "PGRST116";

export async function getAnalysisById(id: string): Promise<AnalysisRow | null> {
  const { data, error } = await supabase.from("urun_analizleri").select("*").eq("id", id).single();

  if (error && error.code !== NO_ROWS_CODE) throw error;
  return data;
}

export async function getAnalysisByBarcode(barcode: string): Promise<AnalysisRow | null> {
  const { data, error } = await supabase
    .from("urun_analizleri")
    .select("*")
    .eq("barkod", barcode)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== NO_ROWS_CODE) throw error;
  return data;
}

export interface AnalyzeRequest {
  barcode?: string;
  photoUri?: string;
  audiences: string[];
}

export interface AnalyzeResponse {
  analysis: AnalysisRow;
  fromCache: boolean;
}

export async function analyzeProduct(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const { data, error } = await supabase.functions.invoke<AnalyzeResponse>("analyze-product", {
    body: request,
  });

  if (error) throw error;
  if (!data) throw new Error("Analiz yanıtı boş döndü");
  return data;
}

export async function checkQuotaRemote(): Promise<{
  remaining: number;
  isPro: boolean;
}> {
  const { data, error } = await supabase.functions.invoke<{
    remaining: number;
    isPro: boolean;
  }>("check-quota");

  if (error) throw error;
  if (!data) throw new Error("Kota yanıtı boş döndü");
  return data;
}
