import type { RulesResult } from "../lib/types.ts";

const GEMINI_MODEL = "gemini-3.8-flash";

export async function generateExplanation(
  productName: string | null,
  rules: RulesResult,
  audiences: string[],
  lang?: string,
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) {
    return generateFallbackExplanation(productName, rules);
  }

  const safeCount = rules.maddeler.filter((m) => m.riskSeviyesi === "guvenli").length;
  const cautionCount = rules.maddeler.filter((m) => m.riskSeviyesi === "dikkat").length;
  const dangerCount = rules.maddeler.filter((m) => m.riskSeviyesi === "sakincali").length;

  const isEn = lang === "en";
  const prompt = isEn
    ? `Explain a product's ingredient analysis in 3-4 simple sentences in English.

Product: ${productName ?? "Unknown"}
Score: ${rules.skor}
Ingredients: ${rules.maddeler.map((m) => `${m.ad} (${m.riskSeviyesi})`).join(", ")}
Safe: ${safeCount}, Caution: ${cautionCount}, Harmful: ${dangerCount}
Unknown: ${rules.bilinmeyenler.length}
${audiences.length > 0 ? `User profile: ${audiences.join(", ")}` : ""}

Rules:
- Use plain, understandable English (add explanation for scientific terms)
- Start with general assessment, then note concerns
- Do not give medical advice
- Maximum 4 sentences`
    : `Bir ürünün içerik analizini 3-4 cümle ile sade Türkçe açıkla.

Ürün: ${productName ?? "Bilinmiyor"}
Skor: ${rules.skor}
Maddeler: ${rules.maddeler.map((m) => `${m.ad} (${m.riskSeviyesi})`).join(", ")}
Güvenli: ${safeCount}, Dikkat: ${cautionCount}, Sakıncalı: ${dangerCount}
Bilinmeyen: ${rules.bilinmeyenler.length}
${audiences.length > 0 ? `Kullanıcı profili: ${audiences.join(", ")}` : ""}

Kurallar:
- Sade, anlaşılır Türkçe kullan (bilimsel terim varsa yanına açıklama ekle)
- Önce genel değerlendirme, sonra dikkat edilmesi gerekenler
- Tıbbi tavsiye verme
- En fazla 4 cümle`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    return generateFallbackExplanation(productName, rules);
  }

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text ?? generateFallbackExplanation(productName, rules);
}

function generateFallbackExplanation(productName: string | null, rules: RulesResult): string {
  const name = productName ?? "Bu ürün";
  const total = rules.maddeler.length;
  const safe = rules.maddeler.filter((m) => m.riskSeviyesi === "guvenli").length;
  const danger = rules.maddeler.filter((m) => m.riskSeviyesi === "sakincali").length;

  if (rules.skor === "yesil") {
    return `${name} genel olarak güvenli görünüyor. ${total} maddenin ${safe} tanesi güvenli kategorisinde.`;
  }
  if (rules.skor === "kirmizi") {
    return `${name} dikkatli tüketilmesi gereken maddeler içeriyor. ${danger} adet sakıncalı madde tespit edildi. Detayları incelemenizi öneririz.`;
  }
  return `${name} bazı dikkat edilmesi gereken maddeler içeriyor. ${total} maddenin detaylarını incelemenizi öneririz.`;
}
