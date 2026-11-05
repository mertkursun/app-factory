import { useRef, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pencil, Trash2, Check, UserMinus } from "lucide-react-native";
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

const ACTION_WIDTH = 72;

interface FamilyProfileCardProps {
  profile: FamilyProfileRow;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive: () => void;
  onDeactivate: () => void;
}

export function FamilyProfileCard({
  profile,
  isActive,
  onEdit,
  onDelete,
  onSetActive,
  onDeactivate,
}: FamilyProfileCardProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const closeSwipeable = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const handleSetActive = useCallback(() => {
    closeSwipeable();
    onSetActive();
  }, [closeSwipeable, onSetActive]);

  const handleDeactivate = useCallback(() => {
    closeSwipeable();
    onDeactivate();
  }, [closeSwipeable, onDeactivate]);

  const handleEdit = useCallback(() => {
    closeSwipeable();
    onEdit();
  }, [closeSwipeable, onEdit]);

  const handleDelete = useCallback(() => {
    closeSwipeable();
    onDelete();
  }, [closeSwipeable, onDelete]);

  const renderRightActions = useCallback(() => {
    return (
      <View style={[styles.rightActions, { width: ACTION_WIDTH * 3 }]}>
        {isActive ? (
          <Pressable
            onPress={handleDeactivate}
            accessibilityRole="button"
            accessibilityLabel={t("family.deactivate")}
            style={[styles.swipeAction, { backgroundColor: colors.warning }]}
          >
            <UserMinus size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.swipeActionText}>{t("family.deactivate")}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSetActive}
            accessibilityRole="button"
            accessibilityLabel={t("family.setActive")}
            style={[styles.swipeAction, { backgroundColor: colors.success }]}
          >
            <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.swipeActionText}>{t("family.setActive")}</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleEdit}
          accessibilityRole="button"
          accessibilityLabel={t("family.editProfile")}
          style={[styles.swipeAction, { backgroundColor: colors.primary }]}
        >
          <Pencil size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.swipeActionText}>{t("family.editProfile")}</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={t("family.delete")}
          style={[
            styles.swipeAction,
            styles.swipeActionLast,
            { backgroundColor: colors.danger },
          ]}
        >
          <Trash2 size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.swipeActionText}>{t("family.delete")}</Text>
        </Pressable>
      </View>
    );
  }, [isActive, colors, t, handleSetActive, handleDeactivate, handleEdit, handleDelete]);

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
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
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  rightActions: {
    flexDirection: "row",
  },
  swipeAction: {
    width: ACTION_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  swipeActionLast: {
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  swipeActionText: {
    fontFamily: fonts.body600,
    fontSize: 10,
    color: "#FFFFFF",
  },
});
