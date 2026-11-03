import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings, LogOut, ChevronRight, Mail } from "lucide-react-native";
import { useAuthStore } from "@/stores/authStore";
import { useProfile, useUpdateProfile, useCreateProfile } from "@/hooks/useProfile";
import { useQuota } from "@/hooks/useQuota";
import { signOut } from "@/lib/auth";
import { AudienceSelector } from "@/components/profile/AudienceSelector";
import { QuotaInfo } from "@/components/profile/QuotaInfo";
import { ProBadge } from "@/components/profile/ProBadge";
import { useCallback, useState, useEffect } from "react";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: profile, isLoading: profileLoading } = useProfile(userId);
  const { data: quota, isLoading: quotaLoading } = useQuota(userId);
  const updateProfile = useUpdateProfile(userId ?? "");
  const createProfile = useCreateProfile();

  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Profil verisi geldiğinde seçili kitleleri senkronize et
  useEffect(() => {
    if (profile?.audiences) {
      setSelectedAudiences(profile.audiences);
    }
  }, [profile?.audiences]);

  const handleAudienceChange = useCallback(
    async (audiences: string[]) => {
      if (!userId) return;
      setSelectedAudiences(audiences);
      setIsSaving(true);

      try {
        if (profile) {
          await updateProfile.mutateAsync({ audiences });
        } else {
          await createProfile.mutateAsync({
            user_id: userId,
            audiences,
          });
        }
      } catch {
        // Hata durumunda önceki seçimlere geri dön
        setSelectedAudiences(profile?.audiences ?? []);
      } finally {
        setIsSaving(false);
      }
    },
    [profile, userId, updateProfile, createProfile],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

  // Loading durumu
  if (profileLoading || quotaLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#0F766E" />
      </SafeAreaView>
    );
  }

  // Hata durumu (user yoksa)
  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="font-body text-base text-text-secondary">Oturum bilgisi bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  // İsimden avatar baş harfleri
  const displayName = profile?.display_name ?? user.email ?? "";
  const initials = displayName
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-3">
          <Text className="font-title text-2xl text-text">Profil</Text>
          <Pressable
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel="Ayarlar"
            className="min-h-[44px] min-w-[44px] items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Settings size={22} className="text-muted" />
          </Pressable>
        </View>

        {/* Kullanıcı kartı */}
        <View className="mb-4 flex-row items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Text className="font-title text-lg text-primary-foreground">{initials || "?"}</Text>
          </View>
          <View className="flex-1">
            {profile?.display_name ? (
              <Text className="font-label text-base text-text">{profile.display_name}</Text>
            ) : null}
            <View className="flex-row items-center gap-2">
              <Mail size={14} className="text-muted" />
              <Text className="font-caption text-sm text-text-secondary">{user.email ?? "—"}</Text>
            </View>
            {quota?.isPro && (
              <View className="mt-1">
                <ProBadge />
              </View>
            )}
          </View>
        </View>

        {/* Kitle seçimi */}
        <View className="mb-6">
          <Text className="font-title text-lg text-text">Kitle Seçimi</Text>
          <Text className="mb-3 font-caption text-sm text-text-secondary">
            Sana özel uyarılar için seç.
          </Text>
          <AudienceSelector
            selected={selectedAudiences}
            onChange={handleAudienceChange}
            disabled={isSaving}
          />
          {isSaving && <ActivityIndicator size="small" color="#0F766E" className="mt-2" />}
        </View>

        {/* Kota bilgisi */}
        {quota && (
          <View className="mb-4">
            <QuotaInfo used={quota.used} remaining={quota.remaining} isPro={quota.isPro} />
          </View>
        )}

        {/* Pro'ya geç butonu (Pro değilse) */}
        {quota && !quota.isPro && (
          <Pressable
            onPress={() => router.push("/paywall")}
            accessibilityRole="button"
            accessibilityLabel="Pro'ya Geç — Sınırsız Tarama"
            className="mb-6 h-12 items-center justify-center rounded-xl bg-primary"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="font-label text-primary-foreground">
              Pro&apos;ya Geç — Sınırsız Tarama
            </Text>
          </Pressable>
        )}

        {/* Ayarlar */}
        <Pressable
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Ayarlar"
          className="mb-4 min-h-[44px] flex-row items-center gap-3 rounded-xl border border-border bg-surface p-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Settings size={20} className="text-muted" />
          <Text className="flex-1 font-body text-base text-text">Ayarlar</Text>
          <ChevronRight size={18} className="text-muted" />
        </Pressable>

        {/* Çıkış */}
        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Çıkış Yap"
          className="mb-8 min-h-[44px] flex-row items-center gap-3 rounded-xl border border-danger/30 bg-surface p-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <LogOut size={20} className="text-danger" />
          <Text className="flex-1 font-body text-base text-danger">Çıkış Yap</Text>
        </Pressable>

        {/* Bottom spacer for floating tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
