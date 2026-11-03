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

  // Mevcut kullanimi kontrol et
  const { data: usage } = await client
    .from("kullanim")
    .select("id, sorgu_sayisi")
    .eq("user_id", userId)
    .eq("donem", donem)
    .single();

  const currentCount = usage?.sorgu_sayisi ?? 0;

  if (currentCount >= FREE_MONTHLY_QUOTA) {
    return { allowed: false, remaining: 0 };
  }

  // Kotayi artir
  if (usage) {
    await client
      .from("kullanim")
      .update({ sorgu_sayisi: currentCount + 1 })
      .eq("id", usage.id);
  } else {
    await client.from("kullanim").insert({ user_id: userId, donem, sorgu_sayisi: 1 });
  }

  return { allowed: true, remaining: FREE_MONTHLY_QUOTA - currentCount - 1 };
}
