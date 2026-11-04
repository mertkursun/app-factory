export interface AnalyzeRequest {
  barcode?: string;
  storagePath?: string;
  ingredients?: string[];
  productName?: string;
  category?: "gida" | "kozmetik" | "temizlik" | "genel";
  brand?: string;
  countryOfOrigin?: string;
  audiences: string[];
  lang?: string;
}

export interface ReadResult {
  productName: string | null;
  ingredients: string[];
  category: "gida" | "kozmetik" | "temizlik" | "genel";
  sourceUrl: string | null;
  brand: string | null;
  countryOfOrigin: string | null;
}

export interface MatchedIngredient {
  maddeId: string | null;
  ad: string;
  riskSeviyesi: "guvenli" | "dikkat" | "sakincali";
  islev: string | null;
  kaynak: string | null;
  aiTahmini: boolean;
  kitleBayraklari: Record<string, string> | null;
}

export interface ProfileWarning {
  kitle: string;
  maddeAd: string;
  riskSeviyesi: "guvenli" | "dikkat" | "sakincali";
  aciklama: string;
}

export interface RulesResult {
  skor: "yesil" | "sari" | "kirmizi";
  maddeler: MatchedIngredient[];
  profilUyarilari: ProfileWarning[];
  bilinmeyenler: string[];
}

export interface AnalyzeResponse {
  analysis: {
    id: string;
    barkod: string | null;
    urun_adi: string | null;
    kategori: string;
    skor: string;
    aciklama: string;
    maddeler: unknown;
    profil_uyarilari: unknown;
    bilinmeyenler: string[];
    kaynak_url: string | null;
    alternatifler: unknown;
    created_at: string;
  };
  fromCache: boolean;
}
