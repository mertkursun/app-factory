import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { FloatingTabBar } from "@/components/ui/FloatingTabBar";
import { useTheme } from "@/theme/tokens";

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.scan") }} />
      <Tabs.Screen name="search" options={{ title: t("tabs.search") }} />
      <Tabs.Screen name="history" options={{ title: t("tabs.history") }} />
      <Tabs.Screen name="favorites" options={{ title: t("tabs.favorites") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    </Tabs>
  );
}
