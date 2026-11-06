import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import type { MatchedIngredient } from "../lib/types.ts";

const GEMINI_MODEL = "gemini-3.8-flash";

interface MaddeRow {
  id: string;
  ad: string;
  es_anlamlilar: string[];
  risk_seviyesi: string;
  islev: string;
  kaynak: string | null;
  kitle_bayraklari: Record<string, string> | null;
}

interface AiRiskEstimate {
  ad: string;
  riskSeviyesi: "guvenli" | "dikkat" | "sakincali";
  islev: string;
}

async function estimateRisksWithAi(unknownNames: string[]): Promise<Map<string, AiRiskEstimate>> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey || unknownNames.length === 0) return new Map();

  const prompt = `Sen bir gıda/kozmetik uzmanısın. Aşağıdaki maddelerin risk seviyesini belirle.

Maddeler:
${unknownNames.map((n, i) => `${i + 1}. ${n}`).join("\n")}

Her madde için JSON dizisi döndür:
[
  {"ad": "madde adı", "riskSeviyesi": "guvenli" | "dikkat" | "sakincali", "islev": "kısa açıklama"}
]

Kurallar:
- Su, tuz, şeker, un, yağ gibi temel maddeler → "guvenli"
- Doğal vitaminler, mineraller, bitkisel özler → "guvenli"
- Yapay tatlandırıcılar, bazı koruyucular, sentetik renklendiriciler → "dikkat"
- Bilinen zararlı maddeler (BHA, BHT yüksek doz, yasaklı boyalar) → "sakincali"
- Emin değilsen → "guvenli" (kullanıcıyı gereksiz korkutma)
- islev alanı Türkçe ve kısa olsun (ör. "tatlandırıcı", "koruyucu", "emülgatör")

Sadece JSON dizisi döndür.`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!response.ok) {
      console.error("Gemini AI risk estimate failed:", response.status);
      return new Map();
    }

    const result = await response.json();
    const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (!arrayMatch) return new Map();

    const parsed: AiRiskEstimate[] = JSON.parse(arrayMatch[0]);
    const map = new Map<string, AiRiskEstimate>();

    for (const item of parsed) {
      if (item.ad && item.riskSeviyesi) {
        const validRisk = ["guvenli", "dikkat", "sakincali"].includes(item.riskSeviyesi)
          ? item.riskSeviyesi
          : "guvenli";
        map.set(item.ad.trim().toLowerCase(), { ...item, riskSeviyesi: validRisk as AiRiskEstimate["riskSeviyesi"] });
      }
    }

    return map;
  } catch (err) {
    console.error("AI risk estimation error:", err);
    return new Map();
  }
}

export async function matchIngredients(
  client: SupabaseClient,
  ingredientNames: string[],
): Promise<MatchedIngredient[]> {
  if (ingredientNames.length === 0) return [];

  const { data: allMaddeler, error } = await client
    .from("maddeler")
    .select("id, ad, es_anlamlilar, risk_seviyesi, islev, kaynak, kitle_bayraklari");

  if (error) throw error;

  const maddeler = (allMaddeler ?? []) as MaddeRow[];

  // İlk geçiş: veritabanından eşleştir
  const firstPass: { name: string; found: MaddeRow | undefined }[] = ingredientNames.map((name) => {
    const normalized = name.trim().toLowerCase();
    const found = maddeler.find((m) => {
      if (m.ad.toLowerCase() === normalized) return true;
      return (m.es_anlamlilar ?? []).some((s: string) => s.toLowerCase() === normalized);
    });
    return { name, found };
  });

  // Eşleşmeyen maddeleri topla
  const unknownNames = firstPass
    .filter((p) => !p.found)
    .map((p) => p.name.trim());

  // AI ile risk tahmini al
  const aiEstimates = await estimateRisksWithAi(unknownNames);

  // Sonuçları birleştir
  const matched: MatchedIngredient[] = firstPass.map(({ name, found }) => {
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

    const aiEstimate = aiEstimates.get(name.trim().toLowerCase());

    return {
      maddeId: null,
      ad: name.trim(),
      riskSeviyesi: aiEstimate?.riskSeviyesi ?? ("guvenli" as const),
      islev: aiEstimate?.islev ?? null,
      kaynak: null,
      aiTahmini: true,
      kitleBayraklari: null,
    };
  });

  return matched;
}
