import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme, fonts } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";

interface ExplanationCardProps {
  text: string;
}

export function ExplanationCard({ text }: ExplanationCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      style={styles.card}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${t("analysis.explanation")}: ${text}`}
    >
      <Text style={[styles.body, { color: colors.textSecondary }]}>{text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  body: {
    fontFamily: fonts.body400,
    fontSize: 13,
    lineHeight: 20.8,
  },
});
