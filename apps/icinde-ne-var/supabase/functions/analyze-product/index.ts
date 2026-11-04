import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { readProduct } from "./steps/read.ts";
import { matchIngredients } from "./steps/match.ts";
import { applyRules } from "./steps/rules.ts";
import { generateExplanation } from "./steps/explain.ts";
import { generateAlternatives } from "./steps/alternatives.ts";
import { checkAndIncrementQuota } from "./lib/quota.ts";
import { getCachedAnalysis } from "./lib/cache.ts";
import type { AnalyzeRequest } from "./lib/types.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User client (RLS uygular)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client (RLS bypass)
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Kullanıcıyı doğrula
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: "Geçersiz oturum" }, 401);
    }

    const body: AnalyzeRequest = await req.json();
    const {
      barcode,
      storagePath,
      ingredients: bodyIngredients,
      productName: bodyProductName,
      category: bodyCategory,
      brand: bodyBrand,
      countryOfOrigin: bodyCountryOfOrigin,
      audiences,
      lang,
    } = body;

    if (!barcode && !storagePath && (!bodyIngredients || bodyIngredients.length === 0)) {
      return jsonResponse({ error: "Barkod, fotoğraf veya içerik listesi gerekli" }, 400);
    }

    // 1. Önbellek kontrolü (sadece barkodlu ürünler)
    if (barcode) {
      const cached = await getCachedAnalysis(serviceClient, barcode);
      if (cached) {
        return jsonResponse({ analysis: cached, fromCache: true });
      }
    }

    // 2. Kota kontrolü (önbellekte yoksa sayılır)
    const quotaCheck = await checkAndIncrementQuota(serviceClient, user.id);
    if (!quotaCheck.allowed) {
      return jsonResponse({ error: "Aylık kota doldu", remaining: 0 }, 402);
    }

    // 3. OKU — Ürün bilgilerini al
    let readResult;
    if (bodyIngredients && bodyIngredients.length > 0) {
      readResult = {
        productName: bodyProductName ?? null,
        ingredients: bodyIngredients,
        category: bodyCategory ?? ("genel" as const),
        sourceUrl: null as string | null,
        brand: bodyBrand ?? null,
        countryOfOrigin: bodyCountryOfOrigin ?? null,
      };
    } else {
      readResult = await readProduct({ barcode, photoUri: storagePath });
    }

    // 4. EŞLEŞTİR — Maddeleri veritabanıyla eşleştir
    const matched = await matchIngredients(serviceClient, readResult.ingredients);

    // 5. KURALLAR — Skor hesapla
    const rulesResult = applyRules(matched, audiences);

    // 6. ANLAT — Claude ile açıklama üret
    const explanation = await generateExplanation(
      readResult.productName,
      rulesResult,
      audiences,
      lang,
    );

    // 7. Alternatif öneriler üret (sadece sarı/kırmızı skor için)
    const alternatives = await generateAlternatives(
      readResult.productName,
      readResult.category,
      rulesResult.skor,
      lang,
    );

    // 8. Sonucu kaydet
    const analysisData = {
      barkod: barcode ?? null,
      urun_adi: readResult.productName,
      kategori: readResult.category,
      skor: rulesResult.skor,
      aciklama: explanation,
      maddeler: rulesResult.maddeler,
      profil_uyarilari: rulesResult.profilUyarilari,
      bilinmeyenler: rulesResult.bilinmeyenler,
      kaynak_url: readResult.sourceUrl,
      marka: readResult.brand,
      uretim_ulkesi: readResult.countryOfOrigin,
      alternatifler: alternatives,
    };

    const { data: saved, error: saveError } = await serviceClient
      .from("urun_analizleri")
      .insert(analysisData)
      .select()
      .single();

    if (saveError) throw saveError;

    return jsonResponse({ analysis: saved, fromCache: false });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("analyze-product error:", errMsg);
    return jsonResponse({ error: `Analiz hatası: ${errMsg.slice(0, 300)}` }, 500);
  }
});
