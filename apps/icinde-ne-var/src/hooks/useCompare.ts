import { useQuery } from "@tanstack/react-query";
import { getAnalysisById } from "@/services/analysis";
import type { Database } from "@/lib/database.types";
import type { RiskLevel, SkorRenk } from "@/lib/schemas";
import { z } from "zod";

type AnalysisRow = Database["public"]["Tables"]["urun_analizleri"]["Row"];

const analysisMaddeSchema = z.object({
  maddeId: z.string().nullable(),
  ad: z.string(),
  riskSeviyesi: z.string(),
  islev: z.string().nullable(),
  kaynak: z.string().nullable(),
  aiTahmini: z.boolean(),
});

type AnalysisMadde = z.infer<typeof analysisMaddeSchema>;

function parseAnalysisMaddeler(data: unknown): AnalysisMadde[] {
  const result = z.array(analysisMaddeSchema).safeParse(data);
  return result.success ? result.data : [];
}

const SKOR_ORDER: Record<SkorRenk, number> = {
  yesil: 3,
  sari: 2,
  kirmizi: 1,
};

export interface MaddeCounts {
  safe: number;
  caution: number;
  danger: number;
}

function countByRisk(maddeler: AnalysisMadde[]): MaddeCounts {
  let safe = 0;
  let caution = 0;
  let danger = 0;

  for (const m of maddeler) {
    const risk = m.riskSeviyesi as RiskLevel;
    if (risk === "guvenli") safe++;
    else if (risk === "dikkat") caution++;
    else if (risk === "sakincali") danger++;
  }

  return { safe, caution, danger };
}

export interface CompareResult {
  analysis1: AnalysisRow;
  analysis2: AnalysisRow;
  maddeler1: AnalysisMadde[];
  maddeler2: AnalysisMadde[];
  counts1: MaddeCounts;
  counts2: MaddeCounts;
  winner: "first" | "second" | "equal";
  commonIngredients: string[];
  uniqueToFirst: string[];
  uniqueToSecond: string[];
}

function determineWinner(
  skor1: SkorRenk,
  skor2: SkorRenk,
  counts1: MaddeCounts,
  counts2: MaddeCounts,
): "first" | "second" | "equal" {
  const order1 = SKOR_ORDER[skor1];
  const order2 = SKOR_ORDER[skor2];

  if (order1 > order2) return "first";
  if (order2 > order1) return "second";

  // Same skor color; compare danger counts (fewer is better)
  if (counts1.danger < counts2.danger) return "first";
  if (counts2.danger < counts1.danger) return "second";

  return "equal";
}

function findCommonAndUnique(
  maddeler1: AnalysisMadde[],
  maddeler2: AnalysisMadde[],
): { common: string[]; uniqueFirst: string[]; uniqueSecond: string[] } {
  const names1 = new Set(maddeler1.map((m) => m.ad.toLowerCase()));
  const names2 = new Set(maddeler2.map((m) => m.ad.toLowerCase()));

  const common: string[] = [];
  const uniqueFirst: string[] = [];
  const uniqueSecond: string[] = [];

  for (const name of names1) {
    if (names2.has(name)) {
      common.push(name);
    } else {
      uniqueFirst.push(name);
    }
  }

  for (const name of names2) {
    if (!names1.has(name)) {
      uniqueSecond.push(name);
    }
  }

  return { common, uniqueFirst, uniqueSecond };
}

export function useCompare(id1: string | undefined, id2: string | undefined) {
  const query1 = useQuery({
    queryKey: ["analysis", id1],
    queryFn: () => getAnalysisById(id1!),
    enabled: !!id1,
  });

  const query2 = useQuery({
    queryKey: ["analysis", id2],
    queryFn: () => getAnalysisById(id2!),
    enabled: !!id2,
  });

  const isLoading = query1.isLoading || query2.isLoading;
  const error = query1.error ?? query2.error;

  let result: CompareResult | null = null;

  if (query1.data && query2.data) {
    const analysis1 = query1.data;
    const analysis2 = query2.data;
    const maddeler1 = parseAnalysisMaddeler(analysis1.maddeler);
    const maddeler2 = parseAnalysisMaddeler(analysis2.maddeler);
    const counts1 = countByRisk(maddeler1);
    const counts2 = countByRisk(maddeler2);
    const skor1 = analysis1.skor as SkorRenk;
    const skor2 = analysis2.skor as SkorRenk;
    const winner = determineWinner(skor1, skor2, counts1, counts2);
    const { common, uniqueFirst, uniqueSecond } = findCommonAndUnique(maddeler1, maddeler2);

    result = {
      analysis1,
      analysis2,
      maddeler1,
      maddeler2,
      counts1,
      counts2,
      winner,
      commonIngredients: common,
      uniqueToFirst: uniqueFirst,
      uniqueToSecond: uniqueSecond,
    };
  }

  return { result, isLoading, error };
}
