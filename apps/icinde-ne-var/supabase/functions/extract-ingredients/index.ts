import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const GEMINI_MODEL = "gemini-3.8-flash";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Yetkilendirme gerekli" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: "Geçersiz oturum" }, 401);
    }

    const { storagePath, lang } = await req.json();
    if (!storagePath) {
      return jsonResponse({ error: "storagePath gerekli" }, 400);
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return jsonResponse({ error: "OCR servisi yapılandırılmamış" }, 503);
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const [bucket, ...pathParts] = storagePath.split("/");
    const filePath = pathParts.join("/");

    const { data: imgBlob, error: dlErr } = await serviceClient.storage
      .from(bucket)
      .download(filePath);

    if (dlErr || !imgBlob) {
      console.error("Storage download error:", dlErr);
      return jsonResponse({ error: "Fotoğrafa erişilemedi" }, 500);
    }

    const arrayBuffer = await imgBlob.arrayBuffer();
    const base64Data = uint8ToBase64(new Uint8Array(arrayBuffer));

    const promptText =
      lang === "en"
        ? `This is a photo of a product (food, cosmetics, cleaning product, etc.). It could be the front, back, or any side of the product.

Analyze what you see and extract as much information as possible:
- If the ingredients list is visible, extract it exactly.
- If the ingredients list is NOT visible but you can identify the product (by brand, name, packaging), provide the commonly known ingredients for that specific product.
- Extract the brand name and country of origin if visible or identifiable.

Reply in JSON format:
{
  "productName": "product name" or null,
  "ingredients": ["ingredient1", "ingredient2", ...],
  "category": "food" | "cosmetics" | "cleaning" | "general",
  "brand": "brand name" or null,
  "countryOfOrigin": "country of origin" or null,
  "ingredientsFromLabel": true or false
}

Set "ingredientsFromLabel" to true only if you directly read the ingredients from the label. Set to false if you inferred/guessed them from the product identity.

Return only JSON, no other explanation.`
        : `Bu bir ürün fotoğrafı (gıda, kozmetik, temizlik ürünü vb.). Ürünün ön yüzü, arka yüzü veya herhangi bir tarafı olabilir.

Gördüklerini analiz et ve mümkün olduğunca bilgi çıkar:
- İçindekiler listesi görünüyorsa, aynen oku.
- İçindekiler listesi görünmüyorsa ama ürünü tanıyabiliyorsan (marka, isim, ambalaj), o ürünün bilinen içeriklerini yaz.
- Marka adı ve üretim ülkesini görünüyorsa veya tanıyabiliyorsan çıkar.

JSON formatında yanıt ver:
{
  "productName": "ürün adı" veya null,
  "ingredients": ["madde1", "madde2", ...],
  "category": "gida" | "kozmetik" | "temizlik" | "genel",
  "brand": "marka adı" veya null,
  "countryOfOrigin": "üretim ülkesi" veya null,
  "ingredientsFromLabel": true veya false
}

"ingredientsFromLabel" değerini sadece içindekiler listesini etiketten doğrudan okuduğunda true yap. Ürünü tanıyıp tahmin ettiysen false yap.

Sadece JSON döndür, başka açıklama ekleme.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: "image/jpeg", data: base64Data } },
              { text: promptText },
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
      console.error("Gemini API error:", response.status, errText);
      return jsonResponse({ error: `OCR hatası (${response.status}): ${errText.slice(0, 200)}` }, 502);
    }

    const result = await response.json();
    const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return jsonResponse({ error: "OCR yanıtı ayrıştırılamadı" }, 502);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return jsonResponse({
      productName: parsed.productName ?? null,
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      category: parsed.category ?? "genel",
      brand: parsed.brand ?? null,
      countryOfOrigin: parsed.countryOfOrigin ?? null,
      ingredientsFromLabel: parsed.ingredientsFromLabel ?? false,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("extract-ingredients error:", errMsg);
    return jsonResponse({ error: `İçerik okuma hatası: ${errMsg.slice(0, 200)}` }, 500);
  }
});
