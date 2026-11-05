import { View, Text, Pressable, StyleSheet } from "react-native";
import { Pencil, Trash2, Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius } from "@/theme/tokens";
import { FAMILY_ICON_MAP } from "@/lib/familyIcons";
import { AUDIENCE_LABELS } from "@/lib/constants";
import { User } from "lucide-react-native";
import type { Database } from "@/lib/database.types";

type FamilyProfileRow = Database["public"]["Tables"]["aile_profilleri"]["Row"];

function FamilyIcon({ iconKey, size, color }: { iconKey: string; size: number; color: string }) {
  const Icon = FAMILY_ICON_MAP[iconKey] ?? User;
  return <Icon size={size} color={color} />;
}

interface FamilyProfileCardProps {
  profile: FamilyProfileRow;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive: () => void;
}

export function FamilyProfileCard({
  profile,
  isActive,
  onEdit,
  onDelete,
  onSetActive,
}: FamilyProfileCardProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: isActive ? 1.5 : 1,
        },
        shadow.low,
      ]}
    >
      <View style={styles.row}>
        {/* Icon */}
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isActive ? colors.surfaceTint : colors.background,
            },
          ]}
        >
          <FamilyIcon
            iconKey={profile.ikon}
            size={22}
            color={isActive ? colors.primary : colors.textSecondary}
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {profile.isim}
            </Text>
            {isActive && (
              <View style={[styles.activeBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.activeBadgeText, { color: colors.successText }]}>
                  {t("family.active")}
                </Text>
              </View>
            )}
          </View>

          {/* Audience badges */}
          {profile.audiences.length > 0 && (
            <View style={styles.badgeRow}>
              {profile.audiences.map((audience) => (
                <View
                  key={audience}
                  style={[styles.audienceBadge, { backgroundColor: colors.surfaceTint }]}
                >
                  <Text style={[styles.audienceBadgeText, { color: colors.primaryDeep }]}>
                    {AUDIENCE_LABELS[audience] ?? audience}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        {!isActive && (
          <Pressable
            onPress={onSetActive}
            accessibilityRole="button"
            accessibilityLabel={t("family.setActive")}
            style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Check size={14} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>
              {t("family.setActive")}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t("family.editProfile")}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Pencil size={14} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>
            {t("family.editProfile")}
          </Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={t("family.delete")}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Trash2 size={14} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>{t("family.delete")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontFamily: fonts.display700,
    fontSize: 16,
    flexShrink: 1,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontFamily: fonts.body700,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  audienceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  audienceBadgeText: {
    fontFamily: fonts.body600,
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 44,
  },
  actionText: {
    fontFamily: fonts.body600,
    fontSize: 12,
  },
});
