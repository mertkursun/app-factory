import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// RevenueCat webhook event tipleri
type EventType =
  | "INITIAL_PURCHASE"
  | "RENEWAL"
  | "CANCELLATION"
  | "EXPIRATION"
  | "BILLING_ISSUE"
  | "PRODUCT_CHANGE"
  | "SUBSCRIBER_ALIAS";

// RevenueCat store degerleri
type RevenueCatStore = "APP_STORE" | "PLAY_STORE" | "STRIPE" | "AMAZON" | "PROMOTIONAL";

// abonelikler tablosundaki magaza degerleri
type Magaza = "app_store" | "play_store";

// abonelikler tablosundaki durum degerleri
type AbonelikDurum = "aktif" | "suresi_dolmus" | "iptal_edildi" | "deneme";

interface RevenueCatEvent {
  type: EventType;
  app_user_id: string;
  original_app_user_id: string;
  product_id: string;
  expiration_at_ms: number | null;
  purchased_at_ms: number;
  store: RevenueCatStore;
  environment: "PRODUCTION" | "SANDBOX";
}

interface WebhookPayload {
  api_version: string;
  event: RevenueCatEvent;
}

const RELEVANT_EVENTS: ReadonlyArray<EventType> = [
  "INITIAL_PURCHASE",
  "RENEWAL",
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_ISSUE",
];

const STORE_MAP: Partial<Record<RevenueCatStore, Magaza>> = {
  APP_STORE: "app_store",
  PLAY_STORE: "play_store",
};

// Uzak gelecek tarihi -- bitis NOT NULL oldugu icin expiration yoksa kullanilir
const FAR_FUTURE = "2099-12-31T23:59:59.999Z";

function resolveStatus(eventType: EventType): AbonelikDurum {
  switch (eventType) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
      return "aktif";
    case "CANCELLATION":
    case "BILLING_ISSUE":
      return "iptal_edildi";
    case "EXPIRATION":
      return "suresi_dolmus";
    default:
      return "iptal_edildi";
  }
}

function resolveMagaza(store: RevenueCatStore): Magaza {
  return STORE_MAP[store] ?? "app_store";
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
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
    // Webhook authorization header dogrulama
    const webhookSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");
    const authHeader = req.headers.get("Authorization");

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return jsonResponse({ error: "Geçersiz webhook anahtarı" }, 401);
    }

    const payload: WebhookPayload = await req.json();
    const event = payload.event;

    // Sadece ilgili event'leri isle
    if (!RELEVANT_EVENTS.includes(event.type)) {
      return jsonResponse({ status: "ignored", type: event.type });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const durum = resolveStatus(event.type);
    const magaza = resolveMagaza(event.store);
    const bitis = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : FAR_FUTURE;

    // Upsert: user_id bazli tek kayit (abonelikler_user_id_unique constraint)
    const { error } = await serviceClient.from("abonelikler").upsert(
      {
        user_id: event.app_user_id,
        durum,
        bitis,
        magaza,
        revenuecat_id: event.original_app_user_id ?? event.app_user_id,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("Abonelik güncelleme hatası:", error);
      return jsonResponse({ error: "Veritabanı hatası" }, 500);
    }

    return jsonResponse({ status: "ok", durum });
  } catch (err) {
    console.error("revenuecat-webhook error:", err);
    return jsonResponse({ error: "Webhook işlenirken hata oluştu" }, 500);
  }
});
