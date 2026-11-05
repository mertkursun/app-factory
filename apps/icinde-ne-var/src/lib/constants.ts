export const FREE_MONTHLY_QUOTA = 5;

/** Maps audience key to its i18n translation key. Use with t(): t(AUDIENCE_LABEL_KEYS[key]) */
export const AUDIENCE_LABEL_KEYS: Record<string, string> = {
  bebek: "audience.bebek",
  hamile: "audience.hamile",
  hassas_cilt: "audience.hassas_cilt",
  gluten_alerjisi: "audience.gluten_alerjisi",
  laktoz_intoleransi: "audience.laktoz_intoleransi",
  fistik_alerjisi: "audience.fistik_alerjisi",
  vegan: "audience.vegan",
  diyabet: "audience.diyabet",
} as const;
