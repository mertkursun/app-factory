import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { readProduct } from "./steps/read.ts";
import { matchIngredients } from "./steps/match.ts";
import { applyRules } from "./steps/rules.ts";
import { generateExplanation } from "./steps/explain.ts";
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
    const { barcode, photoUri, audiences } = body;

    if (!barcode && !photoUri) {
      return jsonResponse({ error: "Barkod veya fotoğraf gerekli" }, 400);
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
    const readResult = await readProduct({ barcode, photoUri });

    // 4. EŞLEŞTİR — Maddeleri veritabanıyla eşleştir
    const matched = await matchIngredients(serviceClient, readResult.ingredients);

    // 5. KURALLAR — Skor hesapla
    const rulesResult = applyRules(matched, audiences);

    // 6. ANLAT — Claude ile açıklama üret
    const explanation = await generateExplanation(readResult.productName, rulesResult, audiences);

    // 7. Sonucu kaydet
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
    };

    const { data: saved, error: saveError } = await serviceClient
      .from("urun_analizleri")
      .insert(analysisData)
      .select()
      .single();

    if (saveError) throw saveError;

    return jsonResponse({ analysis: saved, fromCache: false });
  } catch (err) {
    console.error("analyze-product error:", err);
    return jsonResponse({ error: "Analiz sırasında bir hata oluştu" }, 500);
  }
});
