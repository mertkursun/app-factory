import type { ReadResult } from "../lib/types.ts";

const OFF_USER_AGENT = "IcindeNeVar/1.0 (icindenevar.app)";

interface OpenFoodFactsProduct {
  product_name?: string;
  ingredients_text?: string;
  categories_tags?: string[];
}

export async function readProduct(params: {
  barcode?: string;
  photoUri?: string;
}): Promise<ReadResult> {
  const { barcode, photoUri } = params;

  if (barcode) {
    return await readFromOpenFoodFacts(barcode);
  }

  if (photoUri) {
    return await readFromPhoto(photoUri);
  }

  throw new Error("Barkod veya fotoğraf gerekli");
}

async function readFromOpenFoodFacts(barcode: string): Promise<ReadResult> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  const response = await fetch(url, {
    headers: { "User-Agent": OFF_USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts API hatası: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 1 || !data.product) {
    return {
      productName: null,
      ingredients: [],
      category: "genel",
      sourceUrl: null,
    };
  }

  const product: OpenFoodFactsProduct = data.product;
  const ingredientsText = product.ingredients_text ?? "";
  const ingredients = ingredientsText
    .split(/[,;]/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  const category = detectCategory(product.categories_tags ?? []);

  return {
    productName: product.product_name ?? null,
    ingredients,
    category,
    sourceUrl: `https://world.openfoodfacts.org/product/${barcode}`,
  };
}

async function readFromPhoto(photoUri: string): Promise<ReadResult> {
  const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
  if (!claudeApiKey) {
    throw new Error("CLAUDE_API_KEY tanımlı değil");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  // photoUri: Supabase Storage path (ör: "photos/abc123.jpg")
  const imageUrl = `${supabaseUrl}/storage/v1/object/authenticated/${photoUri}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: imageUrl },
            },
            {
              type: "text",
              text: `Bu bir ürün etiketinin fotoğrafı. İçindekiler listesini çıkar.

JSON formatında yanıt ver:
{
  "productName": "ürün adı (varsa)" veya null,
  "ingredients": ["madde1", "madde2", ...],
  "category": "gida" | "kozmetik" | "temizlik" | "genel"
}

Sadece JSON döndür, başka açıklama ekleme.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API hatası: ${response.status}`);
  }

  const result = await response.json();
  const text: string = result.content?.[0]?.text ?? "{}";

  try {
    const parsed = JSON.parse(text);
    return {
      productName: parsed.productName ?? null,
      ingredients: parsed.ingredients ?? [],
      category: parsed.category ?? "genel",
      sourceUrl: null,
    };
  } catch {
    throw new Error("Claude yanıtı ayrıştırılamadı");
  }
}

function detectCategory(tags: string[]): "gida" | "kozmetik" | "temizlik" | "genel" {
  const joined = tags.join(" ").toLowerCase();
  if (joined.includes("cosmetic") || joined.includes("beauty") || joined.includes("skin"))
    return "kozmetik";
  if (joined.includes("cleaning") || joined.includes("detergent")) return "temizlik";
  if (joined.includes("food") || joined.includes("beverage") || joined.includes("snack"))
    return "gida";
  return "genel";
}
