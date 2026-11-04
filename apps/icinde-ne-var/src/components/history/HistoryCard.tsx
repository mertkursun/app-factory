import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { Badge } from "@/components/ui/Badge";
import type { HistoryItemWithKategori } from "@/services/history";
import type { SkorRenk } from "@/lib/schemas";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface HistoryCardProps {
  item: HistoryItemWithKategori;
  onPress: () => void;
}

const STATUS_CONFIG = {
  yesil: { key: "success" as const, i18nKey: "analysis.safe", Icon: ShieldCheck },
  sari: { key: "warning" as const, i18nKey: "analysis.caution", Icon: AlertTriangle },
  kirmizi: { key: "danger" as const, i18nKey: "analysis.danger", Icon: ShieldAlert },
} as const;

const KATEGORI_KEYS: Record<string, string> = {
  gida: "history.categoryFood",
  kozmetik: "history.categoryCosmetic",
  temizlik: "history.categoryCleaning",
  genel: "history.categoryGeneral",
};

const PRESS_SCALE = 0.96;
const PRESS_DURATION_MS = 150;
const ICON_SIZE = 40;
const ICON_STROKE_SIZE = 18;
const ICON_STROKE_WIDTH = 2.2;

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
  const scale = useSharedValue(1);

  const skor: SkorRenk = item.skor;
  const config = STATUS_CONFIG[skor];
  const productName = item.urun_adi ?? t("common.unknownProduct");
  const kategori = item.urun_analizleri?.kategori ?? "genel";
  const kategoriKey = KATEGORI_KEYS[kategori];
  const kategoriLabel = kategoriKey ? t(kategoriKey) : String(kategori);
  const dateStr = formatDate(item.created_at);
  const subtitle = `${kategoriLabel} · ${dateStr}`;

  const statusBgMap: Record<SkorRenk, string> = {
    yesil: colors.success,
    sari: colors.warning,
    kirmizi: colors.danger,
  };
  const iconBgColor = statusBgMap[skor];

  const StatusIcon = config.Icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(PRESS_SCALE, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: PRESS_DURATION_MS,
      easing: Easing.out(Easing.ease),
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${productName}, ${t(config.i18nKey)}, ${subtitle}`}
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          shadow.low,
        ]}
      >
        {/* Risk icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <StatusIcon size={ICON_STROKE_SIZE} color="#FFFFFF" strokeWidth={ICON_STROKE_WIDTH} />
        </View>

        {/* Text content */}
        <View style={styles.textContent}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
            {productName}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text>
        </View>

        {/* Badge */}
        <Badge label={t(config.i18nKey)} status={config.key} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    flex: 1,
    gap: 3,
  },
  productName: {
    fontFamily: fonts.body700,
    fontSize: 14,
  },
  subtitle: {
    fontFamily: fonts.body500,
    fontSize: 11,
  },
});
