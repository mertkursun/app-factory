export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      aile_profilleri: {
        Row: {
          id: string;
          user_id: string;
          isim: string;
          ikon: string;
          audiences: string[];
          sira: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          isim: string;
          ikon?: string;
          audiences?: string[];
          sira?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          isim?: string;
          ikon?: string;
          audiences?: string[];
          sira?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiller: {
        Row: {
          id: string;
          user_id: string;
          audiences: string[];
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          audiences?: string[];
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          audiences?: string[];
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      maddeler: {
        Row: {
          id: string;
          ad: string;
          es_anlamlilar: string[];
          kategori: "gida" | "kozmetik" | "temizlik" | "genel";
          islev: string;
          risk_seviyesi: "guvenli" | "dikkat" | "sakincali";
          kaynak: string | null;
          kitle_bayraklari: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ad: string;
          es_anlamlilar?: string[];
          kategori: "gida" | "kozmetik" | "temizlik" | "genel";
          islev?: string;
          risk_seviyesi: "guvenli" | "dikkat" | "sakincali";
          kaynak?: string | null;
          kitle_bayraklari?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ad?: string;
          es_anlamlilar?: string[];
          kategori?: "gida" | "kozmetik" | "temizlik" | "genel";
          islev?: string;
          risk_seviyesi?: "guvenli" | "dikkat" | "sakincali";
          kaynak?: string | null;
          kitle_bayraklari?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      urun_analizleri: {
        Row: {
          id: string;
          barkod: string | null;
          urun_adi: string | null;
          kategori: "gida" | "kozmetik" | "temizlik" | "genel";
          skor: "yesil" | "sari" | "kirmizi";
          aciklama: string;
          maddeler: Json;
          profil_uyarilari: Json;
          bilinmeyenler: string[];
          kaynak_url: string | null;
          marka: string | null;
          uretim_ulkesi: string | null;
          alternatifler: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          barkod?: string | null;
          urun_adi?: string | null;
          kategori: "gida" | "kozmetik" | "temizlik" | "genel";
          skor: "yesil" | "sari" | "kirmizi";
          aciklama: string;
          maddeler: Json;
          profil_uyarilari: Json;
          bilinmeyenler?: string[];
          kaynak_url?: string | null;
          marka?: string | null;
          uretim_ulkesi?: string | null;
          alternatifler?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          barkod?: string | null;
          urun_adi?: string | null;
          kategori?: "gida" | "kozmetik" | "temizlik" | "genel";
          skor?: "yesil" | "sari" | "kirmizi";
          aciklama?: string;
          maddeler?: Json;
          profil_uyarilari?: Json;
          bilinmeyenler?: string[];
          kaynak_url?: string | null;
          marka?: string | null;
          uretim_ulkesi?: string | null;
          alternatifler?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tarama_gecmisi: {
        Row: {
          id: string;
          user_id: string;
          analiz_id: string;
          barkod: string | null;
          urun_adi: string | null;
          skor: "yesil" | "sari" | "kirmizi";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          analiz_id: string;
          barkod?: string | null;
          urun_adi?: string | null;
          skor: "yesil" | "sari" | "kirmizi";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          analiz_id?: string;
          barkod?: string | null;
          urun_adi?: string | null;
          skor?: "yesil" | "sari" | "kirmizi";
          created_at?: string;
        };
        Relationships: [];
      };
      kullanim: {
        Row: {
          id: string;
          user_id: string;
          donem: string;
          sorgu_sayisi: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          donem: string;
          sorgu_sayisi?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          donem?: string;
          sorgu_sayisi?: number;
        };
        Relationships: [];
      };
      abonelikler: {
        Row: {
          id: string;
          user_id: string;
          durum: "aktif" | "suresi_dolmus" | "iptal_edildi" | "deneme";
          bitis: string;
          magaza: "app_store" | "play_store";
          revenuecat_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          durum: "aktif" | "suresi_dolmus" | "iptal_edildi" | "deneme";
          bitis: string;
          magaza: "app_store" | "play_store";
          revenuecat_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          durum?: "aktif" | "suresi_dolmus" | "iptal_edildi" | "deneme";
          bitis?: string;
          magaza?: "app_store" | "play_store";
          revenuecat_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      favoriler: {
        Row: {
          id: string;
          user_id: string;
          analiz_id: string;
          urun_adi: string | null;
          barkod: string | null;
          skor: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          analiz_id: string;
          urun_adi?: string | null;
          barkod?: string | null;
          skor: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          analiz_id?: string;
          urun_adi?: string | null;
          barkod?: string | null;
          skor?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      push_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          platform: "ios" | "android";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          platform: "ios" | "android";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          platform?: "ios" | "android";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
