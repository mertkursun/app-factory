import { supabase } from "@/lib/supabase";
import { FREE_MONTHLY_QUOTA } from "@/lib/constants";

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  isPro: boolean;
}

export async function getQuotaInfo(userId: string): Promise<QuotaInfo> {
  const donem = getCurrentPeriod();

  const [kullanimResult, abonelikResult] = await Promise.all([
    supabase
      .from("kullanim")
      .select("sorgu_sayisi")
      .eq("user_id", userId)
      .eq("donem", donem)
      .single(),
    supabase.from("abonelikler").select("durum, bitis").eq("user_id", userId).single(),
  ]);

  const used = kullanimResult.data?.sorgu_sayisi ?? 0;
  const isPro =
    abonelikResult.data?.durum === "aktif" && new Date(abonelikResult.data.bitis) > new Date();
  const limit = isPro ? Infinity : FREE_MONTHLY_QUOTA;
  const remaining = isPro ? Infinity : Math.max(0, FREE_MONTHLY_QUOTA - used);

  return { used, limit, remaining, isPro };
}
