import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import type { ReadResult } from "../lib/types.ts";

const OFF_USER_AGENT = "IcindeNeVar/1.0 (icindenevar.app)";
const GEMINI_MODEL = "gemini-3.8-flash";

interface OpenFoodFactsProduct {
  product_name?: string;
  ingredients_text?: string;
  categories_tags?: string[];
  brands?: string;
  countries?: string;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": OFF_USER_AGENT },
    });
  } catch (err) {
    console.error("OFF API network error:", err);
    return {
      productName: null,
      ingredients: [],
      category: "genel",
      sourceUrl: null,
      brand: null,
      countryOfOrigin: null,
    };
  }

  if (!response.ok) {
    console.error("OFF API status:", response.status);
    return {
      productName: null,
      ingredients: [],
      category: "genel",
      sourceUrl: null,
      brand: null,
      countryOfOrigin: null,
    };
  }

  const data = await response.json();

  if (data.status !== 1 || !data.product) {
    return {
      productName: null,
      ingredients: [],
      category: "genel",
      sourceUrl: null,
      brand: null,
      countryOfOrigin: null,
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
    brand: product.brands?.split(",")[0]?.trim() ?? null,
    countryOfOrigin: product.countries?.split(",")[0]?.trim() ?? null,
  };
}

async function readFromPhoto(storagePath: string): Promise<ReadResult> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY tanımlı değil");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

  const [bucket, ...pathParts] = storagePath.split("/");
  const filePath = pathParts.join("/");

  const { data: imgBlob, error: dlErr } = await serviceClient.storage
    .from(bucket)
    .download(filePath);

  if (dlErr || !imgBlob) {
    throw new Error(`Fotoğrafa erişilemedi: ${dlErr?.message ?? "bilinmeyen hata"}`);
  }

  const arrayBuffer = await imgBlob.arrayBuffer();
  const base64Data = uint8ToBase64(new Uint8Array(arrayBuffer));

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: base64Data } },
            {
              text: `Bu bir ürün fotoğrafı (gıda, kozmetik, temizlik ürünü vb.). Ürünün herhangi bir tarafı olabilir.

Gördüklerini analiz et ve mümkün olduğunca bilgi çıkar:
- İçindekiler listesi görünüyorsa, aynen oku.
- İçindekiler listesi görünmüyorsa ama ürünü tanıyabiliyorsan, o ürünün bilinen içeriklerini yaz.
- Marka adı ve üretim ülkesini görünüyorsa veya tanıyabiliyorsan çıkar.

JSON formatında yanıt ver:
{
  "productName": "ürün adı" veya null,
  "ingredients": ["madde1", "madde2", ...],
  "category": "gida" | "kozmetik" | "temizlik" | "genel",
  "brand": "marka adı" veya null,
  "countryOfOrigin": "üretim ülkesi" veya null
}

Sadece JSON döndür, başka açıklama ekleme.`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API hatası (${response.status}): ${errText.slice(0, 200)}`);
  }

  const result = await response.json();
  const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini yanıtı ayrıştırılamadı");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    productName: parsed.productName ?? null,
    ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
    category: parsed.category ?? "genel",
    sourceUrl: null,
    brand: parsed.brand ?? null,
    countryOfOrigin: parsed.countryOfOrigin ?? null,
  };
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
