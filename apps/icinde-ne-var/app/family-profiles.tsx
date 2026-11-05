import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import {
  useFamilyProfiles,
  useAddFamilyProfile,
  useUpdateFamilyProfile,
  useDeleteFamilyProfile,
} from "@/hooks/useFamilyProfiles";
import { FamilyProfileCard } from "@/components/family/FamilyProfileCard";
import { FamilyProfileModal } from "@/components/family/FamilyProfileModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { useTheme, fonts, radius, spacing, typography } from "@/theme/tokens";
import type { Database } from "@/lib/database.types";

type FamilyProfileRow = Database["public"]["Tables"]["aile_profilleri"]["Row"];

const MAX_PROFILES = 5;

export default function FamilyProfilesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, shadow } = useTheme();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const activeFamilyProfileId = useAppStore((s) => s.activeFamilyProfileId);
  const setActiveFamilyProfileId = useAppStore((s) => s.setActiveFamilyProfileId);

  const { data: profiles, isLoading, isError, refetch } = useFamilyProfiles(userId);
  const addMutation = useAddFamilyProfile(userId);
  const updateMutation = useUpdateFamilyProfile(userId);
  const deleteMutation = useDeleteFamilyProfile(userId);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<FamilyProfileRow | null>(null);

  const handleAdd = useCallback(() => {
    if ((profiles?.length ?? 0) >= MAX_PROFILES) {
      Alert.alert(t("family.maxReached"));
      return;
    }
    setEditingProfile(null);
    setModalVisible(true);
  }, [profiles, t]);

  const handleEdit = useCallback((profile: FamilyProfileRow) => {
    setEditingProfile(profile);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    (profile: FamilyProfileRow) => {
      Alert.alert(t("family.deleteProfile"), t("family.deleteConfirm"), [
        { text: t("family.cancel"), style: "cancel" },
        {
          text: t("family.delete"),
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(profile.id);
            if (activeFamilyProfileId === profile.id) {
              setActiveFamilyProfileId(null);
            }
          },
        },
      ]);
    },
    [deleteMutation, activeFamilyProfileId, setActiveFamilyProfileId, t],
  );

  const handleSetActive = useCallback(
    (profile: FamilyProfileRow) => {
      setActiveFamilyProfileId(profile.id);
    },
    [setActiveFamilyProfileId],
  );

  const handleDeactivate = useCallback(() => {
    setActiveFamilyProfileId(null);
  }, [setActiveFamilyProfileId]);

  const handleSave = useCallback(
    async (data: { isim: string; ikon: string; audiences: string[] }) => {
      if (!userId) return;

      try {
        if (editingProfile) {
          await updateMutation.mutateAsync({
            id: editingProfile.id,
            updates: data,
          });
        } else {
          await addMutation.mutateAsync({
            user_id: userId,
            ...data,
          });
        }
        setModalVisible(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t("common.unknownError");
        if (message === "MAX_PROFILES_REACHED") {
          Alert.alert(t("family.maxReached"));
        } else {
          Alert.alert(t("common.error"), message);
        }
      }
    },
    [userId, editingProfile, updateMutation, addMutation, t],
  );

  if (isLoading) {
    return <LoadingScreen message={t("common.loading")} />;
  }

  if (isError) {
    return (
      <ErrorScreen title={t("common.error")} message={t("common.retryMessage")} onRetry={refetch} />
    );
  }

  const canAdd = (profiles?.length ?? 0) < MAX_PROFILES;
  const isSaving = addMutation.isPending || updateMutation.isPending;

  const renderItem = ({ item }: { item: FamilyProfileRow }) => (
    <FamilyProfileCard
      profile={item}
      isActive={activeFamilyProfileId === item.id}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
      onSetActive={() => handleSetActive(item)}
      onDeactivate={handleDeactivate}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconBox, { backgroundColor: colors.surfaceTint }]}>
        <Users size={36} color={colors.muted} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{t("family.empty")}</Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
        {t("family.emptyHint")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={18} color={colors.text} />
        </Pressable>
        <Text style={[typography.screenTitle, { color: colors.text, flex: 1 }]}>
          {t("family.title")}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Add button */}
      {canAdd && (
        <View style={styles.addBtnContainer}>
          <Pressable
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={t("family.addProfile")}
            style={[styles.addBtn, { backgroundColor: colors.primary }, shadow.primaryButton]}
          >
            {({ pressed }: { pressed: boolean }) => (
              <View
                style={[
                  styles.addBtnInner,
                  { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
                ]}
              >
                <View style={[styles.addIconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                  <Plus size={18} color={colors.primaryFg} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={[styles.addBtnText, { color: colors.primaryFg }]}>
                    {t("family.addProfile")}
                  </Text>
                  <Text style={[styles.addBtnHint, { color: "rgba(255,255,255,0.7)" }]}>
                    {t("family.remainingSlots", { count: MAX_PROFILES - (profiles?.length ?? 0) })}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {/* Modal */}
      <FamilyProfileModal
        visible={modalVisible}
        profile={editingProfile}
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.screenX,
    paddingTop: 6,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 120,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: fonts.display700,
    fontSize: 18,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: fonts.body400,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  addBtnContainer: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: 20,
    paddingTop: 8,
  },
  addBtn: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  addBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    fontFamily: fonts.body700,
    fontSize: 15,
  },
  addBtnHint: {
    fontFamily: fonts.body500,
    fontSize: 11,
    marginTop: 2,
  },
});
