import type { MatchedIngredient, ProfileWarning, RulesResult } from "../lib/types.ts";

const AUDIENCE_LABELS: Record<string, string> = {
  bebek: "Bebek",
  hamile: "Hamile",
  hassas_cilt: "Hassas Cilt",
  gluten_alerjisi: "Gluten Alerjisi",
  laktoz_intoleransi: "Laktoz İntoleransı",
  fistik_alerjisi: "Fıstık Alerjisi",
  vegan: "Vegan",
  diyabet: "Diyabet",
};

function getRiskDescription(
  maddeAd: string,
  kitle: string,
  riskSeviyesi: "guvenli" | "dikkat" | "sakincali",
): string {
  const kitleLabel = AUDIENCE_LABELS[kitle] ?? kitle;

  if (riskSeviyesi === "sakincali") {
    return `${maddeAd} maddesi ${kitleLabel} profili için sakıncalı olarak işaretlenmiştir.`;
  }

  return `${maddeAd} maddesi ${kitleLabel} profili için dikkat gerektirmektedir.`;
}

export function applyRules(maddeler: MatchedIngredient[], audiences: string[]): RulesResult {
  const profilUyarilari: ProfileWarning[] = [];
  const bilinmeyenler: string[] = [];

  let sakincaliCount = 0;
  let dikkatCount = 0;

  for (const madde of maddeler) {
    if (madde.riskSeviyesi === "sakincali") sakincaliCount++;
    if (madde.riskSeviyesi === "dikkat") dikkatCount++;
    if (madde.aiTahmini) bilinmeyenler.push(madde.ad);

    // Profil uyarıları: kitle_bayraklari ile audiences karşılaştır
    if (madde.kitleBayraklari && audiences.length > 0) {
      for (const audience of audiences) {
        const audienceRisk = madde.kitleBayraklari[audience];
        if (audienceRisk === "sakincali" || audienceRisk === "dikkat") {
          profilUyarilari.push({
            kitle: audience,
            maddeAd: madde.ad,
            riskSeviyesi: audienceRisk as "dikkat" | "sakincali",
            aciklama: getRiskDescription(
              madde.ad,
              audience,
              audienceRisk as "dikkat" | "sakincali",
            ),
          });
        }
      }
    }
  }

  // Deterministik skor hesaplama
  // Profil uyarılarındaki sakıncalı maddeler de skoru etkiler
  const hasProfileDanger = profilUyarilari.some((u) => u.riskSeviyesi === "sakincali");
  const hasProfileCaution = profilUyarilari.some((u) => u.riskSeviyesi === "dikkat");

  let skor: "yesil" | "sari" | "kirmizi";
  if (sakincaliCount > 0 || hasProfileDanger) {
    skor = "kirmizi";
  } else if (dikkatCount > 0 || hasProfileCaution) {
    skor = "sari";
  } else {
    skor = "yesil";
  }

  return {
    skor,
    maddeler,
    profilUyarilari,
    bilinmeyenler,
  };
}
