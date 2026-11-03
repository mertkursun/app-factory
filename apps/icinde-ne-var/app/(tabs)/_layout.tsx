import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { ScanLine, History, User } from "lucide-react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICONS = [ScanLine, History, User] as const;
const TAB_LABELS = ["Tara", "Geçmiş", "Profil"] as const;

const ACTIVE_ICON_COLOR = "#FFFFFF";
const INACTIVE_ICON_COLOR = "#78716C";
const ICON_SIZE = 20;

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      className="absolute bottom-6 left-4 right-4 flex-row items-center justify-around rounded-full bg-surface px-2 py-3"
      style={{
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const IconComponent = TAB_ICONS[index];
        const label = TAB_LABELS[index];

        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={handlePress}
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            className={`flex-row items-center gap-2 rounded-full px-5 py-2 ${isFocused ? "bg-primary" : ""}`}
            style={{ minWidth: 48, minHeight: 44 }}
          >
            <IconComponent
              size={ICON_SIZE}
              color={isFocused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR}
            />
            {isFocused && <Text className="font-label text-sm text-white">{label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Tara" }} />
      <Tabs.Screen name="history" options={{ title: "Geçmiş" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
