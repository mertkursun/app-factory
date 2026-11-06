import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { useTheme, fonts } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ChipProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function Chip({ emoji, label, isSelected, onToggle }: ChipProps) {
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isSelected ? colors.surfaceTint : colors.surface, {
      duration: 200,
    }),
    borderColor: withTiming(isSelected ? colors.primary : colors.border, { duration: 200 }),
    borderWidth: isSelected ? 1.5 : 1,
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={label}
      style={[
        animatedStyle,
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 18,
          gap: 8,
        },
        isSelected && {
          shadowColor: colors.primaryRing,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 3,
        },
      ]}
    >
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.body700,
          fontSize: 13,
          color: isSelected ? colors.primaryDeep : colors.textSecondary,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: isSelected ? colors.primary : "transparent",
          borderWidth: isSelected ? 0 : 1.5,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSelected && <Check size={12} color={colors.primaryFg} strokeWidth={3} />}
      </View>
    </AnimatedPressable>
  );
}
