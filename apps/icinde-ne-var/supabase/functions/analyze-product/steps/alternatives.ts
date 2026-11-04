const GEMINI_MODEL = "gemini-3.8-flash";

export interface Alternative {
  name: string;
  reason: string;
}

const alternativeSchema = {
  type: "ARRAY" as const,
  items: {
    type: "OBJECT" as const,
    properties: {
      name: { type: "STRING" as const },
      reason: { type: "STRING" as const },
    },
    required: ["name", "reason"],
  },
};

export async function generateAlternatives(
  productName: string | null,
  category: string,
  skor: string,
  lang?: string,
): Promise<Alternative[]> {
  if (skor === "yesil") {
    return [];
  }

  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) {
    return [];
  }

  const isEn = lang === "en";
  const product = productName ?? (isEn ? "Unknown product" : "Bilinmeyen ürün");

  const prompt = isEn
    ? `Suggest 3 safer alternatives in the same category ("${category}") for this product: "${product}".
For each alternative, provide:
- name: the product or brand name
- reason: a short sentence explaining why it's safer (max 20 words)

Rules:
- Only suggest widely available, real products
- Focus on cleaner/safer ingredient profiles
- Keep reasons concise and plain English`
    : `Bu ürün için aynı kategoride ("${category}") daha güvenli 3 alternatif öner: "${product}".
Her alternatif için:
- name: ürün veya marka adı
- reason: neden daha güvenli olduğunu kısa açıkla (en fazla 20 kelime)

Kurallar:
- Sadece yaygın bulunan, gerçek ürünler öner
- Daha temiz/güvenli içerik profiline odaklan
- Açıklamaları kısa ve sade Türkçe tut`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: alternativeSchema,
        },
      }),
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return [];
    }

    const parsed: unknown = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const alternatives: Alternative[] = [];
    for (const item of parsed) {
      if (
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        "reason" in item &&
        typeof (item as Record<string, unknown>).name === "string" &&
        typeof (item as Record<string, unknown>).reason === "string"
      ) {
        alternatives.push({
          name: (item as Record<string, unknown>).name as string,
          reason: (item as Record<string, unknown>).reason as string,
        });
      }
    }

    return alternatives.slice(0, 3);
  } catch {
    return [];
  }
}
