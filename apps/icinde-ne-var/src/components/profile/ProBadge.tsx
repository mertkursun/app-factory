import { View, Text, StyleSheet } from "react-native";
import { Crown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { fonts } from "@/theme/tokens";

export function ProBadge() {
  const { t } = useTranslation();

  return (
    <View style={styles.pill} accessibilityRole="text" accessibilityLabel={t("profile.proActive")}>
      <Crown size={10} color="#FFFFFF" />
      <Text style={styles.text}>{t("profile.proBadge")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontFamily: fonts.body800,
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
