// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Notification Templates ─────────────────────────────────────────

interface NotificationTemplate {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

const TEMPLATES: Record<string, (params?: Record<string, string>) => NotificationTemplate> = {
  "new-feature": () => ({
    title: "Yeni Özellik!",
    body: "Yeni bir özellik eklendi. Hemen keşfet!",
    data: { type: "new-feature" },
  }),
  "pro-campaign": () => ({
    title: "Özel Teklif",
    body: "Pro abonelikte sınırlı süre %40 indirim! Sınırsız taramaya geç.",
    data: { type: "pro-campaign" },
  }),
  "analysis-complete": (params) => ({
    title: "Analiz Tamamlandı",
    body: params?.productName
      ? `${params.productName} analizi hazır!`
      : "Ürün analizin hazır! Sonucu gör.",
    data: { type: "analysis-complete", analysisId: params?.analysisId ?? "" },
  }),
};

// ─── Expo Push API ──────────────────────────────────────────────────

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound: "default";
  priority: "high";
}

async function sendExpoPushNotifications(messages: ExpoPushMessage[]): Promise<void> {
  // Expo Push API supports batches of up to 100
  const BATCH_SIZE = 100;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Expo Push API error: ${response.status} — ${text}`);
    }
  }
}

// ─── Handler ────────────────────────────────────────────────────────

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { template, params, userIds } = body as {
      template: string;
      params?: Record<string, string>;
      userIds?: string[];
    };

    if (!template || !TEMPLATES[template]) {
      return new Response(
        JSON.stringify({ error: "Invalid template" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const notification = TEMPLATES[template](params);

    // Fetch push tokens
    let query = supabase.from("push_tokens").select("token, user_id");

    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }

    const { data: tokens, error: tokensError } = await query;

    if (tokensError) {
      return new Response(
        JSON.stringify({ error: tokensError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "No tokens found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const messages: ExpoPushMessage[] = tokens.map((t: any) => ({
      to: t.token as string,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      sound: "default" as const,
      priority: "high" as const,
    }));

    await sendExpoPushNotifications(messages);

    return new Response(
      JSON.stringify({ sent: messages.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
