import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { FloatingTabBar } from "@/components/ui/FloatingTabBar";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t("tabs.scan") }} />
      <Tabs.Screen name="history" options={{ title: t("tabs.history") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    </Tabs>
  );
}
