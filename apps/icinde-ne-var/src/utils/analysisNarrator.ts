import type { TFunction } from "i18next";
import type { SkorRenk } from "@/lib/schemas";

interface MaddeSummary {
  safe: number;
  caution: number;
  danger: number;
}

interface NarratorInput {
  skor: SkorRenk;
  maddeSummary: MaddeSummary;
  aciklama: string | null;
}

const SKOR_TO_NARRATOR_KEY: Record<SkorRenk, string> = {
  yesil: "analysis.narratorSafe",
  sari: "analysis.narratorCaution",
  kirmizi: "analysis.narratorDanger",
};

const SKOR_LABELS: Record<SkorRenk, string> = {
  yesil: "analysis.safe",
  sari: "analysis.caution",
  kirmizi: "analysis.danger",
};

export function generateAnalysisSummary(input: NarratorInput, t: TFunction): string {
  const { skor, maddeSummary, aciklama } = input;

  const scoreLine = t("analysis.narratorScore", { score: t(SKOR_LABELS[skor]) });

  const ingredientsLine = t("analysis.narratorIngredients", {
    safe: maddeSummary.safe,
    caution: maddeSummary.caution,
    danger: maddeSummary.danger,
  });

  const verdictLine = t(SKOR_TO_NARRATOR_KEY[skor]);

  const parts = [scoreLine, ingredientsLine, verdictLine];

  if (aciklama) {
    parts.push(t("analysis.narratorConclusion", { summary: aciklama }));
  }

  return parts.join(" ");
}
