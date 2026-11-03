import { View, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";

interface SlideItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  width: number;
}

const ICON_SIZE = 64;

export function SlideItem({
  title,
  description,
  icon: IconComponent,
  iconColor,
  width,
}: SlideItemProps) {
  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="w-[200px] h-[200px] rounded-full bg-surface-secondary items-center justify-center mb-10">
        <IconComponent size={ICON_SIZE} color={iconColor} />
      </View>
      <Text className="text-[28px] font-display text-text text-center mb-3">{title}</Text>
      <Text className="text-base font-body text-text-secondary text-center leading-6 px-4">
        {description}
      </Text>
    </View>
  );
}
