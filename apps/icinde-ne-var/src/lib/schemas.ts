import { z } from "zod";

export const AUDIENCE_TYPES = [
  "bebek",
  "hamile",
  "hassas_cilt",
  "gluten_alerjisi",
  "laktoz_intoleransi",
  "fistik_alerjisi",
  "vegan",
  "diyabet",
] as const;
export const AudienceType = z.enum(AUDIENCE_TYPES);
export type AudienceType = z.infer<typeof AudienceType>;

export const RiskLevel = z.enum(["guvenli", "dikkat", "sakincali"]);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const SkorRenk = z.enum(["yesil", "sari", "kirmizi"]);
export type SkorRenk = z.infer<typeof SkorRenk>;

export const Profile = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  audiences: z.array(AudienceType),
  displayName: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Profile = z.infer<typeof Profile>;

export const Madde = z.object({
  id: z.string().uuid(),
  ad: z.string(),
  esAnlamlilar: z.array(z.string()),
  kategori: z.enum(["gida", "kozmetik", "temizlik", "genel"]),
  islev: z.string(),
  riskSeviyesi: RiskLevel,
  kaynak: z.string().nullable(),
  kitleBayraklari: z.record(AudienceType, RiskLevel).nullable(),
  createdAt: z.string().datetime(),
});
export type Madde = z.infer<typeof Madde>;

export const AnalizMaddesi = z.object({
  maddeId: z.string().uuid().nullable(),
  ad: z.string(),
  riskSeviyesi: RiskLevel,
  islev: z.string().nullable(),
  kaynak: z.string().nullable(),
  aiTahmini: z.boolean(),
});
export type AnalizMaddesi = z.infer<typeof AnalizMaddesi>;

export const ProfilUyarisi = z.object({
  kitle: AudienceType,
  maddeAd: z.string(),
  riskSeviyesi: RiskLevel,
  aciklama: z.string(),
});
export type ProfilUyarisi = z.infer<typeof ProfilUyarisi>;

export const AnalizSonucu = z.object({
  id: z.string().uuid(),
  barkod: z.string().nullable(),
  urunAdi: z.string().nullable(),
  kategori: z.enum(["gida", "kozmetik", "temizlik", "genel"]),
  skor: SkorRenk,
  aciklama: z.string(),
  maddeler: z.array(AnalizMaddesi),
  profilUyarilari: z.array(ProfilUyarisi),
  bilinmeyenler: z.array(z.string()),
  kaynakUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type AnalizSonucu = z.infer<typeof AnalizSonucu>;

export const TaramaKaydi = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  analizId: z.string().uuid(),
  barkod: z.string().nullable(),
  urunAdi: z.string().nullable(),
  skor: SkorRenk,
  createdAt: z.string().datetime(),
});
export type TaramaKaydi = z.infer<typeof TaramaKaydi>;

export const Kullanim = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  donem: z.string(),
  sorguSayisi: z.number().int().min(0),
});
export type Kullanim = z.infer<typeof Kullanim>;

export const AbonelikDurum = z.enum(["aktif", "suresi_dolmus", "iptal_edildi", "deneme"]);

export const Abonelik = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  durum: AbonelikDurum,
  bitis: z.string().datetime(),
  magaza: z.enum(["app_store", "play_store"]),
  revenuecatId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Abonelik = z.infer<typeof Abonelik>;
