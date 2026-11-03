import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import type { MatchedIngredient } from "../lib/types.ts";

interface MaddeRow {
  id: string;
  ad: string;
  es_anlamlilar: string[];
  risk_seviyesi: string;
  islev: string;
  kaynak: string | null;
  kitle_bayraklari: Record<string, string> | null;
}

export async function matchIngredients(
  client: SupabaseClient,
  ingredientNames: string[],
): Promise<MatchedIngredient[]> {
  if (ingredientNames.length === 0) return [];

  // Tüm maddeleri veritabanından çek (optimize: tek sorgu)
  const { data: allMaddeler, error } = await client
    .from("maddeler")
    .select("id, ad, es_anlamlilar, risk_seviyesi, islev, kaynak, kitle_bayraklari");

  if (error) throw error;

  const maddeler = (allMaddeler ?? []) as MaddeRow[];

  const matched: MatchedIngredient[] = ingredientNames.map((name) => {
    const normalized = name.trim().toLowerCase();

    // Ad veya eş anlamlılarla eşleştir
    const found = maddeler.find((m) => {
      if (m.ad.toLowerCase() === normalized) return true;
      return (m.es_anlamlilar ?? []).some((s: string) => s.toLowerCase() === normalized);
    });

    if (found) {
      return {
        maddeId: found.id,
        ad: found.ad,
        riskSeviyesi: found.risk_seviyesi as "guvenli" | "dikkat" | "sakincali",
        islev: found.islev || null,
        kaynak: found.kaynak,
        aiTahmini: false,
        kitleBayraklari: found.kitle_bayraklari,
      };
    }

    // Eşleşme bulunamadı — bilinmeyen madde
    return {
      maddeId: null,
      ad: name.trim(),
      riskSeviyesi: "dikkat" as const,
      islev: null,
      kaynak: null,
      aiTahmini: true,
      kitleBayraklari: null,
    };
  });

  return matched;
}
