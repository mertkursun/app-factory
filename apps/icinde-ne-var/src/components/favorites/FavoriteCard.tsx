import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { ShieldCheck, AlertTriangle, ShieldAlert, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { Badge } from "@/components/ui/Badge";
import { useRemoveFavorite } from "@/hooks/useFavorites";
import { useAuthStore } from "@/stores/authStore";
import type { Database } from "@/lib/database.types";
import type { SkorRenk } from "@/lib/schemas";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type FavoriRow = Database["public"]["Tables"]["favoriler"]["Row"];

interface FavoriteCardProps {
  item: FavoriRow;
  onPress: () => void;
}

type StatusKey = "success" | "warning" | "danger";

const STATUS_CONFIG: Record<string, { key: StatusKey; i18nKey: string; Icon: typeof ShieldCheck }> =
  {
    yesil: { key: "success", i18nKey: "analysis.safe", Icon: ShieldCheck },
    sari: { key: "warning", i18nKey: "analysis.caution", Icon: AlertTriangle },
    kirmizi: { key: "danger", i18nKey: "analysis.danger", Icon: ShieldAlert },
  };

const PRESS_SCALE = 0.96;
const PRESS_DURATION_MS = 150;
const ICON_SIZE = 40;
const ICON_STROKE_SIZE = 18;
const ICON_STROKE_WIDTH = 2.2;
const DELETE_BUTTON_SIZE = 36;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

export function FavoriteCard({ item, onPress }: FavoriteCardProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const scale = useSharedValue(1);
  const user = useAuthStore((s) => s.user);
  const removeMutation = useRemoveFavorite();

  const skor = item.skor as SkorRenk;
  const config = STATUS_CONFIG[skor] ?? STATUS_CONFIG.yesil;
  const productName = item.urun_adi ?? t("common.unknownProduct");
  const dateStr = formatDate(item.created_at);

  const statusBgMap: Record<string, string> = {
    yesil: colors.success,
    sari: colors.warning,
    kirmizi: colors.danger,
  };
  const iconBgColor = statusBgMap[skor] ?? colors.success;

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

  const handleDelete = () => {
    if (!user) return;
    removeMutation.mutate({ userId: user.id, analizId: item.analiz_id });
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${productName}, ${t(config.i18nKey)}, ${dateStr}`}
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
          <Text style={[styles.subtitle, { color: colors.muted }]}>{dateStr}</Text>
        </View>

        {/* Badge */}
        <Badge label={t(config.i18nKey)} status={config.key} />

        {/* Delete button */}
        <Pressable
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={t("favorites.delete")}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteButton,
            {
              backgroundColor: colors.dangerBg,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Trash2 size={14} color={colors.danger} strokeWidth={2.2} />
        </Pressable>
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
    paddingLeft: 14,
    paddingRight: 10,
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
  deleteButton: {
    width: DELETE_BUTTON_SIZE,
    height: DELETE_BUTTON_SIZE,
    borderRadius: DELETE_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
});
