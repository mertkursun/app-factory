import { View, Text } from "react-native";
import { useQuota } from "@/hooks/useQuota";
import { useAuthStore } from "@/stores/authStore";

const LOW_QUOTA_THRESHOLD = 1;

export function QuotaBadge() {
  const userId = useAuthStore((s) => s.user?.id);
  const { data: quota } = useQuota(userId);

  if (!quota) return null;

  if (quota.isPro) {
    return (
      <View className="bg-primary/20 rounded-full px-3 py-1">
        <Text className="text-primary text-xs font-label">PRO</Text>
      </View>
    );
  }

  const isLow = quota.remaining <= LOW_QUOTA_THRESHOLD;
  const isEmpty = quota.remaining === 0;

  return (
    <View
      className={`rounded-full px-3 py-1 ${
        isEmpty ? "bg-danger-light" : isLow ? "bg-warning-light" : "bg-surface"
      }`}
    >
      <Text
        className={`text-xs font-label ${
          isEmpty ? "text-danger-text" : isLow ? "text-warning-text" : "text-text-secondary"
        }`}
      >
        {quota.remaining}/{quota.limit} hak
      </Text>
    </View>
  );
}
