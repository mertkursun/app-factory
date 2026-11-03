import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Utensils, Sparkles, SprayCan, Package } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { Badge } from "@/components/ui/Badge";
import type { HistoryItemWithKategori } from "@/services/history";
import type { SkorRenk } from "@/lib/schemas";

interface HistoryCardProps {
  item: HistoryItemWithKategori;
  onPress: () => void;
}

const STATUS_COLOR_MAP = {
  yesil: { key: "success" as const, label: "Güvenli" },
  sari: { key: "warning" as const, label: "Dikkat" },
  kirmizi: { key: "danger" as const, label: "Sakıncalı" },
} as const;

const CATEGORY_ICON_MAP: Record<string, typeof Utensils> = {
  gida: Utensils,
  kozmetik: Sparkles,
  temizlik: SprayCan,
};

const CATEGORY_GRADIENT_MAP: Record<string, readonly [string, string]> = {
  gida: ["#F2B544", "#E39B07"],
  kozmetik: ["#F08BC4", "#D95BA3"],
  temizlik: ["#60A5FA", "#3B82F6"],
};

const SKOR_NUMERIC: Record<SkorRenk, number> = {
  yesil: 86,
  sari: 58,
  kirmizi: 24,
};

const KATEGORI_KEYS: Record<string, string> = {
  gida: "history.categoryFood",
  kozmetik: "history.categoryCosmetic",
  temizlik: "history.categoryCleaning",
  genel: "history.categoryGeneral",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function HistoryCard({ item, onPress }: HistoryCardProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();

  const skor: SkorRenk = item.skor;
  const statusInfo = STATUS_COLOR_MAP[skor];
  const productName = item.urun_adi ?? t("common.unknownProduct");
  const kategori = item.urun_analizleri?.kategori ?? "genel";
  const kategoriKey = KATEGORI_KEYS[kategori];
  const kategoriLabel = kategoriKey ? t(kategoriKey) : String(kategori);
  const dateStr = formatDate(item.created_at);
  const subtitle = `${kategoriLabel} · ${dateStr}`;
  const numericScore = SKOR_NUMERIC[skor] ?? 50;

  const statusColorMap: Record<string, string> = {
    yesil: colors.success,
    sari: colors.warning,
    kirmizi: colors.danger,
  };
  const stripeColor = statusColorMap[skor] ?? colors.border;
  const scoreColor = stripeColor;

  const CategoryIcon = CATEGORY_ICON_MAP[kategori] ?? Package;
  const categoryGradient = CATEGORY_GRADIENT_MAP[kategori] ?? ["#A8A29E", "#78716C"];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${productName}, ${statusInfo.label}, ${subtitle}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        shadow.low,
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      {/* Left status stripe */}
      <View style={[styles.stripe, { backgroundColor: stripeColor }]} />

      {/* Category icon tile */}
      <LinearGradient
        colors={[categoryGradient[0], categoryGradient[1]]}
        style={styles.categoryTile}
      >
        <CategoryIcon size={20} color="#FFFFFF" />
      </LinearGradient>

      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
          {productName}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
      </View>

      {/* Score + Badge */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreNumber, { color: scoreColor }]}>{numericScore}</Text>
        <Badge label={statusInfo.label} status={statusInfo.key} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    paddingRight: 12,
    paddingVertical: 12,
    gap: 12,
  },
  stripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  categoryTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  textContent: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  subtitle: {
    fontFamily: fonts.body500,
    fontSize: 11,
  },
  scoreContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  scoreNumber: {
    fontFamily: fonts.display800,
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: -0.5,
  },
});
