import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts, radius, spacing } from "@/theme/tokens";
import { AudienceSelector } from "@/components/profile/AudienceSelector";
import { FAMILY_ICON_OPTIONS, FAMILY_ICON_MAP } from "@/lib/familyIcons";
import { User } from "lucide-react-native";
import type { Database } from "@/lib/database.types";

type FamilyProfileRow = Database["public"]["Tables"]["aile_profilleri"]["Row"];

function IconDisplay({ iconKey, size, color }: { iconKey: string; size: number; color: string }) {
  const Icon = FAMILY_ICON_MAP[iconKey] ?? User;
  return <Icon size={size} color={color} />;
}

interface FamilyProfileModalProps {
  visible: boolean;
  profile: FamilyProfileRow | null;
  onSave: (data: { isim: string; ikon: string; audiences: string[] }) => void;
  onClose: () => void;
  isSaving: boolean;
}

export function FamilyProfileModal({
  visible,
  profile,
  onSave,
  onClose,
  isSaving,
}: FamilyProfileModalProps) {
  const { t } = useTranslation();
  const { colors, shadow } = useTheme();

  const [isim, setIsim] = useState(profile?.isim ?? "");
  const [ikon, setIkon] = useState<string>(profile?.ikon ?? "user");
  const [audiences, setAudiences] = useState<string[]>(profile?.audiences ?? []);

  // Reset state when profile changes
  const resetState = useCallback(() => {
    setIsim(profile?.isim ?? "");
    setIkon(profile?.ikon ?? "user");
    setAudiences(profile?.audiences ?? []);
  }, [profile]);

  const handleSave = useCallback(() => {
    if (!isim.trim()) return;
    onSave({ isim: isim.trim(), ikon, audiences });
  }, [isim, ikon, audiences, onSave]);

  const isEditing = !!profile;
  const title = isEditing ? t("family.editProfile") : t("family.addProfile");
  const canSave = isim.trim().length > 0 && !isSaving;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onShow={resetState}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("family.cancel")}
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
          >
            <X size={18} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name input */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{t("family.name")}</Text>
            <TextInput
              value={isim}
              onChangeText={setIsim}
              placeholder={t("family.namePlaceholder")}
              placeholderTextColor={colors.muted}
              maxLength={30}
              autoFocus={!isEditing}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
          </View>

          {/* Icon selection */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{t("family.icon")}</Text>
            <View style={styles.iconGrid}>
              {FAMILY_ICON_OPTIONS.map((option) => {
                const isSelected = ikon === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setIkon(option.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option.label}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: isSelected ? colors.surfaceTint : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderWidth: isSelected ? 1.5 : 1,
                      },
                      isSelected && shadow.low,
                    ]}
                  >
                    <IconDisplay
                      iconKey={option.key}
                      size={22}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Audience flags */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{t("family.audiences")}</Text>
            <AudienceSelector selected={audiences} onChange={setAudiences} />
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel={t("family.save")}
            style={[
              styles.saveBtn,
              {
                backgroundColor: canSave ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.saveBtnText, { color: colors.primaryFg }]}>
              {t("family.save")}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenX,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: fonts.display700,
    fontSize: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenX,
    paddingVertical: 20,
    gap: 24,
  },
  field: {
    gap: 10,
  },
  label: {
    fontFamily: fonts.display700,
    fontSize: 14,
  },
  input: {
    fontFamily: fonts.body500,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  iconOption: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: spacing.screenX,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontFamily: fonts.body700,
    fontSize: 15,
  },
});
