import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const FREE_MONTHLY_QUOTA = 5;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Yetkilendirme gerekli" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User client -- token dogrulama icin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client -- RLS bypass ile veri sorgulama
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Kullaniciyi dogrula
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Gecersiz oturum" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const donem = getCurrentPeriod();

    // Paralel sorgula: kota + abonelik
    const [kullanimResult, abonelikResult] = await Promise.all([
      serviceClient
        .from("kullanim")
        .select("sorgu_sayisi")
        .eq("user_id", user.id)
        .eq("donem", donem)
        .single(),
      serviceClient.from("abonelikler").select("durum, bitis").eq("user_id", user.id).single(),
    ]);

    const used = kullanimResult.data?.sorgu_sayisi ?? 0;
    const isPro =
      abonelikResult.data?.durum === "aktif" && new Date(abonelikResult.data.bitis) > new Date();
    const remaining = isPro ? -1 : Math.max(0, FREE_MONTHLY_QUOTA - used);

    return new Response(JSON.stringify({ remaining, isPro, used }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("check-quota error:", err);
    return new Response(JSON.stringify({ error: "Kota sorgulanirken hata olustu" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
