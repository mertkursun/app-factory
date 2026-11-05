import { View, Text, Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/theme/tokens";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const containerLabel = description ? `${title}. ${description}` : title;

  return (
    <View
      className="flex-1 items-center justify-center px-8 gap-4"
      accessible
      accessibilityRole="summary"
      accessibilityLabel={containerLabel}
    >
      <View
        className="w-20 h-20 rounded-full bg-surface-secondary items-center justify-center"
        importantForAccessibility="no-hide-descendants"
      >
        <Icon size={36} color={colors.muted} />
      </View>
      <Text className="text-lg font-title text-text text-center">{title}</Text>
      {description ? (
        <Text className="text-sm font-body text-text-secondary text-center">{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="bg-primary px-6 h-12 rounded-full items-center justify-center active:opacity-70 active:scale-95"
        >
          <Text className="text-white text-sm font-label">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
