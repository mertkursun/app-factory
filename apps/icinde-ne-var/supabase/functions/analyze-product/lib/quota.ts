import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const FREE_MONTHLY_QUOTA = 5;

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function checkAndIncrementQuota(
  client: SupabaseClient,
  userId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const donem = getCurrentPeriod();

  // Pro mu kontrol et
  const { data: sub } = await client
    .from("abonelikler")
    .select("durum, bitis")
    .eq("user_id", userId)
    .single();

  if (sub?.durum === "aktif" && new Date(sub.bitis) > new Date()) {
    return { allowed: true, remaining: Infinity };
  }

  // Atomik kota kontrolü ve artırımı — race condition önlenir
  const { data, error } = await client.rpc("increment_quota_atomic", {
    p_user_id: userId,
    p_donem: donem,
    p_limit: FREE_MONTHLY_QUOTA,
  });

  if (error) {
    throw new Error(`Kota kontrolü başarısız: ${error.message}`);
  }

  const result = Array.isArray(data) ? data[0] : data;

  return {
    allowed: result?.allowed ?? false,
    remaining: result?.remaining ?? 0,
  };
}
