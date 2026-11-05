import { View, Text, StyleSheet } from "react-native";
import { Leaf } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { useTheme, fonts, spacing, radius } from "@/theme/tokens";

const alternativeSchema = z.object({
  name: z.string(),
  reason: z.string(),
});

type Alternative = z.infer<typeof alternativeSchema>;

interface AlternativesListProps {
  data: unknown;
}

function parseAlternatives(data: unknown): Alternative[] {
  const result = z.array(alternativeSchema).safeParse(data);
  return result.success ? result.data : [];
}

export function AlternativesList({ data }: AlternativesListProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const alternatives = parseAlternatives(data);

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={t("analysis.alternatives")}
    >
      <View style={styles.header}>
        <Leaf size={16} color={colors.success} strokeWidth={2.5} />
        <Text style={[styles.title, { color: colors.text }]}>{t("analysis.alternatives")}</Text>
      </View>
      <Text style={[styles.hint, { color: colors.muted }]}>{t("analysis.alternativesHint")}</Text>
      <View style={styles.list}>
        {alternatives.map((alt) => (
          <Card
            key={alt.name}
            style={styles.card}
            accessible
            accessibilityLabel={`${alt.name}: ${alt.reason}`}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.successBg }]}>
                <Leaf size={14} color={colors.success} strokeWidth={2} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.altName, { color: colors.text }]} numberOfLines={1}>
                  {alt.name}
                </Text>
                <Text style={[styles.altReason, { color: colors.muted }]} numberOfLines={2}>
                  {alt.reason}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: fonts.display700,
    fontSize: 15,
    lineHeight: 19.5,
  },
  hint: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  list: {
    gap: 8,
  },
  card: {
    padding: spacing.lg,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  altName: {
    fontFamily: fonts.body700,
    fontSize: 13,
    lineHeight: 18,
  },
  altReason: {
    fontFamily: fonts.body400,
    fontSize: 12,
    lineHeight: 18,
  },
});
