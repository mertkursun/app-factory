import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";

export function DisclaimerNote() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return <Text style={[styles.text, { color: colors.muted }]}>{t("analysis.disclaimer")}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.body400,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
