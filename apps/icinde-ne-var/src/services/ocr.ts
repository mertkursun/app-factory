import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface ExtractResult {
  productName: string | null;
  ingredients: string[];
  category: string;
  brand: string | null;
  countryOfOrigin: string | null;
  ingredientsFromLabel: boolean;
}

export async function extractIngredients(storagePath: string, lang = "tr"): Promise<ExtractResult> {
  const { data, error } = await supabase.functions.invoke<ExtractResult>("extract-ingredients", {
    body: { storagePath, lang },
  });

  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const body = await error.context.json();
        msg = body?.error ?? msg;
      } catch {
        // json parse failed, keep default
      }
    }
    throw new Error(msg);
  }
  if (!data) throw new Error("OCR yanıtı boş döndü");
  return data;
}
