import { View, Text, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, withTiming, LinearTransition } from "react-native-reanimated";
import { ScanLine, History, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";

interface TabRoute {
  key: string;
  name: string;
}

interface TabBarState {
  routes: TabRoute[];
  index: number;
}

interface FloatingTabBarProps {
  state: TabBarState;
  navigateToTab: (key: string) => void;
}

const TAB_ICONS = [ScanLine, History, User] as const;
const ICON_SIZE = 20;
const BAR_HEIGHT = 66;
const ITEM_HEIGHT = 54;

const AnimatedView = Animated.createAnimatedComponent(View);

function TabItem({
  index,
  isFocused,
  onPress,
  label,
}: {
  index: number;
  isFocused: boolean;
  onPress: () => void;
  label: string;
}) {
  const { colors, gradient } = useTheme();
  const IconComponent = TAB_ICONS[index];

  const animatedStyle = useAnimatedStyle(() => ({
    flex: withTiming(isFocused ? 1.5 : 1, { duration: 250 }),
  }));

  return (
    <AnimatedView
      style={[animatedStyle, { height: ITEM_HEIGHT }]}
      layout={LinearTransition.duration(250)}
    >
      <Pressable
        onPress={onPress}
        accessibilityLabel={label}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
        }}
      >
        {isFocused ? (
          <LinearGradient
            colors={[...gradient.primary]}
            locations={[...gradient.primaryLocations]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              {
                flex: 1,
                width: "100%",
                borderRadius: 27,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              },
              {
                shadowColor: colors.primaryShadow,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 1,
                shadowRadius: 10,
                elevation: 6,
              },
            ]}
          >
            <IconComponent size={ICON_SIZE} color={colors.primaryFg} />
            <Text style={{ fontFamily: fonts.body700, fontSize: 12, color: colors.primaryFg }}>
              {label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <IconComponent size={ICON_SIZE} color={colors.muted} />
          </View>
        )}
      </Pressable>
    </AnimatedView>
  );
}

export function FloatingTabBar({ state, navigateToTab }: FloatingTabBarProps) {
  const { t } = useTranslation();
  const { colors, shadow, isDark } = useTheme();
  const tabLabels = [t("tabs.scan"), t("tabs.history"), t("tabs.profile")];

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        gap: 4,
        height: BAR_HEIGHT,
      }}
    >
      {state.routes.map((route: TabRoute, index: number) => (
        <TabItem
          key={route.key}
          index={index}
          isFocused={state.index === index}
          onPress={() => {
            if (state.index !== index) navigateToTab(route.key);
          }}
          label={tabLabels[index]}
        />
      ))}
    </View>
  );

  const containerStyle = {
    position: "absolute" as const,
    left: 18,
    right: 18,
    bottom: 18,
    height: BAR_HEIGHT,
    borderRadius: 33,
    overflow: "hidden" as const,
    ...shadow.tabBar,
  };

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={24}
        tint={isDark ? "dark" : "light"}
        style={[
          containerStyle,
          {
            borderWidth: 1,
            borderColor: colors.glassBorder,
          },
        ]}
      >
        {content}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      {content}
    </View>
  );
}
