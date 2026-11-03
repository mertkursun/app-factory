import { View, Text, Pressable } from "react-native";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react-native";
import { SCORE_COLORS } from "@/lib/constants";
import type { HistoryItemWithKategori } from "@/services/history";
import type { SkorRenk } from "@/lib/schemas";

interface HistoryCardProps {
  item: HistoryItemWithKategori;
  onPress: () => void;
}

const SKOR_ICONS = {
  yesil: ShieldCheck,
  sari: AlertTriangle,
  kirmizi: ShieldAlert,
} as const;

const KATEGORI_LABELS: Record<string, string> = {
  gida: "Gıda",
  kozmetik: "Kozmetik",
  temizlik: "Temizlik",
  genel: "Genel",
} as const;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function HistoryCard({ item, onPress }: HistoryCardProps) {
  const skor: SkorRenk = item.skor;
  const color = SCORE_COLORS[skor];
  const Icon = SKOR_ICONS[skor];
  const productName = item.urun_adi ?? "Bilinmeyen Ürün";
  const kategori = item.urun_analizleri?.kategori;
  const kategoriLabel = kategori ? (KATEGORI_LABELS[kategori] ?? kategori) : null;
  const dateStr = formatDate(item.created_at);
  const subtitle = kategoriLabel ? `${kategoriLabel} — ${dateStr}` : dateStr;

  return (
    <Pressable
      onPress={onPress}
      className="bg-surface border border-border rounded-xl p-4 flex-row items-center gap-3"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      accessibilityRole="button"
      accessibilityLabel={`${productName}, ${color.label}, ${subtitle}`}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: color.bg }}
      >
        <Icon size={20} color={color.text} />
      </View>

      <View className="flex-1">
        <Text className="text-base font-label text-text" numberOfLines={1}>
          {productName}
        </Text>
        <Text className="text-xs font-caption text-text-secondary mt-1">{subtitle}</Text>
      </View>

      <View className="rounded-full px-2 py-1" style={{ backgroundColor: color.bg }}>
        <Text className="text-xs font-label" style={{ color: color.text }}>
          {color.label}
        </Text>
      </View>
    </Pressable>
  );
}
