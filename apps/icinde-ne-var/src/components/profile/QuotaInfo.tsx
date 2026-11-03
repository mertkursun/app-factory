import { View, Text } from "react-native";
import { FREE_MONTHLY_QUOTA } from "@/lib/constants";

interface QuotaInfoProps {
  used: number;
  remaining: number;
  isPro: boolean;
}

export function QuotaInfo({ used, remaining, isPro }: QuotaInfoProps) {
  if (isPro) {
    return (
      <View className="rounded-xl border border-border bg-surface p-4">
        <Text className="mb-1 font-label text-sm text-text">Aylık Kota</Text>
        <Text className="font-title text-2xl text-primary">Sınırsız</Text>
        <Text className="mt-1 font-caption text-xs text-text-secondary">Pro üyelik aktif</Text>
      </View>
    );
  }

  const total = FREE_MONTHLY_QUOTA;
  const progress = total > 0 ? Math.min(used / total, 1) : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <View className="rounded-xl border border-border bg-surface p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-label text-sm text-text">Aylık Kota</Text>
        <Text className="font-label text-sm text-text">
          {remaining}/{total} kalan
        </Text>
      </View>
      {/* Progress bar */}
      <View
        className="h-2 overflow-hidden rounded-full bg-surface-secondary"
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: total,
          now: used,
          text: `${used} / ${total} kullanıldı`,
        }}
      >
        <View
          className={`h-full rounded-full ${remaining <= 1 ? "bg-danger" : "bg-primary"}`}
          style={{ width: `${progressPercent}%` }}
        />
      </View>
      {remaining === 0 && (
        <Text className="mt-2 font-caption text-xs text-danger">
          Aylık kotanız doldu. Pro&apos;ya geçerek sınırsız tarama yapabilirsiniz.
        </Text>
      )}
    </View>
  );
}
