import { Text, StyleSheet } from "react-native";
import { useTheme, fonts } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";

interface ExplanationCardProps {
  text: string;
}

export function ExplanationCard({ text }: ExplanationCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
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
