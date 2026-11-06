import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getHistoryForPicker } from "@/services/compareHistory";
import type { CompareHistoryItem } from "@/services/compareHistory";
import { Badge } from "@/components/ui/Badge";
import { useTheme, fonts, spacing, radius, typography } from "@/theme/tokens";
import type { SkorRenk } from "@/lib/schemas";

type StatusKey = "success" | "warning" | "danger";

const SKOR_TO_STATUS: Record<SkorRenk, StatusKey> = {
  yesil: "success",
  sari: "warning",
  kirmizi: "danger",
};

const SKOR_LABELS_TR: Record<SkorRenk, string> = {
  yesil: "Güvenli",
  sari: "Dikkat",
  kirmizi: "Sakıncalı",
};

interface ProductPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (analizId: string) => void;
  excludeId?: string;
}

function PickerItem({
  item,
  onSelect,
}: {
  item: CompareHistoryItem;
  onSelect: (id: string) => void;
}) {
  const { colors } = useTheme();
  const skor = item.skor as SkorRenk;
  const status = SKOR_TO_STATUS[skor];

  return (
    <Pressable
      onPress={() => onSelect(item.analiz_id)}
      accessibilityRole="button"
      accessibilityLabel={item.urun_adi ?? "Bilinmeyen Ürün"}
      style={[styles.itemRow, { borderBottomColor: colors.border }]}
    >
      {({ pressed }: { pressed: boolean }) => (
        <View
          style={[
            styles.itemRowInner,
            { backgroundColor: pressed ? colors.surfaceTint : "transparent" },
          ]}
        >
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
            {item.urun_adi ?? "Bilinmeyen Ürün"}
          </Text>
          <Badge label={SKOR_LABELS_TR[skor]} status={status} />
        </View>
      )}
    </Pressable>
  );
}

export function ProductPickerSheet({
  visible,
  onClose,
  onSelect,
  excludeId,
}: ProductPickerSheetProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading } = useQuery({
    queryKey: ["compare-history", userId],
    queryFn: () => getHistoryForPicker(userId!),
    enabled: visible && !!userId,
  });

  const filteredData = excludeId ? data?.filter((item) => item.analiz_id !== excludeId) : data;

  const renderItem = ({ item }: { item: CompareHistoryItem }) => (
    <PickerItem item={item} onSelect={onSelect} />
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
            shadow.card,
          ]}
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {t("compare.selectProduct")}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              hitSlop={12}
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
            >
              <X size={18} color={colors.muted} />
            </Pressable>
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : !filteredData || filteredData.length === 0 ? (
            <View style={styles.center}>
              <Text style={[typography.body, { color: colors.muted, textAlign: "center" }]}>
                {t("history.empty")}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.analiz_id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "70%",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 34,
    overflow: "hidden",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingTop: 20,
    paddingBottom: 14,
  },
  sheetTitle: {
    fontFamily: fonts.display700,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
  },
  itemRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  itemRowInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  itemName: {
    fontFamily: fonts.body600,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
});
