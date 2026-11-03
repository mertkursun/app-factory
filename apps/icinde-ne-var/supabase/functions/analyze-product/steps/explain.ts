import type { RulesResult } from "../lib/types.ts";

export async function generateExplanation(
  productName: string | null,
  rules: RulesResult,
  audiences: string[],
): Promise<string> {
  const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
  if (!claudeApiKey) {
    // Claude API yoksa basit açıklama üret
    return generateFallbackExplanation(productName, rules);
  }

  const safeCount = rules.maddeler.filter((m) => m.riskSeviyesi === "guvenli").length;
  const cautionCount = rules.maddeler.filter((m) => m.riskSeviyesi === "dikkat").length;
  const dangerCount = rules.maddeler.filter((m) => m.riskSeviyesi === "sakincali").length;

  const prompt = `Bir ürünün içerik analizini 3-4 cümle ile sade Türkçe açıkla.

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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-20250514",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return generateFallbackExplanation(productName, rules);
  }

  const result = await response.json();
  return result.content?.[0]?.text ?? generateFallbackExplanation(productName, rules);
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
