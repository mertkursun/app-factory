export const FREE_MONTHLY_QUOTA = 5;
export const PRO_PRICE_DISPLAY = "69 ₺/ay";

export const SCORE_COLORS = {
  yesil: { bg: "#DCFCE7", text: "#15803D", label: "Güvenli" },
  sari: { bg: "#FEF9C3", text: "#854D0E", label: "Dikkat" },
  kirmizi: { bg: "#FEE2E2", text: "#991B1B", label: "Sakıncalı" },
} as const;

export const AUDIENCE_LABELS: Record<string, string> = {
  bebek: "Bebek",
  hamile: "Hamile",
  hassas_cilt: "Hassas Cilt",
  gluten_alerjisi: "Gluten Alerjisi",
  laktoz_intoleransi: "Laktoz İntoleransı",
  fistik_alerjisi: "Fıstık Alerjisi",
  vegan: "Vegan",
  diyabet: "Diyabet",
} as const;
