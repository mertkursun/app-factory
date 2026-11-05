import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Skor = Database["public"]["Tables"]["tarama_gecmisi"]["Row"]["skor"];
type Kategori = Database["public"]["Tables"]["urun_analizleri"]["Row"]["kategori"];

interface HistoryWithKategori {
  skor: Skor;
  created_at: string;
  urun_analizleri: { kategori: Kategori } | null;
}

export interface UserStats {
  totalScans: number;
  monthlyScans: number;
  safeCount: number;
  cautionCount: number;
  dangerCount: number;
  safePercentage: number;
  topCategories: { category: string; count: number }[];
  streak: number;
}

const SKOR_MAP: Record<Skor, "safe" | "caution" | "danger"> = {
  yesil: "safe",
  sari: "caution",
  kirmizi: "danger",
};

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = [...new Set(dates.map((d) => d.slice(0, 10)))].sort((a, b) =>
    a > b ? -1 : 1,
  );

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const current = new Date(uniqueDays[i - 1]);
    const prev = new Date(uniqueDays[i]);
    const diffMs = current.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / 86_400_000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase
    .from("tarama_gecmisi")
    .select("skor, created_at, urun_analizleri(kategori)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const items = (data ?? []) as unknown as HistoryWithKategori[];
  const totalScans = items.length;

  if (totalScans === 0) {
    return {
      totalScans: 0,
      monthlyScans: 0,
      safeCount: 0,
      cautionCount: 0,
      dangerCount: 0,
      safePercentage: 0,
      topCategories: [],
      streak: 0,
    };
  }

  const monthStart = getMonthStart();
  let monthlyScans = 0;
  let safeCount = 0;
  let cautionCount = 0;
  let dangerCount = 0;
  const categoryCount: Record<string, number> = {};

  for (const item of items) {
    const bucket = SKOR_MAP[item.skor];
    if (bucket === "safe") safeCount++;
    else if (bucket === "caution") cautionCount++;
    else dangerCount++;

    if (item.created_at >= monthStart) {
      monthlyScans++;
    }

    const cat = item.urun_analizleri?.kategori;
    if (cat) {
      categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
    }
  }

  const topCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const safePercentage = totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 0;

  const streak = calculateStreak(items.map((i) => i.created_at));

  return {
    totalScans,
    monthlyScans,
    safeCount,
    cautionCount,
    dangerCount,
    safePercentage,
    topCategories,
    streak,
  };
}
