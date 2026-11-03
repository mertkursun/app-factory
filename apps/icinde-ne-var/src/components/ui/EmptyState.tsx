import { View, Text, Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";

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
  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <View className="w-20 h-20 rounded-full bg-surface-secondary items-center justify-center">
        <Icon size={36} color="#78716C" />
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
          className="bg-primary px-6 h-12 rounded-full items-center justify-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Text className="text-white text-sm font-label">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
